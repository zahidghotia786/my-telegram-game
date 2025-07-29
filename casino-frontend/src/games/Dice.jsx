import React, { useState } from "react";
import { motion } from "framer-motion";
import { CustomButton } from "../components/common/CustomButton";

const DiceGame = ({
  gameData,
  updateGameData,
  betAmount,
  setBetAmount,
  getCurrentVIPLevel,
  setCurrentScreen,
}) => {
  const [dice, setDice] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [prediction, setPrediction] = useState("high");
  const [message, setMessage] = useState("");

  const saveToLocalStorage = (data) => {
    localStorage.setItem("vipCasinoGameData", JSON.stringify(data));
  };

  const rollDice = async () => {
    if (gameData.balance < betAmount || isRolling) return;

    setIsRolling(true);

    const startData = {
      ...gameData,
      balance: gameData.balance - betAmount,
      gamesPlayed: gameData.gamesPlayed + 1,
    };
    updateGameData(startData);
    saveToLocalStorage(startData);

    // Rolling animation
    for (let i = 0; i < 15; i++) {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const finalDice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    setDice(finalDice);

    const sum = finalDice[0] + finalDice[1];
    let won = false;
    let winAmount = 0;

    if (
      (prediction === "high" && sum >= 8) ||
      (prediction === "low" && sum <= 6)
    ) {
      won = true;
      winAmount = betAmount * 2 * getCurrentVIPLevel().multiplier;
      setMessage(`🎉 You won! Sum: ${sum} - +${winAmount} coins!`);

      const winData = {
        ...startData,
        balance: startData.balance + winAmount,
        totalWins: startData.totalWins + 1,
        bestWin: Math.max(startData.bestWin, winAmount),
      };
      updateGameData(winData);
      saveToLocalStorage(winData);
    } else {
      setMessage(
        `😔 You lost! Sum: ${sum} was ${
          sum >= 8 ? "high" : sum <= 6 ? "low" : "middle"
        }`
      );
      const lossData = {
        ...startData,
        totalLosses: startData.totalLosses + 1,
      };
      updateGameData(lossData);
      saveToLocalStorage(lossData);
    }

    setIsRolling(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black text-white p-4">
      <div className="flex items-center justify-between mb-6">
        <CustomButton
          variant="secondary"
          onClick={() => setCurrentScreen("home")}
          className="px-3 py-2"
        >
          ← Back
        </CustomButton>
        <h1 className="text-2xl font-bold text-purple-400">👤 Dice Game</h1>
        <div></div>
      </div>

      {/* Dice Game */}
      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 mb-6 border-2 border-blue-500/50">
        <div className="flex justify-center items-center space-x-6 mb-6">
          {dice.map((die, index) => (
            <motion.div
              key={index}
              animate={isRolling ? { rotateX: 360, rotateY: 360 } : {}}
              transition={{ duration: 0.1, repeat: isRolling ? Infinity : 0 }}
              className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center text-4xl font-bold border-2 border-blue-400/50"
            >
              {die}
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-4">
          <p className="text-lg">
            Sum: <span className="font-bold">{dice[0] + dice[1]}</span>
          </p>
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

        {/* Prediction */}
        <div className="mb-4">
          <p className="text-center mb-3 text-sm text-gray-300">
            Predict the sum:
          </p>
          <div className="flex space-x-3">
            <CustomButton
              onClick={() => setPrediction("low")}
              variant={prediction === "low" ? "success" : "secondary"}
              className="flex-1"
              disabled={isRolling}
            >
              Low (2-6)
            </CustomButton>
            <CustomButton
              onClick={() => setPrediction("high")}
              variant={prediction === "high" ? "success" : "secondary"}
              className="flex-1"
              disabled={isRolling}
            >
              High (8-12)
            </CustomButton>
          </div>
        </div>

        {/* Bet Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
            className="w-10 h-10 bg-red-500 rounded-full text-white font-bold"
            disabled={isRolling}
          >
            -
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-300">Bet Amount</p>
            <p className="text-xl font-bold">{betAmount}</p>
          </div>
          <button
            onClick={() =>
              setBetAmount(Math.min(gameData.balance, betAmount + 10))
            }
            className="w-10 h-10 bg-green-500 rounded-full text-white font-bold"
            disabled={isRolling}
          >
            +
          </button>
        </div>

        <CustomButton
          onClick={rollDice}
          disabled={isRolling || gameData.balance < betAmount}
          variant="primary"
          className="w-full py-4 text-xl"
        >
          {isRolling ? "🎲 Rolling..." : "🎲 ROLL DICE"}
        </CustomButton>
      </div>

      {/* Game Rules */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
        <h3 className="font-bold mb-2">📋 Rules:</h3>
        <p className="text-sm text-gray-300">
          • Predict if sum will be Low (2-6) or High (8-12)
          <br />
          • Sum of 7 = automatic loss
          <br />
          • Win pays 2x your bet + VIP multiplier
          <br />• VIP Multiplier: {getCurrentVIPLevel().multiplier}x
        </p>
      </div>
    </div>
  );
};

export default DiceGame;
