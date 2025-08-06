import express from 'express';
import { getTransactions, addTransaction, deleteTransaction, updateTransaction, checkBudgetAlerts } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

// Specific routes MUST be defined before generic routes with parameters.
// This prevents '/check-alerts' from being incorrectly captured by '/:id'.
router.route('/check-alerts')
    .post(protect, checkBudgetAlerts);
    
router.route('/:id')
    .delete(protect, deleteTransaction)
    .put(protect, updateTransaction);

export default router;