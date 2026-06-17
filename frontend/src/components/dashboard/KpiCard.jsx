import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // If value is a string with non-numeric characters (like '$', ',', 'Units'), we just display it directly
    // since animating strings with symbols is complex. Let's just animate the opacity and y position.
  }, [value]);

  return (
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {value}
    </motion.span>
  );
};

const KpiCard = ({ title, value, icon, trend, trendDirection, isLoading, index = 0 }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 flex flex-col justify-between h-32 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mt-4"></div>
      </div>
    );
  }

  const isPositive = trendDirection === 'up';
  const isNegative = trendDirection === 'down';
  const trendColor = isPositive ? 'text-emerald-500 bg-emerald-500/10' : isNegative ? 'text-rose-500 bg-rose-500/10' : 'text-slate-500 bg-slate-500/10';
  const TrendIcon = isPositive ? '↑' : isNegative ? '↓' : '-';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] border border-white/20 dark:border-slate-700/50 p-6 flex items-center group relative overflow-hidden transition-all duration-300"
    >
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition duration-500 z-0"></div>

      <div className="absolute -right-6 -top-6 opacity-[0.02] dark:opacity-[0.05] transform group-hover:scale-125 transition-transform duration-700 pointer-events-none z-0">
        {icon && React.cloneElement(icon, { size: 140 })}
      </div>
      
      <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-600 dark:text-blue-400 mr-5 flex-shrink-0 z-10 shadow-inner ring-1 ring-blue-500/20">
        {icon && React.cloneElement(icon, { size: 24 })}
      </div>
      
      <div className="z-10 w-full">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <div className="flex items-end justify-between w-full">
          <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            <AnimatedCounter value={value} />
          </h3>
          
          {trend && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index * 0.1) + 0.3 }}
              className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${trendColor}`}
            >
              <span className="mr-1">{TrendIcon}</span>
              <span>{trend}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard;
