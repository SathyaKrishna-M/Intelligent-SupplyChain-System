import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, XCircle, CheckCircle, Bell, Check } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPanel = ({ title = "Notifications" }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const getIcon = (severity) => {
    switch (severity) {
      case 'WARNING': return <AlertTriangle size={18} className="text-amber-500 dark:text-amber-400" />;
      case 'ERROR': return <XCircle size={18} className="text-rose-500 dark:text-rose-400" />;
      case 'SUCCESS': return <CheckCircle size={18} className="text-emerald-500 dark:text-emerald-400" />;
      default: return <Info size={18} className="text-blue-500 dark:text-blue-400" />;
    }
  };

  const getBgClass = (severity) => {
    switch (severity) {
      case 'WARNING': return 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/30';
      case 'ERROR': return 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/30';
      case 'SUCCESS': return 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30';
      default: return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 flex flex-col h-full transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
          <Bell className="w-5 h-5 mr-2 text-rose-500" />
          {title}
        </h3>
        {notifications.length > 0 && (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full shadow-sm"
          >
            {notifications.length} New
          </motion.span>
        )}
      </div>
      
      <div className="space-y-4 flex-1 max-h-96 overflow-y-auto pr-2 custom-scrollbar overflow-x-hidden">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center text-slate-400 dark:text-slate-500 py-10"
            >
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">All caught up! No notifications.</p>
            </motion.div>
          ) : (
            notifications.map((notif, index) => (
              <motion.div 
                key={notif.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
                className={`flex items-start p-4 rounded-xl border ${getBgClass(notif.severity)} group relative cursor-pointer transition-colors duration-300`}
              >
                <div className="mt-0.5 mr-3 flex-shrink-0 bg-white/50 dark:bg-black/20 p-2 rounded-lg shadow-sm">
                  {getIcon(notif.severity)}
                </div>
                <div className="flex-1 pr-6">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{notif.title}</p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-2 whitespace-nowrap bg-white/60 dark:bg-black/30 px-2 py-0.5 rounded uppercase">{formatDate(notif.createdAt)}</p>
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{notif.message}</p>
                </div>
                <button 
                  onClick={() => markAsRead(notif.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 flex items-center"
                >
                  <Check size={12} className="mr-1" /> Read
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationPanel;
