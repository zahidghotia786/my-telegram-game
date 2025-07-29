export default function Login() {
  const { 
    tg, 
    initData, 
    user, 
    isTelegramWebApp, 
    isInitialized,
    closeWebApp, 
    showAlert 
  } = useTelegram();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFallbackUI, setShowFallbackUI] = useState(false);

  // Check environment and show appropriate UI
  useEffect(() => {
    if (!isInitialized) return;

    const timer = setTimeout(() => {
      setShowFallbackUI(!isTelegramWebApp);
      setLoading(false);
    }, isTelegramWebApp ? 0 : 2000); // Show fallback immediately in WebApp mode

    return () => clearTimeout(timer);
  }, [isInitialized, isTelegramWebApp]);

  // Handle "Continue in Web Mode" button
  const handleWebMode = () => {
    localStorage.setItem("forceWebMode", "true");
    localStorage.setItem(
      "vipCasinoUser",
      JSON.stringify({
        user: { id: Date.now(), first_name: "Web User" },
        initData: "web_mode_init_data"
      })
    );
    window.location.href = "/home";
  };

  // Handle "Open in Telegram" button
  const handleOpenTelegram = () => {
    window.location.href = "https://t.me/zg_casino_bot";
  };

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
            This app is designed to run inside Telegram WebApp for the best experience.
          </p>
          <div className="space-y-3">
            <CustomButton
              className="w-full"
              onClick={handleOpenTelegram}
            >
              Open in Telegram
            </CustomButton>
            <CustomButton
              variant="secondary"
              className="w-full"
              onClick={handleWebMode}
            >
              Continue in Web Mode
            </CustomButton>
          </div>
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
            {isTelegramWebApp && (
              <CustomButton variant="destructive" onClick={closeWebApp}>
                ❌ Close
              </CustomButton>
            )}
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
          <p className="mt-2 text-gray-300">
            Redirecting you to the app...
          </p>
        </motion.div>
      )}
    </div>
  );
}