import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Lightbulb, 
  Moon, 
  Sun, 
  Shield,
  Eye,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode, toggleDarkMode, role, setRole } = useApp();
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/insights', label: 'Insights', icon: Lightbulb },
  ];
  
  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0a0e1a]' : 'bg-gray-50'}`}>
      {/* Background Effects - Only show in dark mode */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px]" />
        </div>
      )}
      
      {/* Noise overlay - Only in dark mode */}
      {isDarkMode && <div className="fixed inset-0 noise-overlay pointer-events-none opacity-50" />}
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-72 border-r z-50 transition-colors duration-500
        ${isDarkMode 
          ? 'bg-[#111827]/80 backdrop-blur-xl border-white/5' 
          : 'bg-white border-gray-200'}`}>
        
        {/* Logo */}
        <div className={`p-6 border-b transition-colors duration-500
          ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-orange-500" />
              <div className={`absolute inset-[2px] rounded-xl flex items-center justify-center
                ${isDarkMode ? 'bg-[#111827]' : 'bg-white'}`}>
                <Sparkles className="w-6 h-6 text-violet-500" />
              </div>
              <div className="absolute -inset-2 bg-violet-500/30 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className={`font-bold text-xl tracking-tight transition-colors duration-500
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                FinTrack
              </h1>
              <p className={`text-xs transition-colors duration-500
                ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Premium Finance
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? isDarkMode 
                      ? 'text-white' 
                      : 'text-violet-600 bg-violet-50'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-violet-600 hover:bg-gray-100'
                  }`}
              >
                {/* Active background glow */}
                {isActive && isDarkMode && (
                  <motion.div
                    layoutId="navGlow"
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl border border-violet-500/30"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Active indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-violet-500 to-purple-500 rounded-r-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10">
                  <Icon className={`w-5 h-5 transition-colors duration-300
                    ${isActive 
                      ? isDarkMode ? 'text-violet-400' : 'text-violet-600'
                      : isDarkMode ? 'group-hover:text-violet-300' : 'group-hover:text-violet-500'
                    }`} />
                </span>
                <span className="relative z-10 font-medium">{item.label}</span>
                
                {/* Hover glow */}
                {!isActive && isDarkMode && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                )}
              </NavLink>
            );
          })}
        </nav>
        
        {/* Role Switcher */}
        <div className={`absolute bottom-40 left-4 right-4 p-1 rounded-2xl border transition-colors duration-500
          ${isDarkMode ? 'bg-[#1a1f2e] border-white/5' : 'bg-gray-100 border-gray-200'}`}>
          <p className={`px-3 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-500
            ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Access Level
          </p>
          <div className="flex gap-1 p-1">
            <button
              onClick={() => setRole('viewer')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${role === 'viewer'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-violet-600 hover:bg-white'
                }`}
            >
              <Eye className="w-4 h-4" />
              Viewer
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${role === 'admin'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-violet-600 hover:bg-white'
                }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          </div>
          <p className={`px-3 pb-2 pt-1 text-[10px] transition-colors duration-500
            ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            {role === 'viewer' 
              ? 'Read-only access' 
              : 'Full management access'}
          </p>
        </div>
        
        {/* Dark Mode Toggle - Fixed and Clear */}
        <div className={`absolute bottom-24 left-4 right-4 p-4 rounded-2xl border transition-colors duration-500
          ${isDarkMode ? 'bg-[#1a1f2e] border-white/5' : 'bg-gray-100 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors duration-500
                ${isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-orange-100 text-orange-500'}`}>
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <p className={`text-sm font-medium transition-colors duration-500
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className={`text-[10px] transition-colors duration-500
                  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {isDarkMode ? 'Easier on the eyes' : 'Bright and clean'}
                </p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button
              onClick={toggleDarkMode}
              className={`relative w-14 h-7 rounded-full p-1 transition-all duration-300
                ${isDarkMode 
                  ? 'bg-violet-500/30 border border-violet-500/50' 
                  : 'bg-gray-300 border border-gray-400'}`}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <motion.div
                className={`w-5 h-5 rounded-full shadow-lg transition-all duration-300
                  ${isDarkMode 
                    ? 'bg-gradient-to-r from-violet-400 to-purple-400' 
                    : 'bg-gradient-to-r from-orange-400 to-yellow-400'}`}
                animate={{ x: isDarkMode ? 26 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 text-center border-t transition-colors duration-500
          ${isDarkMode ? 'text-gray-600 border-white/5' : 'text-gray-400 border-gray-200'}`}>
          <p className="text-[10px]">FinTrack Premium v1.0</p>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="ml-72 min-h-screen relative z-10">
        {/* Mobile Header */}
        <div className={`lg:hidden p-4 border-b flex items-center justify-between transition-colors duration-500
          ${isDarkMode ? 'bg-[#111827]/80 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold transition-colors duration-500
              ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>FinTrack</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-colors duration-500
              ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-violet-600 hover:bg-gray-100'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Page Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;
