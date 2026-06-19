import React, { useState, useEffect } from 'react';
import { Package, Warehouse, ShoppingCart, TrendingUp } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsGrid from '../../components/dashboard/StatsGrid';
import KpiCard from '../../components/dashboard/KpiCard';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
// Removed RevenueTrendChart since we are using a static banner
import { Sparkles, ArrowRight, Activity, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalWarehouses: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [trendData, setTrendData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [dashRes, revRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/stats/revenue')
        ]);
        
        if (dashRes.data) {
          setStats(dashRes.data.data || dashRes.data);
        }
        if (revRes.data) {
          setTrendData(revRes.data.data?.trend || []);
        }
      } catch (e) {
        console.error("Failed to fetch admin stats", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const handleGenerateReport = () => {
    // Simulated report generation since backend /api/reports doesn't exist yet
    alert("Comprehensive System Report is being generated and will be sent to your email.");
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Admin Dashboard" 
        user={user} 
        actions={
          <button 
            onClick={handleGenerateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Generate Report
          </button>
        }
      />

      <StatsGrid>
        <KpiCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<Package className="text-blue-600" />} 
          trend="5%" 
          trendDirection="up" 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Total Warehouses" 
          value={stats.totalWarehouses} 
          icon={<Warehouse className="text-indigo-600" />} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<ShoppingCart className="text-purple-600" />} 
          trend="12%" 
          trendDirection="up" 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Revenue" 
          value={`$${stats.totalRevenue?.toLocaleString(undefined, {minimumFractionDigits: 2})}`} 
          icon={<TrendingUp className="text-emerald-600" />} 
          trend="8%" 
          trendDirection="up" 
          isLoading={isLoading} 
        />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-full rounded-xl overflow-hidden relative shadow-lg group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900"></div>
            
            {/* Decorative Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col p-8 md:p-10 z-10 text-white">
              <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                <Sparkles size={16} className="text-blue-300" />
                <span className="text-xs font-medium tracking-wider text-blue-100 uppercase">System Ready</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Welcome to your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Intelligent Command Center</span>
              </h2>
              
              <p className="text-blue-100/80 mb-8 max-w-lg leading-relaxed">
                Your supply chain and logistics network is operating optimally. Use the dashboard to monitor active shipments, manage warehouse inventory, and dispatch drivers across your network.
              </p>
              
              <div className="mt-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-white/20 transition-all cursor-default">
                  <Activity size={24} className="text-blue-300 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Live Tracking</h3>
                  <p className="text-xs text-blue-100/70">All nodes operational</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-white/20 transition-all cursor-default">
                  <Shield size={24} className="text-indigo-300 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Secure Network</h3>
                  <p className="text-xs text-blue-100/70">End-to-end encryption</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-white/20 transition-all cursor-default">
                  <Zap size={24} className="text-amber-300 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Fast Processing</h3>
                  <p className="text-xs text-blue-100/70">Optimized routing active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <NotificationPanel title="System Alerts" />
          <ActivityTimeline title="Recent Network Activity" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
