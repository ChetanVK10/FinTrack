import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TransactionList from '../components/TransactionList';

const Transactions: React.FC = () => {
  const { role, isDarkMode } = useApp();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight transition-colors duration-500
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Transactions
          </h1>
          <p className={`mt-1 transition-colors duration-500
            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage and track all your financial transactions
          </p>
        </div>
        
        {/* Role Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border
            ${role === 'admin'
              ? (isDarkMode 
                  ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' 
                  : 'bg-violet-100 text-violet-700 border-violet-200')
              : (isDarkMode 
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                  : 'bg-blue-100 text-blue-700 border-blue-200')
            }`}
        >
          <Shield className="w-4 h-4" />
          {role === 'admin' ? 'Admin Mode - Full Access' : 'Viewer Mode - Read Only'}
        </motion.div>
      </div>
      
      {/* Info Banner for Viewer */}
      {role === 'viewer' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border flex items-start gap-3
            ${isDarkMode 
              ? 'bg-blue-500/10 border-blue-500/20' 
              : 'bg-blue-50 border-blue-200'}`}
        >
          <Shield className={`w-5 h-5 mt-0.5 flex-shrink-0
            ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <p className={`font-medium transition-colors duration-500
              ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              Viewer Mode Active
            </p>
            <p className={`text-sm transition-colors duration-500
              ${isDarkMode ? 'text-blue-400/80' : 'text-blue-600'}`}>
              You can view and filter transactions but cannot add, edit, or delete them. 
              Switch to Admin mode in the sidebar to make changes.
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Transaction List */}
      <TransactionList />
    </div>
  );
};

export default Transactions;
