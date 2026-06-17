import React, { useState, useEffect } from 'react';
import { Activity, User } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityTimeline = ({ title = "Recent Activity" }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    if (!user) return;
    try {
      const res = await api.get('/activity');
      setActivities(res.data || []);
    } catch (e) {
      console.error("Failed to fetch activities", e);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 flex flex-col h-full transition-colors duration-300">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-blue-500" />
        {title}
      </h3>
      
      <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-6 flex-1 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {activities.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center text-slate-400 dark:text-slate-500 py-10"
            >
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">No system activity yet.</p>
            </motion.div>
          ) : (
            activities.map((activity, index) => (
              <motion.div 
                key={activity.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative pl-6 group"
              >
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 border-4 border-white dark:border-slate-800 shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
                <div className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {activity.action}: <span className="font-normal text-slate-600 dark:text-slate-400">{activity.description}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">{formatDate(activity.timestamp)}</p>
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <User size={10} />
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                        {activity.user}
                      </span>
                      <span className="text-[8px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-[1px] rounded uppercase font-bold">
                        {activity.role}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityTimeline;
