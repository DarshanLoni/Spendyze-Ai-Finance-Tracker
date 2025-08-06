
import Transaction from '../models/transactionModel.js';
import { generateFinancialSummary, analyzeBillWithAI, getChatbotResponse, recommendBudgetWithAI } from '../services/aiService.js';

// @desc    Get AI-generated financial summary
// @route   GET /api/ai/summary
// @access  Private
const getAiSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 }).limit(30);
        if (transactions.length === 0) {
            return res.status(200).json({ summary: "Not enough data for a summary. Add some transactions first!" });
        }

        const summary = await generateFinancialSummary(transactions);
        res.status(200).json({ summary });
    } catch (error) {
        console.error('AI Summary Error:', error);
        res.status(500).json({ message: "Failed to generate AI summary." });
    }
};

// @desc    Scan a bill image and extract data
// @route   POST /api/ai/scan
// @access  Private
const scanBill = async (req, res) => {
    const { image } = req.body; // base64 encoded image string
    if (!image) {
        return res.status(400).json({ message: 'No image data provided.' });
    }

    try {
        const scannedData = await analyzeBillWithAI(image);
        res.status(200).json({ scannedData });
    } catch (error) {
        console.error('AI Bill Scan Error:', error);
        res.status(500).json({ message: "Failed to analyze the bill with AI." });
    }
};


// @desc    Get a response from the financial chatbot
// @route   POST /api/ai/chat
// @access  Private
const getChatResponse = async (req, res) => {
    const { history } = req.body; // Array of message objects { sender, text }

    if (!history || history.length === 0) {
        return res.status(400).json({ message: 'No chat history provided.' });
    }
    
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 }).limit(50);
        const responseText = await getChatbotResponse(history, transactions);
        res.status(200).json({ text: responseText });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ message: "Failed to get a response from the chatbot." });
    }
};

// @desc    Get AI-generated budget recommendation
// @route   GET /api/ai/recommend-budget
// @access  Private
const getRecommendedBudget = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 }).limit(200);
        
        const incomeCount = transactions.filter(t => t.type === 'Income').length;
        const expenseCount = transactions.filter(t => t.type === 'Expense').length;

        if (incomeCount < 1 || expenseCount < 5) {
            return res.status(400).json({ message: "Not enough transaction data. Please add at least one income and a few expense records to generate a budget." });
        }

        const recommendedBudget = await recommendBudgetWithAI(transactions);
        res.status(200).json(recommendedBudget);

    } catch (error) {
        console.error('AI Budget Recommendation Error:', error);
        // It's possible the AI returns an error or malformed JSON.
        // We'll return a more specific message if that's the case.
        const errorMessage = error.message.includes("Failed to generate budget with AI")
            ? "Our AI had trouble analyzing your spending patterns. Please try again after adding more varied transactions."
            : "A server error occurred while generating your budget.";
        res.status(500).json({ message: errorMessage });
    }
};


export { getAiSummary, scanBill, getChatResponse, getRecommendedBudget };
