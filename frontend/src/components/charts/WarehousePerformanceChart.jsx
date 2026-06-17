import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartSkeleton from './ChartSkeleton';

const WarehousePerformanceChart = ({ data }) => {
  if (!data) return <ChartSkeleton />;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 flex flex-col transition-all">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Warehouse Performance</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Key utilization and processing metrics</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="metric" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={120} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
            />
            <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WarehousePerformanceChart;
