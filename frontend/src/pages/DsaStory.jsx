import React from 'react';
import { motion } from 'framer-motion';
import { Package, Warehouse, Users, ShoppingCart, Truck, CheckCircle, ArrowDown } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';

const StepCard = ({ title, description, icon: Icon, delay, colorClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, type: "spring" }}
    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700/50 flex flex-col items-center text-center w-64 group hover:scale-105 transition-transform cursor-default relative overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-b ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner ${colorClass}`}>
      <Icon size={32} className="text-white" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
  </motion.div>
);

const Connector = ({ delay }) => (
  <motion.div 
    initial={{ opacity: 0, scaleY: 0 }}
    animate={{ opacity: 1, scaleY: 1 }}
    transition={{ delay, duration: 0.4 }}
    className="h-12 w-0.5 bg-gradient-to-b from-blue-400 to-indigo-500 my-2 relative origin-top flex flex-col items-center justify-center"
  >
    <div className="absolute top-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow border border-slate-100 dark:border-slate-700">
      <ArrowDown size={12} className="text-blue-500" />
    </div>
  </motion.div>
);

const DsaStory = () => {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <DashboardHeader 
        title="Supply Chain Flow" 
        subtitle="A visual journey from product creation to delivery, powered by optimized data structures."
      />
      
      <div className="flex flex-col items-center mt-12 space-y-2">
        <StepCard 
          title="1. Products" 
          description="Indexed via AVL Trees for O(log N) search and insertion."
          icon={Package} 
          delay={0.1}
          colorClass="from-blue-500 to-blue-600"
        />
        <Connector delay={0.4} />
        
        <StepCard 
          title="2. Warehouses" 
          description="Managed using Segment Trees for rapid regional capacity queries."
          icon={Warehouse} 
          delay={0.6}
          colorClass="from-indigo-500 to-indigo-600"
        />
        <Connector delay={0.9} />
        
        <StepCard 
          title="3. Suppliers" 
          description="Ranked by fulfillment rate. Approval process updates BST nodes."
          icon={Users} 
          delay={1.1}
          colorClass="from-purple-500 to-purple-600"
        />
        <Connector delay={1.4} />
        
        <StepCard 
          title="4. Orders" 
          description="Stored in B-Trees enabling efficient range scans for analytics."
          icon={ShoppingCart} 
          delay={1.6}
          colorClass="from-pink-500 to-pink-600"
        />
        <Connector delay={1.9} />
        
        <StepCard 
          title="5. Shipments" 
          description="Routed using Dijkstra's Algorithm on adjacency list Graphs."
          icon={Truck} 
          delay={2.1}
          colorClass="from-rose-500 to-rose-600"
        />
        <Connector delay={2.4} />
        
        <StepCard 
          title="6. Delivery" 
          description="Revenue aggregated instantly via Fenwick Trees."
          icon={CheckCircle} 
          delay={2.6}
          colorClass="from-emerald-500 to-emerald-600"
        />
      </div>
    </div>
  );
};

export default DsaStory;
