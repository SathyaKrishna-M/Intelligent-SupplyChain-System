import { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg shadow-lg border ${
              toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
            } transition-all duration-300 transform translate-y-0 opacity-100`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} className="text-emerald-500 mr-3 flex-shrink-0" />
            ) : (
              <XCircle size={20} className="text-red-500 mr-3 flex-shrink-0" />
            )}
            <p className="text-sm font-medium mr-6">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-auto rounded-md p-1 focus:outline-none ${
                toast.type === 'success' ? 'hover:bg-emerald-100 text-emerald-600' : 'hover:bg-red-100 text-red-600'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
