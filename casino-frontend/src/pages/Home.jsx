import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlotGame from '../games/SlotGame';
import DiceGame from '../games/Dice';
import Profile from '../components/Profile';
import { vipLevels } from '../components/common/VIPLevels';

// Load user from 'vipCasinoUser' key
const loadUserFromStorage = () => {
  try {
    const stored = localStorage.getItem('vipCasinoUser');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed.user || null;
  } catch {
    return null;
  }
};

// Save user to 'vipCasinoUser' key
const saveUserToStorage = (user) => {
  const data = { user };
  localStorage.setItem('vipCasinoUser', JSON.stringify(data));
};

// Load game data from 'vipCasinoGameData' key
const loadGameFromStorage = () => {
  try {
    const stored = localStorage.getItem('vipCasinoGameData');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// Save game data to 'vipCasinoGameData' key
const saveGameToStorage = (gameData) => {
  localStorage.setItem('vipCasinoGameData', JSON.stringify(gameData));
};

const defaultUser = {
  first_name: 'Player',
  username: 'vip_player',
  photo_url: null,
};

const defaultGameData = {
  balance: 1000,
  totalWins: 0,
  totalLosses: 0,
  bestWin: 0,
  gamesPlayed: 0,
  achievements: [],
  vipLevel: 1,
  experience: 0,
};

const Home = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState(() => loadUserFromStorage() || defaultUser);
  const [gameData, setGameData] = useState(() => loadGameFromStorage() || defaultGameData);
  const [betAmount, setBetAmount] = useState(50);
  const [message, setMessage] = useState('');

  // Update user and save to storage
  const updateUser = useCallback((updates) => {
    setUser((prevUser) => {
      const updated = { ...prevUser, ...updates };
      saveUserToStorage(updated);
      return updated;
    });
  }, []);

  // Update game data and save to storage
  const updateGameData = useCallback((updates) => {
    setGameData((prevData) => {
      const updated = { ...prevData, ...updates };
      saveGameToStorage(updated);
      return updated;
    });
  }, []);

  // Avoid mutating vipLevels by creating a reversed copy
  const getCurrentVIPLevel = () => {
    return [...vipLevels]
      .reverse()
      .find((level) => gameData.experience >= level.min) || vipLevels[0];
  };

  // Update XP and notify on VIP level up
  const addExperience = (amount) => {
    const oldLevel = getCurrentVIPLevel().level;
    const newExp = gameData.experience + amount;

    const newLevel =
      [...vipLevels].reverse().find((level) => newExp >= level.min)?.level || 1;

    updateGameData({ experience: newExp });

    if (newLevel > oldLevel) {
      const levelName = vipLevels.find((l) => l.level === newLevel)?.name;
      setMessage(`🎉 VIP Level Up! You're now ${levelName}!`);
    }
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white/10 backdrop-blur-md rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
            {user.first_name?.[0] || 'P'}
          </div>
          <div>
            <p className="font-semibold">{user.first_name} {user.last_name }</p>
            <p className="text-sm text-gray-300">@{user.id}</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentScreen('profile')}
          className="text-purple-400 hover:text-purple-300"
          aria-label="Go to Profile"
        >
          ⚙️
        </button>
      </div>

      {/* Balance & VIP Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-4 border border-green-500/30">
          <p className="text-green-400 text-sm">Balance</p>
          <p className="text-2xl font-bold text-white">
            {gameData.balance.toLocaleString()}
          </p>
          <p className="text-xs text-green-300">💰 Coins</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4 border border-purple-500/30">
          <p className="text-purple-400 text-sm">VIP Status</p>
          <p className={`text-xl font-bold ${getCurrentVIPLevel().color}`}>
            {getCurrentVIPLevel().name}
          </p>
          <p className="text-xs text-purple-300">
            Level {getCurrentVIPLevel().level}
          </p>
        </div>
      </div>

      {/* Games */}
      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-bold text-center mb-4">🎮 Choose Your Game</h2>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentScreen('slots')}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-yellow-400">🎰 Slot Machine</h3>
              <p className="text-sm text-gray-300">Match symbols to win big!</p>
            </div>
            <div className="text-3xl">🎰</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentScreen('dice')}
          className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-blue-400">🎲 Dice Game</h3>
              <p className="text-sm text-gray-300">Predict high or low!</p>
            </div>
            <div className="text-3xl">🎲</div>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{gameData.totalWins}</p>
          <p className="text-xs text-gray-400">Wins</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{gameData.totalLosses}</p>
          <p className="text-xs text-gray-400">Losses</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-400">{gameData.gamesPlayed}</p>
          <p className="text-xs text-gray-400">Games</p>
        </div>
      </div>

      {/* Optional message display */}
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-700/80 text-white px-4 py-2 rounded-md">
          {message}
          <button
            onClick={() => setMessage('')}
            className="ml-2 font-bold hover:text-gray-300"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'slots' && (
            <SlotGame
              gameData={gameData}
              updateGameData={updateGameData}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              getCurrentVIPLevel={getCurrentVIPLevel}
              setCurrentScreen={setCurrentScreen}
            />
          )}
          {currentScreen === 'dice' && (
            <DiceGame
              gameData={gameData}
              updateGameData={updateGameData}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              getCurrentVIPLevel={getCurrentVIPLevel}
              setCurrentScreen={setCurrentScreen}
            />
          )}
          {currentScreen === 'profile' && (
            <Profile
              user={user}
              updateUser={updateUser}      // <-- pass updateUser so profile can update user info
              gameData={gameData}
              updateGameData={updateGameData}
              getCurrentVIPLevel={getCurrentVIPLevel}
              setCurrentScreen={setCurrentScreen}
              setMessage={setMessage}
              vipLevels={vipLevels}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Home;
