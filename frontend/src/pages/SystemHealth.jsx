import { useState, useEffect } from 'react';
import { Activity, Database, Server, Clock, HardDrive, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

const SystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const { addToast } = useToast();

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await api.get('/system/health');
      if (res.data) setHealth(res.data.data || res.data);
    } catch (error) {
      addToast('Failed to fetch system health', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleSeedData = async () => {
    if (!window.confirm("WARNING: This will append massive demo data to the database. Are you sure?")) return;
    try {
      setSeeding(true);
      const res = await api.post('/system/seed');
      if (res.data.success) {
        addToast(res.data.message, 'success');
        fetchHealth();
      }
    } catch (e) {
      addToast('Failed to seed demo data', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    { title: 'API Status', value: health?.status || 'OFFLINE', icon: <Activity className={health?.status === 'ONLINE' ? 'text-emerald-500' : 'text-red-500'} />, desc: 'Core Backend Service' },
    { title: 'Memory Usage', value: `${health?.memoryUsedMb || 0} MB`, icon: <HardDrive className="text-blue-500" />, desc: 'JVM Heap Allocation' },
    { title: 'Products Loaded', value: health?.products || 0, icon: <Database className="text-purple-500" />, desc: 'Indexed in AVL & BST' },
    { title: 'Orders Loaded', value: health?.orders || 0, icon: <Database className="text-indigo-500" />, desc: 'Indexed in B-Tree' },
    { title: 'Warehouses Loaded', value: health?.warehouses || 0, icon: <Database className="text-amber-500" />, desc: 'Mapped in Graph' },
    { title: 'Shipments Loaded', value: health?.shipments || 0, icon: <Database className="text-slate-500" />, desc: 'Active in memory' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Health & Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time telemetry and massive data generation.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchHealth}
            className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleSeedData}
            disabled={seeding}
            className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm font-medium disabled:opacity-50"
          >
            <Database size={18} className="mr-2" />
            {seeding ? 'Seeding...' : 'Load Demo Data'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100">
                {card.icon}
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-800">{card.value}</h3>
            <p className="text-sm font-medium text-slate-900 mt-2">{card.title}</p>
            <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start">
        <Server className="text-blue-500 mr-4 mt-1" size={24} />
        <div>
          <h3 className="text-lg font-bold text-blue-900">Data Structure Synchronization</h3>
          <p className="text-sm text-blue-800 mt-1">
            All data loaded via the API is automatically synchronized into the native Java custom Data Structures (AVL, BST, BTree, Graph). 
            Triggering "Load Demo Data" will seamlessly hydrate these trees without a server restart.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
