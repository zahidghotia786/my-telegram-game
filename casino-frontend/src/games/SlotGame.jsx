import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CustomButton } from '../components/common/CustomButton';

const SlotGame = ({ gameData, updateGameData, betAmount, setBetAmount, getCurrentVIPLevel, setCurrentScreen }) => {
  const [slots, setSlots] = useState(['🎰', '🎰', '🎰']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState('');

  const symbols = ['🍒', '🔔', '🍋', '💎', '⭐', '7️⃣', '🍀', '💰'];

  const saveToLocalStorage = (data) => {
    localStorage.setItem('vipCasinoGameData', JSON.stringify(data));
  };

  const spinSlots = async () => {
    if (gameData.balance < betAmount || isSpinning) return;

    setIsSpinning(true);
    setMessage('');

    const spinStartData = {
      ...gameData,
      balance: gameData.balance - betAmount,
      gamesPlayed: gameData.gamesPlayed + 1
    };
    updateGameData(spinStartData);
    saveToLocalStorage(spinStartData);

    // Spinning animation
    for (let i = 0; i < 20; i++) {
      setSlots(prev => prev.map(() => symbols[Math.floor(Math.random() * symbols.length)]));
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const newSlots = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    setSlots(newSlots);

    let winAmount = 0;
    const vipMultiplier = getCurrentVIPLevel().multiplier;

    if (newSlots[0] === newSlots[1] && newSlots[1] === newSlots[2]) {
      if (newSlots[0] === '💰') winAmount = betAmount * 50 * vipMultiplier;
      else if (newSlots[0] === '7️⃣') winAmount = betAmount * 30 * vipMultiplier;
      else if (newSlots[0] === '💎') winAmount = betAmount * 20 * vipMultiplier;
      else winAmount = betAmount * 10 * vipMultiplier;

      setMessage(`🎉 JACKPOT! +${winAmount} coins!`);
    } else if (newSlots[0] === newSlots[1] || newSlots[1] === newSlots[2] || newSlots[0] === newSlots[2]) {
      winAmount = betAmount * 2 * vipMultiplier;
      setMessage(`🎊 Two Match! +${winAmount} coins!`);
    } else {
      setMessage('😔 Better luck next time!');
    }

    if (winAmount > 0) {
      const winUpdate = {
        ...spinStartData,
        balance: spinStartData.balance + winAmount,
        totalWins: spinStartData.totalWins + 1,
        bestWin: Math.max(spinStartData.bestWin, winAmount)
      };
      updateGameData(winUpdate);
      saveToLocalStorage(winUpdate);
    } else {
      const lossUpdate = {
        ...spinStartData,
        totalLosses: spinStartData.totalLosses + 1
      };
      updateGameData(lossUpdate);
      saveToLocalStorage(lossUpdate);
    }

    setIsSpinning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-gray-900 to-black text-white p-4">
      {/* Slot Machine */}
            <div className="flex items-center justify-between mb-6">
              <CustomButton
                variant="secondary"
                onClick={() => setCurrentScreen('home')}
                className="px-3 py-2"
              >
                ← Back
              </CustomButton>
              <h1 className="text-2xl font-bold text-purple-400">👤 Slot Game</h1>
              <div></div>
            </div>

      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6 mb-6 border-2 border-yellow-500/50">
        <div className="flex justify-center items-center space-x-4 mb-6">
          {slots.map((symbol, index) => (
            <motion.div
              key={index}
              animate={isSpinning ? { rotateY: 360 } : {}}
              transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
              className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center text-4xl border-2 border-yellow-400/50"
            >
              {symbol}
            </motion.div>
          ))}
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 p-3 bg-white/10 rounded-lg"
          >
            <p className="font-bold text-lg">{message}</p>
          </motion.div>
        )}

        {/* Bet Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
            className="w-10 h-10 bg-red-500 rounded-full text-white font-bold"
            disabled={isSpinning}
          >
            -
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-300">Bet Amount</p>
            <p className="text-xl font-bold">{betAmount}</p>
          </div>
          <button
            onClick={() => setBetAmount(Math.min(gameData.balance, betAmount + 10))}
            className="w-10 h-10 bg-green-500 rounded-full text-white font-bold"
            disabled={isSpinning}
          >
            +
          </button>
        </div>

        <CustomButton
          onClick={spinSlots}
          disabled={isSpinning || gameData.balance < betAmount}
          variant="warning"
          className="w-full py-4 text-xl"
        >
          {isSpinning ? '🎰 Spinning...' : '🎰 SPIN'}
        </CustomButton>
      </div>

      {/* VIP Multiplier Info */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
        <p className="text-sm text-gray-300">VIP Multiplier: {getCurrentVIPLevel().multiplier}x</p>
        <p className="text-xs text-purple-300">Level up for higher multipliers!</p>
      </div>


    </div>
  );
};

export default SlotGame;
