import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useTelegram } from "../hooks/useTelegram";
import { CustomButton } from "../components/common/CustomButton";

export default function Login() {
  const { tg, initData, user, isTelegramWebApp, closeWebApp, showAlert } =
    useTelegram();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFallbackUI, setShowFallbackUI] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isTelegramWebApp) {
        setShowFallbackUI(true);
        setLoading(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isTelegramWebApp]);

  useEffect(() => {
    if (!isTelegramWebApp || !initData) return;

    const authenticate = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        await axios.post(`${API_URL}/api/auth`, { initData });

        localStorage.setItem(
          "vipCasinoUser",
          JSON.stringify({
            user,
            initData,
          })
        );

        window.location.href = "/home";
      } catch (err) {
        setError(err.response?.data?.message || "Authentication failed");
        showAlert(
          `Login failed: ${err.response?.data?.message || "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, [initData, isTelegramWebApp, showAlert]);

  if (showFallbackUI) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md space-y-6 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/10"
        >
          <h2 className="text-3xl font-extrabold text-white">
            🚫 Not in Telegram
          </h2>
          <p className="text-sm text-gray-300">
            This app is meant to run inside Telegram WebApp.
          </p>
          <CustomButton
            className="w-full"
            onClick={() =>
              (window.location.href = "https://t.me/zg_casino_bot")
            }
          >
            Open in Telegram
          </CustomButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white px-6">
      {loading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xl font-medium animate-pulse"
        >
          🔐 Authenticating...
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-md space-y-4 text-center p-6 rounded-lg bg-white/10 backdrop-blur-md border border-red-400/20 shadow-lg"
        >
          <p className="text-lg font-semibold text-red-400">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <CustomButton onClick={() => window.location.reload()}>
              🔁 Try Again
            </CustomButton>
            <CustomButton variant="destructive" onClick={closeWebApp}>
              ❌ Close
            </CustomButton>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 shadow-lg"
        >
          <h2 className="text-3xl font-bold">
            🎉 Welcome, {user?.first_name || "User"}!
          </h2>
        </motion.div>
      )}
    </div>
  );
}
