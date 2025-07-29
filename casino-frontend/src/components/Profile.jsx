import React, { useEffect, useState } from 'react';
import { CustomButton } from './common/CustomButton';

// Helper: get VIP level object from XP
const getVipLevelFromXP = (xp, vipLevels) => {
  let currentLevel = vipLevels[0];
  for (const level of vipLevels) {
    if (xp >= level.min) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
};

const Profile = ({
  user: initialUser,
  gameData: initialGameData,
  updateGameData,
  updateUser,
  getCurrentVIPLevel,
  setCurrentScreen,
  setMessage,
  vipLevels,
}) => {
  // Local state for user to handle loading from localStorage
  const [user, setUser] = useState(initialUser || null);
    console.log(user)
  // Load user from localStorage once on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('vipCasinoUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser.user);
        if (updateUser) updateUser(parsedUser);
      } catch {
        // Ignore invalid JSON
      }
    } else if (initialUser) {
      // Save initial user to storage if available
      localStorage.setItem('vipCasinoUser', JSON.stringify(initialUser));
    }
  }, [initialUser, updateUser]);

  // Load gameData from localStorage once on mount
  useEffect(() => {
    const storedData = localStorage.getItem('vipCasinoGameData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        updateGameData(parsedData);
      } catch {
        // Invalid JSON, ignore
      }
    } else if (initialGameData) {
      // Save initial gameData to storage if available
      localStorage.setItem('vipCasinoGameData', JSON.stringify(initialGameData));
    }
  }, [initialGameData, updateGameData]);

  // Wrapper to update gameData state + localStorage simultaneously
  const updateGameAndStorage = (data) => {
    updateGameData(data);
    localStorage.setItem('vipCasinoGameData', JSON.stringify(data));
  };

  // Wrapper to update user state + localStorage simultaneously
  const updateUserAndStorage = (data) => {
    setUser(data);
    if (updateUser) updateUser(data);
    localStorage.setItem('vipCasinoUser', JSON.stringify(data));
  };

  // If no user or gameData yet, show loading or fallback UI
  if (!user || !initialGameData) {
    return <div className="text-white p-4">Loading profile...</div>;
  }

  const currentVIP = getCurrentVIPLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <CustomButton
          variant="secondary"
          onClick={() => setCurrentScreen('home')}
          className="px-3 py-2"
        >
          ← Back
        </CustomButton>
        <h1 className="text-2xl font-bold text-purple-400">👤 Profile</h1>
        <div></div>
      </div>

      {/* User Info */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user.photo_url}
            alt={`${user.first_name} profile`}
            className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
          />
          <div>
            <h2 className="text-xl font-bold">{user.first_name} {user.last_name || ''}</h2>
            <p className="text-gray-300">@{user.username || `id${user.id}`}</p>
            <p className={`font-semibold ${currentVIP.color}`}>
              {currentVIP.name} Member
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-xl p-4">
          <p className="text-2xl font-bold text-green-400">{initialGameData.balance.toLocaleString()}</p>
          <p className="text-sm text-green-300">Current Balance</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-400">{initialGameData.bestWin.toLocaleString()}</p>
          <p className="text-sm text-blue-300">Best Win</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4">
          <p className="text-2xl font-bold text-purple-400">{initialGameData.gamesPlayed}</p>
          <p className="text-sm text-purple-300">Games Played</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-4">
          <p className="text-2xl font-bold text-yellow-400">
            {Math.round(
              (initialGameData.totalWins / Math.max(initialGameData.gamesPlayed, 1)) * 100
            )}
            %
          </p>
          <p className="text-sm text-yellow-300">Win Rate</p>
        </div>
      </div>

      {/* VIP Progress */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">🌟 VIP Progress</h3>
        <div className="space-y-2">
          {vipLevels
            .slice()
            .reverse()
            .map((level) => (
              <div
                key={level.level}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  level.level === currentVIP.level
                    ? 'bg-purple-500/30 border border-purple-400'
                    : level.level < currentVIP.level
                    ? 'bg-green-500/20'
                    : 'bg-gray-500/20'
                }`}
              >
                <div>
                  <p className={`font-semibold ${level.color}`}>
                    {level.name} (Level {level.level})
                  </p>
                  <p className="text-xs text-gray-400">{level.multiplier}x multiplier</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{level.min.toLocaleString()} XP</p>
                  {level.level === currentVIP.level && (
                    <p className="text-xs text-purple-300">Current</p>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-300">Your XP: {initialGameData.experience.toLocaleString()}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <CustomButton
          onClick={() => {
            if (confirm('Are you sure you want to reset all progress?')) {
              const resetData = {
                balance: 1000,
                totalWins: 0,
                totalLosses: 0,
                bestWin: 0,
                gamesPlayed: 0,
                achievements: [],
                vipLevel: 1,
                experience: 0,
              };
              updateGameAndStorage(resetData);
              setMessage('Game data reset successfully!');
            }
          }}
          variant="danger"
          className="w-full"
        >
          🔄 Reset Progress
        </CustomButton>

        <CustomButton
          onClick={() => {
            const newBalance = initialGameData.balance + 500;
            const newXP = initialGameData.experience + 250; // XP increase
            const newVIPLevel = getVipLevelFromXP(newXP, vipLevels).level;

            const newData = {
              ...initialGameData,
              balance: newBalance,
              experience: newXP,
              vipLevel: newVIPLevel,
            };

            updateGameAndStorage(newData);
            setMessage('Free coins and XP added! 🎁');
          }}
          variant="success"
          className="w-full"
        >
          🎁 Daily Bonus (+500 coins + 250 XP)
        </CustomButton>
      </div>
    </div>
  );
};

export default Profile;
