import React, { useState, useEffect } from 'react';
import { Truck, Users, Clock, CheckCircle } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsGrid from '../../components/dashboard/StatsGrid';
import KpiCard from '../../components/dashboard/KpiCard';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import ChartCard from '../../components/dashboard/ChartCard';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const LogisticsDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeShipments: 0,
    driversAvailable: 0,
    avgDeliveryTime: 0,
    completedDeliveries: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [dashRes, logRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/stats/logistics')
        ]);
        
        setStats({
          activeShipments: dashRes.data?.data?.activeShipments || 0,
          driversAvailable: 12, // Mock data
          avgDeliveryTime: 4.5, // Mock data in hours
          completedDeliveries: logRes.data?.data?.delivered || 0,
        });
      } catch (e) {
        console.error("Failed to fetch logistics stats", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const handleDispatchDriver = async () => {
    try {
      const res = await api.get('/shipments?status=CREATED');
      const shipments = res.data?.data || [];
      if (shipments.length === 0) {
        alert("No pending shipments to dispatch.");
        return;
      }
      const target = shipments[0];
      await api.put(`/shipments/${target.shipmentId}`, { action: 'assign' });
      alert(`Driver assigned successfully to shipment ${target.shipmentId}!`);
      // Trigger a re-fetch of stats
      const [dashRes, logRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/stats/logistics')
      ]);
      setStats({
        activeShipments: dashRes.data?.data?.activeShipments || 0,
        driversAvailable: 12,
        avgDeliveryTime: 4.5,
        completedDeliveries: logRes.data?.data?.delivered || 0,
      });
    } catch (e) {
      console.error("Failed to dispatch driver", e);
      alert("Failed to dispatch driver. Please check console for details.");
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Logistics Network" 
        user={user} 
        actions={
          <button 
            onClick={handleDispatchDriver}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Dispatch Driver
          </button>
        }
      />

      <StatsGrid>
        <KpiCard 
          title="Active Shipments" 
          value={stats.activeShipments} 
          icon={<Truck className="text-amber-600" />} 
          trend="2 delayed" 
          trendDirection="down" 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Drivers Available" 
          value={stats.driversAvailable} 
          icon={<Users className="text-blue-600" />} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Avg Delivery Time" 
          value={`${stats.avgDeliveryTime} hrs`} 
          icon={<Clock className="text-indigo-600" />} 
          trend="-0.5 hrs" 
          trendDirection="up" 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Completed Deliveries" 
          value={stats.completedDeliveries} 
          icon={<CheckCircle className="text-emerald-600" />} 
          isLoading={isLoading} 
        />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Shipment Overview" subtitle="Delivery volumes across the network map" height="h-96" />
        </div>
        <div className="lg:col-span-1">
          <ActivityTimeline title="Recent Deliveries & Dispatches" />
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
