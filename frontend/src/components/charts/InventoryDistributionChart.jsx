import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartSkeleton from './ChartSkeleton';

const InventoryDistributionChart = ({ data, maxBlock }) => {
  if (!data) return <ChartSkeleton />;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 flex flex-col transition-all">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Inventory Distribution</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Stock levels queried rapidly via Segment Trees</p>
        </div>
        {maxBlock !== undefined && (
          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
            Max Block: {maxBlock}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis dataKey="warehouse" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
            />
            <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryDistributionChart;
