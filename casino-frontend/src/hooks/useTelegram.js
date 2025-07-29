// src/hooks/useTelegram.js
import { useState, useEffect } from 'react';

export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [queryId, setQueryId] = useState(null);
  const [initData, setInitData] = useState(null);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => {
    // Check if running in Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const telegram = window.Telegram.WebApp;
      
      // Expand the WebApp to full view
      telegram.expand();
      
      // Set state
      setTg(telegram);
      setUser(telegram.initDataUnsafe?.user ?? null);
      setQueryId(telegram.initDataUnsafe?.query_id ?? null);
      setInitData(telegram.initData ?? null);

      // Initialize the WebApp
      telegram.ready();
      
      console.log("✅ Telegram WebApp initialized:", {
        user: telegram.initDataUnsafe?.user,
        initData: telegram.initData,
        platform: telegram.platform,
        themeParams: telegram.themeParams
      });
    } else {
      console.warn("⚠️ Not running in Telegram WebApp - some features will be disabled");
    }
  }, []);

  return { 
    tg, 
    user, 
    queryId, 
    initData, 
    isTelegramWebApp,
    // Common convenience methods
    closeWebApp: () => isTelegramWebApp && tg.close(),
    showAlert: (message) => isTelegramWebApp && tg.showAlert(message),
    showConfirm: (message) => isTelegramWebApp && tg.showConfirm(message),
  };
}