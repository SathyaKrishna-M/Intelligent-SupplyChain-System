import React from 'react';

const ChartSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
      </div>
      <div className="flex-1 flex items-end space-x-2">
        <div className="w-1/6 bg-slate-200 dark:bg-slate-700 h-1/4 rounded-t"></div>
        <div className="w-1/6 bg-slate-200 dark:bg-slate-700 h-2/4 rounded-t"></div>
        <div className="w-1/6 bg-slate-200 dark:bg-slate-700 h-3/4 rounded-t"></div>
        <div className="w-1/6 bg-slate-200 dark:bg-slate-700 h-1/2 rounded-t"></div>
        <div className="w-1/6 bg-slate-200 dark:bg-slate-700 h-full rounded-t"></div>
        <div className="w-1/6 bg-slate-200 dark:bg-slate-700 h-5/6 rounded-t"></div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
