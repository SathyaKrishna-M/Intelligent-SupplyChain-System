import React from 'react';

const ChartCard = ({ title, subtitle, children, height = "h-80" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      
      <div className={`w-full ${height} flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50`}>
        {children || (
           <div className="text-center">
             <p className="text-slate-400 font-medium">Chart Visualization Placeholder</p>
             <p className="text-xs text-slate-400 mt-1">Analytics integration coming soon</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
