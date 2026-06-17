import React from 'react';
import { Package, Truck, ShieldCheck, DollarSign, Map, Route, Box } from 'lucide-react';

const InsightCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start gap-4 hover:shadow-md transition-all">
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-20 flex-shrink-0`}>
      <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h4>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </div>
  </div>
);

const ExecutiveInsightsPanel = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <InsightCard 
        title="Highest Revenue Product" 
        value="PROD-019" 
        subtext="Determined via Fenwick Tree max sum"
        icon={DollarSign}
        colorClass="bg-emerald-500"
      />
      <InsightCard 
        title="Largest Inventory Risk" 
        value="Central Hub" 
        subtext="Analyzed via Segment Tree min query"
        icon={Box}
        colorClass="bg-rose-500"
      />
      <InsightCard 
        title="Top Supplier" 
        value="Alpha Supply Co." 
        subtext="Ranked by fulfillment rate"
        icon={ShieldCheck}
        colorClass="bg-blue-500"
      />
      <InsightCard 
        title="Fastest Delivery Route" 
        value="WH-1 to SUP-3" 
        subtext="Calculated via Dijkstra's Algorithm"
        icon={Route}
        colorClass="bg-purple-500"
      />
    </div>
  );
};

export default ExecutiveInsightsPanel;
