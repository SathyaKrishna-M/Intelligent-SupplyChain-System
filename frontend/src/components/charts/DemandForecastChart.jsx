import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartSkeleton from './ChartSkeleton';

const DemandForecastChart = ({ data }) => {
  if (!data) return <ChartSkeleton />;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 flex flex-col transition-all">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Demand Forecasting</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Historical vs Predicted future demand</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#f1f5f9' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="historical" name="Historical Demand" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorHist)" />
            <Area type="monotone" dataKey="predicted" name="Predicted Demand" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DemandForecastChart;
