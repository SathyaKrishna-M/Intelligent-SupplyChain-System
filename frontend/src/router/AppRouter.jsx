import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

import Login from '../pages/Login';
import Register from '../pages/Register';
import RoleDashboard from '../pages/dashboard/RoleDashboard';
import Inventory from '../pages/Inventory';
import Warehouses from '../pages/Warehouses';
import Suppliers from '../pages/Suppliers';
import Orders from '../pages/Orders';
import Shipments from '../pages/Shipments';
import Logistics from '../pages/Logistics';
import AnalyticsDashboard from '../pages/AnalyticsDashboard';
import Forecasting from '../pages/Forecasting';
import Reports from '../pages/Reports';
import SystemHealth from '../pages/SystemHealth';
import AboutSystem from '../pages/AboutSystem';
import DsaStory from '../pages/DsaStory';
import RouteVisualization from '../pages/RouteVisualization';

const AppRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'WAREHOUSE_MANAGER', 'LOGISTICS_MANAGER', 'SUPPLIER']} />}>
                <Route path="/dashboard" element={<RoleDashboard />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'WAREHOUSE_MANAGER']} />}>
                <Route path="/inventory" element={<Inventory />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/warehouses" element={<Warehouses />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/forecasting" element={<Forecasting />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/system-health" element={<SystemHealth />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPPLIER']} />}>
                <Route path="/suppliers" element={<Suppliers />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'WAREHOUSE_MANAGER', 'SUPPLIER']} />}>
                <Route path="/orders" element={<Orders />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'LOGISTICS_MANAGER']} />}>
                <Route path="/shipments" element={<Shipments />} />
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/route-visualization" element={<RouteVisualization />} />
              </Route>
              
              <Route path="/dsa-story" element={<DsaStory />} />
              <Route path="/about" element={<AboutSystem />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
