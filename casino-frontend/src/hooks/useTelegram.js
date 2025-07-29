import { useState, useEffect } from 'react';

export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [queryId, setQueryId] = useState(null);
  const [initData, setInitData] = useState(null);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const telegram = window.Telegram.WebApp;
      telegram.expand();
      telegram.ready();

      setTg(telegram);
      setUser(telegram.initDataUnsafe?.user ?? null);
      setQueryId(telegram.initDataUnsafe?.query_id ?? null);
      setInitData(telegram.initData ?? null);
      setIsTelegramWebApp(true);

      console.log("✅ Telegram WebApp initialized");
    } else {
      console.warn("⚠️ Not in Telegram WebApp - using fallback values");
      setTg(null);
      setUser({ id: "guest", first_name: "Guest" });
      setQueryId("fallback_query");
      setInitData("fallback_init_data");
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
    showAlert: (msg) => isTelegramWebApp && tg?.showAlert(msg),
    showConfirm: (msg) => isTelegramWebApp && tg?.showConfirm(msg),
  };
}
