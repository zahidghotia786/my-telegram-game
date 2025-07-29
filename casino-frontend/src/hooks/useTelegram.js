import { useState, useEffect } from 'react';

export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [initData, setInitData] = useState(null);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        // Running in Telegram WebApp
        const telegram = window.Telegram.WebApp;
        telegram.expand();
        telegram.ready();

        setTg(telegram);
        setUser(telegram.initDataUnsafe?.user ?? null);
        setInitData(telegram.initData ?? null);
        setIsTelegramWebApp(true);
        
        console.log("Telegram WebApp initialized:", {
          user: telegram.initDataUnsafe?.user,
          platform: telegram.platform
        });
      } else if (import.meta.env.DEV) {
        // Development mode simulation
        console.warn("Development mode - simulating Telegram WebApp");
        const fakeUser = { 
          id: 123456, 
          first_name: "DevUser",
          last_name: "Test",
          username: "dev_user",
          language_code: "en"
        };

        setTg({
          close: () => console.log("WebApp closed"),
          showAlert: (msg) => alert(`ALERT: ${msg}`),
          showConfirm: (msg) => confirm(`CONFIRM: ${msg}`),
          expand: () => console.log("WebApp expanded"),
          ready: () => console.log("WebApp ready")
        });
        setUser(fakeUser);
        setInitData("fake_init_data");
        setIsTelegramWebApp(true);
      } else {
        // Not in Telegram
        console.warn("Not running in Telegram WebApp");
        setIsTelegramWebApp(false);
      }
      setIsInitialized(true);
    };

    init();
  }, []);

  return { 
    tg, 
    user, 
    initData, 
    isTelegramWebApp,
    isInitialized,
    closeWebApp: () => isTelegramWebApp && tg?.close(),
    showAlert: (message) => isTelegramWebApp ? tg?.showAlert(message) : alert(message),
    showConfirm: (message) => isTelegramWebApp ? tg?.showConfirm(message) : confirm(message),
  };
}