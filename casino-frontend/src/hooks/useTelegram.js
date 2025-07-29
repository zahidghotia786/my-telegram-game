import { useState, useEffect } from 'react';

export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [queryId, setQueryId] = useState(null);
  const [initData, setInitData] = useState(null);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => {
    const isDev = import.meta.env.DEV;

    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const telegram = window.Telegram.WebApp;
      telegram.expand();
      telegram.ready();

      setTg(telegram);
      setUser(telegram.initDataUnsafe?.user ?? null);
      setQueryId(telegram.initDataUnsafe?.query_id ?? null);
      setInitData(telegram.initData ?? null);
      setIsTelegramWebApp(true);

      console.log("✅ Telegram WebApp initialized:", {
        user: telegram.initDataUnsafe?.user,
        initData: telegram.initData,
        platform: telegram.platform,
        themeParams: telegram.themeParams
      });
    } else if (isDev) {
      // 👇 Simulate Telegram for local/dev
      console.warn("⚠️ Simulating Telegram WebApp (Dev Mode)");
      const fakeUser = { id: 123456, first_name: "DevUser" };

      setTg(null);
      setUser(fakeUser);
      setQueryId("fake_query_id");
      setInitData("fake_init_data");
      setIsTelegramWebApp(true);
    } else {
      console.warn("⚠️ Not running in Telegram WebApp");
      setIsTelegramWebApp(false);
    }
  }, []);

  return { 
    tg, 
    user, 
    queryId, 
    initData, 
    isTelegramWebApp,
    closeWebApp: () => isTelegramWebApp && tg?.close(),
    showAlert: (message) => isTelegramWebApp && tg?.showAlert(message),
    showConfirm: (message) => isTelegramWebApp && tg?.showConfirm(message),
  };
}
