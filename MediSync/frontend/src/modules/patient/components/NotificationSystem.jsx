import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './PatientUI';
import { useTheme } from './PatientShared';

export default function NotificationSystem() {
  const { dark } = useTheme();
  const [toasts, setToasts] = useState([]);
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const showToast = useCallback((title, message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Show browser notification if permitted
    if (permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/logo.png" // Path to your logo
      });
    }

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, [permission]);

  // Expose showToast to window for global access (simple way for this demo)
  useEffect(() => {
    window.showPushNotification = showToast;
    return () => { delete window.showPushNotification; };
  }, [showToast]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return 'check';
      case 'error': return 'alert';
      case 'warning': return 'alert';
      case 'appointment': return 'calendar';
      default: return 'bell';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-500 bg-green-500/10';
      case 'error': return 'text-red-500 bg-red-500/10';
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'appointment': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-[#2da0a8] bg-[#2da0a8]/10';
    }
  };

  return (
    <>
      {/* Permission Prompt for Browser Notifications */}
      {permission === "default" && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`fixed bottom-6 right-6 z-[100] p-6 rounded-2xl border shadow-2xl max-w-sm ${dark ? "bg-[#0a0c10] border-[#1e293b]" : "bg-white border-slate-100"}`}
        >
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2da0a8]/10 flex items-center justify-center text-[#2da0a8] shrink-0">
              <Icon name="bell" className="w-6 h-6" />
            </div>
            <div>
              <h4 className={`font-bold ${dark ? "text-white" : "text-slate-800"}`}>Enable Notifications</h4>
              <p className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>Stay updated with your appointments and health alerts.</p>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={requestPermission}
                  className="px-4 py-2 bg-[#2da0a8] text-white text-xs font-bold rounded-lg hover:bg-[#20838a] transition-colors"
                >
                  Allow
                </button>
                <button 
                  onClick={() => setPermission("denied")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toasts Container */}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.9 }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex gap-3 min-w-[300px] max-w-md ${dark ? "bg-[#0a0c10]/90 backdrop-blur-xl border-[#1e293b]" : "bg-white/90 backdrop-blur-xl border-slate-100"}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getColor(toast.type)}`}>
                <Icon name={getIcon(toast.type)} className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h5 className={`text-sm font-bold ${dark ? "text-white" : "text-slate-800"}`}>{toast.title}</h5>
                <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className={`shrink-0 h-6 w-6 flex items-center justify-center rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-600" : "hover:bg-slate-50 text-slate-400"}`}
              >
                <Icon name="close" className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
