import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, isVisible: true }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5300);
  }, []);

  return <ToastContext.Provider value={{ toasts, show }}>{children}</ToastContext.Provider>;
}

export function useToastContext() {
  return useContext(ToastContext);
}
