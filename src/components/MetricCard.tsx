import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MetricCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense';
  trend?: number;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, amount, type, trend, delay = 0 }) => {
  const { isDarkMode } = useApp();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const getIcon = () => {
    switch (type) {
      case 'balance':
        return <Wallet className="w-6 h-6" />;
      case 'income':
        return <ArrowUpRight className="w-6 h-6" />;
      case 'expense':
        return <ArrowDownRight className="w-6 h-6" />;
    }
  };
  
  const getGradient = () => {
    if (isDarkMode) {
      switch (type) {
        case 'balance':
          return 'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20';
        case 'income':
          return 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20';
        case 'expense':
          return 'from-orange-500/20 via-amber-500/20 to-yellow-500/20';
      }
    } else {
      switch (type) {
        case 'balance':
          return 'from-violet-100 via-purple-50 to-fuchsia-50';
        case 'income':
          return 'from-emerald-100 via-teal-50 to-cyan-50';
        case 'expense':
          return 'from-orange-100 via-amber-50 to-yellow-50';
      }
    }
  };
  
  const getIconGradient = () => {
    switch (type) {
      case 'balance':
        return 'from-violet-500 to-purple-500 text-white';
      case 'income':
        return 'from-emerald-500 to-teal-500 text-white';
      case 'expense':
        return 'from-orange-500 to-amber-500 text-white';
    }
  };
  
  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 
      ? <TrendingUp className="w-4 h-4" />
      : <TrendingDown className="w-4 h-4" />;
  };
  
  const getTrendColor = () => {
    if (!trend) return '';
    if (type === 'expense') {
      return trend > 0 
        ? (isDarkMode ? 'text-orange-400' : 'text-orange-600')
        : (isDarkMode ? 'text-emerald-400' : 'text-emerald-600');
    }
    return trend > 0 
      ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
      : (isDarkMode ? 'text-orange-400' : 'text-orange-600');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className={`relative p-6 rounded-2xl border overflow-hidden transition-all duration-500
        ${isDarkMode 
          ? 'bg-[#131826] border-white/5' 
          : 'bg-white border-gray-200 shadow-lg shadow-gray-200/50'}`}>
        
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} ${isDarkMode ? 'opacity-50' : 'opacity-100'}`} />
        
        {/* Subtle grid pattern */}
        {isDarkMode && (
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />
        )}
        
        {/* Glow effect on hover */}
        {isDarkMode && (
          <div className="absolute -inset-px bg-gradient-to-r from-violet-500/0 via-purple-500/0 to-orange-500/0 group-hover:from-violet-500/20 group-hover:via-purple-500/20 group-hover:to-orange-500/20 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        )}
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={`text-sm font-medium mb-1 transition-colors duration-500
                ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {title}
              </p>
              <h3 className={`text-3xl font-bold tracking-tight transition-colors duration-500
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(amount)}
              </h3>
              
              {trend !== undefined && (
                <div className={`flex items-center gap-1.5 mt-2 text-sm font-medium ${getTrendColor()}`}>
                  <span className={`p-1 rounded-lg ${trend > 0 ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
                    {getTrendIcon()}
                  </span>
                  <span>{Math.abs(trend)}% from last month</span>
                </div>
              )}
            </div>
            
            {/* Icon with gradient background */}
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getIconGradient()} shadow-lg`}>
              {getIcon()}
            </div>
          </div>
          
          {/* Bottom accent line */}
          <div className={`h-1 w-full rounded-full bg-gradient-to-r ${getIconGradient()} opacity-20`} />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
