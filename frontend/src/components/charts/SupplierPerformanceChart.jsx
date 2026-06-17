import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartSkeleton from './ChartSkeleton';

const SupplierPerformanceChart = ({ data }) => {
  if (!data) return <ChartSkeleton />;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 flex flex-col transition-all">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Supplier Performance</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Ranking based on fulfillment score</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
            <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="score" name="Overall Score" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="fulfillmentRate" name="Fulfillment Rate" fill="#c4b5fd" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SupplierPerformanceChart;
