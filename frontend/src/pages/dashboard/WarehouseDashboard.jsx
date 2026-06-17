import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Inbox, Box } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsGrid from '../../components/dashboard/StatsGrid';
import KpiCard from '../../components/dashboard/KpiCard';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
import ChartCard from '../../components/dashboard/ChartCard';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const WarehouseDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    inventoryCount: 0,
    lowStock: 0,
    incomingOrders: 0,
    capacity: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [invRes, dashRes] = await Promise.all([
          api.get('/stats/inventory'),
          api.get('/dashboard')
        ]);
        
        setStats({
          inventoryCount: invRes.data?.data?.totalItems || 0,
          lowStock: dashRes.data?.data?.lowStock || 0,
          incomingOrders: dashRes.data?.data?.pendingOrders || 0,
          capacity: 85, // Mock capacity
        });
      } catch (e) {
        console.error("Failed to fetch warehouse stats", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const handleReceiveShipment = async () => {
    try {
      const res = await api.get('/shipments?status=SHIPPED');
      const shipments = res.data?.data || [];
      if (shipments.length === 0) {
        alert("No incoming shipments to receive at the moment.");
        return;
      }
      const target = shipments[0];
      await api.put(`/shipments/${target.shipmentId}`, { action: 'complete' });
      alert(`Shipment ${target.shipmentId} received successfully!`);
      
      // Trigger a re-fetch of stats
      const [invRes, dashRes] = await Promise.all([
        api.get('/stats/inventory'),
        api.get('/dashboard')
      ]);
      setStats({
        inventoryCount: invRes.data?.data?.totalItems || 0,
        lowStock: dashRes.data?.data?.lowStock || 0,
        incomingOrders: dashRes.data?.data?.pendingOrders || 0,
        capacity: 85,
      });
    } catch (e) {
      console.error("Failed to receive shipment", e);
      alert("Failed to receive shipment. Please check console for details.");
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Warehouse Operations" 
        user={user} 
        actions={
          <button 
            onClick={handleReceiveShipment}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Receive Shipment
          </button>
        }
      />

      <StatsGrid>
        <KpiCard 
          title="Inventory Count" 
          value={stats.inventoryCount} 
          icon={<Package className="text-blue-600" />} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Low Stock Products" 
          value={stats.lowStock} 
          icon={<AlertTriangle className="text-amber-600" />} 
          trend={stats.lowStock > 0 ? "Needs attention" : ""} 
          trendDirection={stats.lowStock > 0 ? "down" : ""} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Incoming Orders" 
          value={stats.incomingOrders} 
          icon={<Inbox className="text-purple-600" />} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Warehouse Capacity" 
          value={`${stats.capacity}%`} 
          icon={<Box className="text-indigo-600" />} 
          trend="Nearing limit" 
          trendDirection="down" 
          isLoading={isLoading} 
        />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Inventory Summary" subtitle="Stock levels by category" height="h-96" />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <NotificationPanel title="Low Stock Alerts" />
          <ActivityTimeline title="Warehouse Activity" />
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
