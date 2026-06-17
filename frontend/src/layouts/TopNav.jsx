import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, Package, ShoppingCart, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        api.get(`/search?q=${searchQuery}`).then(res => {
          setSearchResults(res.data);
        }).catch(err => console.error(err));
      } else {
        setSearchResults(null);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 z-30 relative transition-colors duration-300">
      
      <div className="relative flex items-center w-80 lg:w-96" ref={searchRef}>
        <motion.div 
          animate={isSearchFocused ? { scale: 1.02 } : { scale: 1 }}
          className={`flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-full border transition-all ${isSearchFocused ? 'border-blue-500 bg-white dark:bg-slate-900 ring-4 ring-blue-500/10' : 'border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          <Search size={18} className={`mr-2 transition-colors ${isSearchFocused ? 'text-blue-500' : 'text-slate-400'}`} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
        </motion.div>
        
        <AnimatePresence>
          {isSearchFocused && searchResults && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl overflow-hidden z-50 origin-top"
            >
              {searchResults.products?.length > 0 && (
                <div className="p-2 border-b border-slate-100 dark:border-slate-700/50">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1">Products</h4>
                  {searchResults.products.map(p => (
                    <div key={p.productId} onClick={() => { navigate('/inventory'); setIsSearchFocused(false); }} className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg cursor-pointer flex items-center transition-colors group">
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-md mr-3 group-hover:scale-110 transition-transform">
                        <Package size={14} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{p.name} <span className="text-slate-400 text-xs ml-1">({p.productId})</span></span>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.orders?.length > 0 && (
                <div className="p-2 border-b border-slate-100 dark:border-slate-700/50">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1">Orders</h4>
                  {searchResults.orders.map(o => (
                    <div key={o.orderId} onClick={() => { navigate('/orders'); setIsSearchFocused(false); }} className="px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg cursor-pointer flex items-center transition-colors group">
                      <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-md mr-3 group-hover:scale-110 transition-transform">
                        <ShoppingCart size={14} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{o.orderId}</span>
                    </div>
                  ))}
                </div>
              )}
              {(!searchResults.products?.length && !searchResults.orders?.length) && (
                <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center">
                  <Search size={24} className="text-slate-300 dark:text-slate-600 mb-2" />
                  No results found for "{searchQuery}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-3">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        <div className="relative" ref={notifRef}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
          </motion.button>
          
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden origin-top-right"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notifications</h3>
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 transition-colors">Mark all read</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  <div className="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-left"></div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Low Stock Alert</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Product P005 has fallen below minimum threshold.</p>
                    <p className="text-[10px] text-slate-400 mt-2">10 mins ago</p>
                  </div>
                  <div className="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-left"></div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pending Orders (5)</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You have 5 orders awaiting supplier approval.</p>
                    <p className="text-[10px] text-slate-400 mt-2">1 hour ago</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="relative pl-3 border-l border-slate-200 dark:border-slate-700" ref={profileRef}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center cursor-pointer p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md ring-2 ring-white dark:ring-slate-900 mr-2">
              {user?.username?.charAt(0).toUpperCase() || <User size={18} />}
            </div>
            <div className="hidden md:flex flex-col items-start mr-1">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{user?.username || 'Guest'}</span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{user?.role || 'Unknown'}</span>
            </div>
          </motion.div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden origin-top-right"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.username}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email || 'user@supplychain.os'}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => {navigate('/settings'); setIsProfileOpen(false);}}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center"
                  >
                    <User size={16} className="mr-2 text-slate-400" /> My Profile
                  </button>
                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center"
                  >
                    <LogOut size={16} className="mr-2 text-red-500" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
