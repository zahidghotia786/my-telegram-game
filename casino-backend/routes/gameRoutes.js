import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Game from '../models/gameModel.js';
import User from '../models/userModel.js';

const router = express.Router();

// Play dice game
router.post('/dice', protect, async (req, res) => {
  try {
    const { betAmount, selectedNumber } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!betAmount || !selectedNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bet amount and number are required' 
      });
    }

    if (selectedNumber < 1 || selectedNumber > 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Number must be between 1 and 6' 
      });
    }

    // Check user balance
    const user = await User.findById(userId);
    if (user.balance < betAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }

    // Process game
    const result = Math.floor(Math.random() * 6) + 1;
    const win = result === selectedNumber;
    const payout = win ? betAmount * 5 : 0;

    // Update user balance
    user.balance = win ? user.balance + payout : user.balance - betAmount;
    await user.save();

    // Record game
    const game = await Game.create({
      user: userId,
      gameType: 'dice',
      betAmount,
      selectedNumber,
      result,
      payout,
      win
    });

    res.status(200).json({
      success: true,
      result,
      newBalance: user.balance,
      win,
      payout
    });

  } catch (error) {
    console.error('❌ Game error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during game processing' 
    });
  }
});

// Get game history
router.get('/history', protect, async (req, res) => {
  try {
    const games = await Game.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({ success: true, games });
  } catch (error) {
    console.error('❌ History error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching history' 
    });
  }
});

export default router;