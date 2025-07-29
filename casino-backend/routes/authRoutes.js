import express from 'express';
import { authenticate } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth
router.post('/auth', authenticate);

export default router;
