import React from 'react';
import { Download, Filter } from 'lucide-react';

const AnalyticsFilters = ({ onExportCSV }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-6 transition-all">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <Filter className="w-5 h-5 text-blue-500" />
        <span className="font-semibold">Filters:</span>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition-colors">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
        
        <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition-colors">
          <option>All Warehouses</option>
          <option>Central Hub</option>
          <option>North Facility</option>
        </select>
        
        <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition-colors">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Automotive</option>
          <option>Apparel</option>
        </select>
      </div>

      <button 
        onClick={onExportCSV}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
    </div>
  );
};

export default AnalyticsFilters;
