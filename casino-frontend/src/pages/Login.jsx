import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useTelegram } from "../hooks/useTelegram";
import { CustomButton } from "../components/common/CustomButton";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const {
    tg,
    initData,
    user,
    isTelegramWebApp,
    closeWebApp,
    showAlert,
  } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        // Use dummy data if not in Telegram
        const payload = initData || "fallback_init_data";

        await axios.post(`${API_URL}/api/auth`, { initData: payload });

        localStorage.setItem(
          "vipCasinoUser",
          JSON.stringify({
            user: user || { id: "guest", first_name: "Guest" },
            initData: payload,
          })
        );

        navigate("/home");
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
  }, [initData, user, showAlert, navigate]);

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
            🎉 Welcome, {user?.first_name || "Guest"}!
          </h2>
        </motion.div>
      )}
    </div>
  );
}
