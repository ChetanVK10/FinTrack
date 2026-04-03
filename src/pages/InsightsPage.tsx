import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Insights from '../components/Insights';

const InsightsPage: React.FC = () => {
  const { isDarkMode } = useApp();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight transition-colors duration-500
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Insights
          </h1>
          <p className={`mt-1 transition-colors duration-500
            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            AI-powered analysis of your financial activity
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border
            ${isDarkMode 
              ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' 
              : 'bg-violet-100 text-violet-700 border-violet-200'}`}
        >
          <Zap className="w-4 h-4" />
          Smart Analysis
        </motion.div>
      </div>
      
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative p-6 rounded-2xl border overflow-hidden
          ${isDarkMode 
            ? 'bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-violet-500/20' 
            : 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-violet-200'}`}
      >
        {/* Background glow */}
        {isDarkMode && (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-[80px]" />
          </>
        )}
        
        <div className="relative z-10 flex items-start gap-4">
          <div className={`p-3 rounded-xl border
            ${isDarkMode 
              ? 'bg-violet-500/20 border-violet-500/30' 
              : 'bg-violet-100 border-violet-200'}`}>
            <Lightbulb className={`w-6 h-6 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
          </div>
          <div>
            <h2 className={`text-xl font-semibold mb-2 transition-colors duration-500
              ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Financial Insights
            </h2>
            <p className={`max-w-2xl transition-colors duration-500
              ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We analyze your spending patterns, income trends, and financial behavior 
              to provide personalized recommendations. These insights help you make 
              better financial decisions and achieve your goals faster.
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Insights Content */}
      <Insights />
    </div>
  );
};

export default InsightsPage;
