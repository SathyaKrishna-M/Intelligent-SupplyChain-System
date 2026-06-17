import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyle = (s) => {
    switch (s?.toUpperCase()) {
      case 'DELIVERED':
      case 'FULFILLED':
      case 'APPROVED':
        return 'bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
      case 'IN_TRANSIT':
      case 'PENDING':
        return 'bg-amber-100/80 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
      case 'CANCELLED':
      case 'REJECTED':
      case 'FAILED':
        return 'bg-rose-100/80 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]';
      case 'CREATED':
      case 'AVAILABLE':
        return 'bg-blue-100/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
      default:
        return 'bg-slate-100/80 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-500/30 shadow-sm';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${getStyle(status)} transition-colors duration-300`}>
      {status}
    </span>
  );
};

export default StatusBadge;
