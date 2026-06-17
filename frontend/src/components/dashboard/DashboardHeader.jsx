import React from 'react';


const DashboardHeader = ({ title, subtitle, user, actions }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
          {subtitle || `Welcome back, ${user?.username || 'User'}. Here's your overview for ${currentDate}.`}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {actions}
      </div>
    </div>
  );
};

export default DashboardHeader;
