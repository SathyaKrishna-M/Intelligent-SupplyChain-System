import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Mocking an analytics fetch endpoint
    setStats({
      totalRevenue: 12450.50,
      inventoryMin: 12,
      inventoryMax: 940,
      inventoryTotal: 4500
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Intelligence & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Deep insights powered by advanced Segment and Fenwick Trees.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm font-medium">
          <Download size={18} className="mr-2" />
          Export Dataset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center mb-6">
            <TrendingUp size={24} className="text-emerald-500 mr-3" />
            <h3 className="text-lg font-bold text-slate-800">Revenue Analytics</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Global Prefix Sum Revenue</p>
              <h2 className="text-4xl font-extrabold text-slate-900">${stats?.totalRevenue.toFixed(2)}</h2>
              <p className="text-xs text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded font-medium">+14% since last week</p>
            </div>
            <div className="mt-8 h-40 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
              <span className="text-slate-400">Fenwick Tree Traversal Visualization</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center mb-6">
            <BarChart3 size={24} className="text-blue-500 mr-3" />
            <h3 className="text-lg font-bold text-slate-800">Inventory Analytics</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-blue-50 p-4 rounded-lg">
                 <p className="text-sm font-medium text-blue-800">Total System Stock</p>
                 <h2 className="text-2xl font-extrabold text-blue-900 mt-1">{stats?.inventoryTotal}</h2>
               </div>
               <div className="bg-amber-50 p-4 rounded-lg">
                 <p className="text-sm font-medium text-amber-800">Lowest Block Min</p>
                 <h2 className="text-2xl font-extrabold text-amber-900 mt-1">{stats?.inventoryMin}</h2>
               </div>
            </div>
            <div className="mt-4 h-40 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
              <span className="text-slate-400">Segment Tree Range Max Query</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
