import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

import AdminDashboard from './AdminDashboard';
import WarehouseDashboard from './WarehouseDashboard';
import LogisticsDashboard from './LogisticsDashboard';
import SupplierDashboard from './SupplierDashboard';

const RoleDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the appropriate dashboard based on the user's role
  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'WAREHOUSE_MANAGER':
      return <WarehouseDashboard />;
    case 'LOGISTICS_MANAGER':
      return <LogisticsDashboard />;
    case 'SUPPLIER':
      return <SupplierDashboard />;
    default:
      // Fallback or empty state for unrecognized roles
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Access Limited</h2>
            <p className="text-slate-500">Your role ({user.role}) does not have a designated dashboard.</p>
          </div>
        </div>
      );
  }
};

export default RoleDashboard;
