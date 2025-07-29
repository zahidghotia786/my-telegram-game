import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameType: { type: String, required: true },
  betAmount: { type: Number, required: true },
  selectedNumber: { type: Number },
  result: { type: Number, required: true },
  payout: { type: Number, required: true },
  win: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Game = mongoose.model('GameBot', gameSchema);

export default Game;