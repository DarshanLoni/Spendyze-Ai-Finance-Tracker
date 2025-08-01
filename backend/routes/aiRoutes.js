

import express from 'express';
import { getAiSummary, scanBill, getChatResponse } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getAiSummary);
router.post('/scan', protect, scanBill);
router.post('/chat', protect, getChatResponse);

export default router;
