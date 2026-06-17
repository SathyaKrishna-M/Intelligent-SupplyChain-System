import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, Users, ShoppingCart, Truck, Map, BarChart3, TrendingUp, FileText, Activity, Info, UserCircle, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['ADMIN', 'WAREHOUSE_MANAGER', 'LOGISTICS_MANAGER', 'SUPPLIER'] },
    { name: 'Inventory', icon: <Package size={20} />, path: '/inventory', roles: ['ADMIN', 'WAREHOUSE_MANAGER'] },
    { name: 'Warehouses', icon: <Warehouse size={20} />, path: '/warehouses', roles: ['ADMIN'] },
    { name: 'Suppliers', icon: <Users size={20} />, path: '/suppliers', roles: ['ADMIN', 'SUPPLIER'] },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/orders', roles: ['ADMIN', 'WAREHOUSE_MANAGER', 'SUPPLIER'] },
    { name: 'Shipments', icon: <Truck size={20} />, path: '/shipments', roles: ['ADMIN', 'LOGISTICS_MANAGER'] },
    { name: 'Logistics Network', icon: <Map size={20} />, path: '/logistics', roles: ['ADMIN', 'LOGISTICS_MANAGER'] },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics', roles: ['ADMIN'] },
    { name: 'Forecasting', icon: <TrendingUp size={20} />, path: '/forecasting', roles: ['ADMIN'] },
    { name: 'DSA Visualization', icon: <Share2 size={20} />, path: '/dsa-story', roles: ['ADMIN', 'WAREHOUSE_MANAGER', 'LOGISTICS_MANAGER', 'SUPPLIER'] },
    { name: 'Reports', icon: <FileText size={20} />, path: '/reports', roles: ['ADMIN'] },
    { name: 'System Health', icon: <Activity size={20} />, path: '/system-health', roles: ['ADMIN'] },
    { name: 'About System', icon: <Info size={20} />, path: '/about', roles: ['ADMIN', 'WAREHOUSE_MANAGER', 'LOGISTICS_MANAGER', 'SUPPLIER'] },
  ];

  // Filter based on roles
  const visibleMenu = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <motion.div 
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-slate-900 dark:bg-slate-950 text-slate-300 flex flex-col h-full border-r border-slate-800 relative shadow-2xl z-20"
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-blue-600 text-white rounded-full p-1 shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 z-30"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="p-5 flex items-center justify-center border-b border-slate-800 min-h-[72px]">
        {!isCollapsed ? (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold tracking-wider text-white"
          >
            Supply<span className="text-blue-500">Chain</span> <span className="font-light">OS</span>
          </motion.span>
        ) : (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold text-blue-500"
          >
            SC
          </motion.span>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <ul className="space-y-2 px-3">
          {visibleMenu.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <li key={item.name} className="relative group">
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-blue-600/10 dark:bg-blue-500/20 rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 relative z-10 ${
                    isActive
                      ? 'text-blue-400 font-semibold'
                      : 'hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : ''}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="ml-3 truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 shadow-inner hover:bg-slate-800/60 transition-colors`}>
          <UserCircle size={isCollapsed ? 36 : 32} className={`text-slate-400 ${!isCollapsed ? 'mr-3' : ''} flex-shrink-0`} />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-100 truncate">{user?.username || 'User'}</span>
              <span className="text-xs font-medium text-blue-400/90 truncate uppercase tracking-wider bg-blue-900/30 px-1.5 py-0.5 rounded mt-0.5 inline-block w-fit">
                {user?.role || 'Guest'}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
