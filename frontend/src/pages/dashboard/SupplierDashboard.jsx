import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, CheckCircle, Star } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsGrid from '../../components/dashboard/StatsGrid';
import KpiCard from '../../components/dashboard/KpiCard';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
import { useAuth } from '../../hooks/useAuth';

const SupplierDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assignedOrders: 0,
    pendingRequests: 0,
    completedDeliveries: 0,
    rating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call for supplier specific data
    const fetchDashboardStats = async () => {
      try {
        await new Promise(r => setTimeout(r, 800)); // Simulate network
        setStats({
          assignedOrders: 24,
          pendingRequests: 5,
          completedDeliveries: 156,
          rating: 4.8,
        });
      } catch (e) {
        console.error("Failed to fetch supplier stats", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const handleFulfillOrder = async () => {
    try {
      // First check for APPROVED orders
      let res = await api.get('/orders?status=APPROVED');
      let orders = res.data?.data || [];
      
      if (orders.length === 0) {
        // If no APPROVED orders, check PENDING
        res = await api.get('/orders?status=PENDING');
        orders = res.data?.data || [];
        
        if (orders.length === 0) {
          alert("No pending or approved orders to fulfill at the moment.");
          return;
        }
        
        // Approve the pending order
        const target = orders[0];
        await api.put(`/orders/${target.orderId}`, { status: 'APPROVED' });
        orders = [target]; // Set for the next step
      }
      
      const target = orders[0];
      // Mark as SHIPPED to fulfill it and trigger shipment creation
      await api.put(`/orders/${target.orderId}`, { status: 'SHIPPED' });
      
      alert(`Order ${target.orderId} fulfilled and shipped successfully!`);
    } catch (e) {
      console.error("Failed to fulfill order", e);
      alert("Failed to fulfill order. Please check console for details.");
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Supplier Portal" 
        user={user} 
        actions={
          <button 
            onClick={handleFulfillOrder}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Fulfill Order
          </button>
        }
      />

      <StatsGrid>
        <KpiCard 
          title="Assigned Orders" 
          value={stats.assignedOrders} 
          icon={<ShoppingCart className="text-blue-600" />} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Pending Requests" 
          value={stats.pendingRequests} 
          icon={<Clock className="text-amber-600" />} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Completed Deliveries" 
          value={stats.completedDeliveries} 
          icon={<CheckCircle className="text-emerald-600" />} 
          isLoading={isLoading} 
        />
        <KpiCard 
          title="Supplier Rating" 
          value={`${stats.rating} / 5.0`} 
          icon={<Star className="text-yellow-500" />} 
          trend="Top 10%" 
          trendDirection="up" 
          isLoading={isLoading} 
        />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Orders</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
            <span className="text-slate-400 font-medium">Order Data Table Placeholder</span>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <NotificationPanel title="Supplier Notifications" />
          <ActivityTimeline title="Fulfillment Activity" />
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
