import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router();

// Get user balance
router.get('/balance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('balance');
    res.status(200).json({ success: true, balance: user.balance });
  } catch (error) {
    console.error('❌ Balance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching balance' 
    });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { username } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username },
      { new: true }
    ).select('-password');

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating profile' 
    });
  }
});

export default router;