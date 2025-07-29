export function useTelegram() {
  const [state, setState] = useState({
    tg: null,
    user: null,
    initData: null,
    isTelegramWebApp: false,
    isInitialized: false
  });

  useEffect(() => {
    const init = () => {
      // Check for force web mode
      const forceWebMode = localStorage.getItem("forceWebMode") === "true";
      
      if (!forceWebMode && typeof window !== 'undefined' && window.Telegram?.WebApp) {
        // Telegram WebApp
        const telegram = window.Telegram.WebApp;
        telegram.expand();
        telegram.ready();

        setState({
          tg: telegram,
          user: telegram.initDataUnsafe?.user ?? null,
          initData: telegram.initData ?? null,
          isTelegramWebApp: true,
          isInitialized: true
        });
      } else {
        // Not Telegram or force web mode
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isTelegramWebApp: false
        }));
      }
    };

    init();
  }, []);

  return { 
    ...state,
    closeWebApp: () => state.isTelegramWebApp && state.tg?.close(),
    showAlert: (message) => state.isTelegramWebApp ? state.tg?.showAlert(message) : alert(message),
    showConfirm: (message) => state.isTelegramWebApp ? state.tg?.showConfirm(message) : confirm(message),
  };
}