import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';
import { sendBudgetAlertEmail } from '../services/emailService.js';
import { generateFinancialSummary } from '../services/aiService.js';


// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
    const { type, title, amount, date, category, description } = req.body;

    if (!type || !title || !amount || !date || !category) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const transaction = await Transaction.create({
        user: req.user.id,
        type,
        title,
        amount,
        date,
        category,
        description,
    });

    res.status(201).json(transaction);
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    const { type, title, amount, date, category, description } = req.body;

    if (!type || !title || !amount || !date || !category) {
        return res.status(400).json({ message: 'Please provide all required fields for the update.' });
    }

    try {
        // Find the transaction by its ID and the user ID to ensure ownership, and update it.
        // This is an atomic operation.
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { type, title, amount, date, category, description }, // Explicitly set the fields to update
            { new: true, runValidators: true } // Options: return the new version, run schema validators
        );

        if (!updatedTransaction) {
            // If nothing was updated, it means either the transaction doesn't exist
            // or it doesn't belong to the logged-in user.
            // Returning 404 is a secure way to handle both cases.
            return res.status(404).json({ message: 'Transaction not found or user not authorized' });
        }

        res.status(200).json(updatedTransaction);

    } catch (error) {
        console.error('Update Transaction Error:', error);
        // This could be a Mongoose validation error
        res.status(500).json({ message: 'Server error while updating transaction.' });
    }
};


// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id });
};

// @desc    Check for budget alerts and send email if threshold is met
// @route   POST /api/transactions/check-alerts
// @access  Private
const checkBudgetAlerts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const transactions = await Transaction.find({ user: userId });
        const { totalIncome, totalExpenses } = transactions.reduce(
            (acc, t) => {
                if (t.type === 'Income') acc.totalIncome += t.amount;
                else acc.totalExpenses += t.amount;
                return acc;
            }, { totalIncome: 0, totalExpenses: 0 }
        );

        if (totalIncome === 0) {
            return res.status(200).json({ message: 'No income to check against.' });
        }

        const usagePercentage = (totalExpenses / totalIncome) * 100;
        const thresholdsToAnnounce = [100, 90]; // Check from highest to lowest

        for (const threshold of thresholdsToAnnounce) {
            if (usagePercentage >= threshold && !user.notifiedThresholds.includes(threshold)) {
                
                // Generate AI summary for the email
                const aiSummary = await generateFinancialSummary(transactions, 'for an email alert');
                
                // Send email
                await sendBudgetAlertEmail(user, transactions, totalIncome, totalExpenses, threshold, aiSummary);

                // Update user's notified thresholds and save
                user.notifiedThresholds.push(threshold);
                await user.save();
                
                // We only send one alert at a time to avoid spamming
                return res.status(200).json({ message: `Alert sent for ${threshold}% threshold.` });
            }
        }

        res.status(200).json({ message: 'No new alerts to send.' });

    } catch (error) {
        console.error('Error checking budget alerts:', error);
        res.status(500).json({ message: 'Server error while checking alerts.' });
    }
};


export { getTransactions, addTransaction, updateTransaction, deleteTransaction, checkBudgetAlerts };