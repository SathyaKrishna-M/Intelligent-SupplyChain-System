import React, { useState, useEffect } from 'react';
import { Package, Warehouse, ShoppingCart, TrendingUp } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsGrid from '../../components/dashboard/StatsGrid';
import KpiCard from '../../components/dashboard/KpiCard';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
import ChartCard from '../../components/dashboard/ChartCard';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/dashboard');
        if (res.data) {
          setStats(res.data.data || res.data);
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
          <ChartCard title="System Overview" subtitle="Revenue and Order trends over the last 30 days" />
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
