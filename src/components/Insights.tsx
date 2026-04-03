import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  PiggyBank,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Wallet
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Insights: React.FC = () => {
  const { transactions, isDarkMode } = useApp();
  
  const calculateInsights = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
    
    const lastMonthDate = new Date(now);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === lastMonthDate.getMonth() && tDate.getFullYear() === lastMonthDate.getFullYear();
    });
    
    const thisMonthIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const thisMonthExpense = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthIncome = lastMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const lastMonthExpense = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const categorySpending = new Map();
    thisMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categorySpending.get(t.category) || 0;
        categorySpending.set(t.category, current + t.amount);
      });
    
    let highestCategory = { name: '', amount: 0 };
    categorySpending.forEach((amount, category) => {
      if (amount > highestCategory.amount) {
        highestCategory = { name: category, amount };
      }
    });
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = Math.min(now.getDate(), daysInMonth);
    const avgDailySpending = thisMonthExpense / currentDay;
    
    const projectedExpense = avgDailySpending * daysInMonth;
    
    const savingsRate = thisMonthIncome > 0 
      ? ((thisMonthIncome - thisMonthExpense) / thisMonthIncome) * 100 
      : 0;
    
    return {
      thisMonthIncome,
      thisMonthExpense,
      lastMonthIncome,
      lastMonthExpense,
      highestCategory,
      avgDailySpending,
      projectedExpense,
      savingsRate,
      incomeChange: lastMonthIncome > 0 
        ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 
        : 0,
      expenseChange: lastMonthExpense > 0 
        ? ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100 
        : 0,
    };
  };
  
  const insights = calculateInsights();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const insightCards = [
    {
      id: 1,
      icon: BarChart3,
      title: 'Highest Spending Category',
      value: insights.highestCategory.name || 'N/A',
      subtext: insights.highestCategory.amount > 0 
        ? `${formatCurrency(insights.highestCategory.amount)} this month`
        : 'No expenses yet',
      gradient: isDarkMode ? 'from-violet-500/20 to-purple-500/20' : 'from-violet-100 to-purple-100',
      iconBg: isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600',
      trend: null
    },
    {
      id: 2,
      icon: Wallet,
      title: 'Average Daily Spending',
      value: formatCurrency(insights.avgDailySpending),
      subtext: `Projected: ${formatCurrency(insights.projectedExpense)}`,
      gradient: isDarkMode ? 'from-orange-500/20 to-amber-500/20' : 'from-orange-100 to-amber-100',
      iconBg: isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600',
      trend: null
    },
    {
      id: 3,
      icon: PiggyBank,
      title: 'Savings Rate',
      value: `${insights.savingsRate.toFixed(1)}%`,
      subtext: insights.savingsRate > 20 
        ? 'Great job! Keep it up!' 
        : insights.savingsRate > 0 
          ? 'Try to save more' 
          : 'Spending exceeds income',
      gradient: insights.savingsRate > 20 
        ? (isDarkMode ? 'from-emerald-500/20 to-teal-500/20' : 'from-emerald-100 to-teal-100')
        : insights.savingsRate > 0 
          ? (isDarkMode ? 'from-amber-500/20 to-yellow-500/20' : 'from-amber-100 to-yellow-100')
          : (isDarkMode ? 'from-red-500/20 to-orange-500/20' : 'from-red-100 to-orange-100'),
      iconBg: insights.savingsRate > 20 
        ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
        : insights.savingsRate > 0 
          ? (isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600')
          : (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'),
      trend: null
    },
    {
      id: 4,
      icon: TrendingUp,
      title: 'Income vs Last Month',
      value: `${insights.incomeChange >= 0 ? '+' : ''}${insights.incomeChange.toFixed(1)}%`,
      subtext: insights.incomeChange >= 0 ? 'Increase from last month' : 'Decrease from last month',
      gradient: insights.incomeChange >= 0 
        ? (isDarkMode ? 'from-emerald-500/20 to-teal-500/20' : 'from-emerald-100 to-teal-100')
        : (isDarkMode ? 'from-red-500/20 to-orange-500/20' : 'from-red-100 to-orange-100'),
      iconBg: insights.incomeChange >= 0 
        ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600')
        : (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'),
      trend: insights.incomeChange
    },
    {
      id: 5,
      icon: TrendingDown,
      title: 'Expenses vs Last Month',
      value: `${insights.expenseChange >= 0 ? '+' : ''}${insights.expenseChange.toFixed(1)}%`,
      subtext: insights.expenseChange >= 0 ? 'Spending increased' : 'Spending decreased',
      gradient: insights.expenseChange >= 0 
        ? (isDarkMode ? 'from-red-500/20 to-orange-500/20' : 'from-red-100 to-orange-100')
        : (isDarkMode ? 'from-emerald-500/20 to-teal-500/20' : 'from-emerald-100 to-teal-100'),
      iconBg: insights.expenseChange >= 0 
        ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
        : (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'),
      trend: insights.expenseChange
    },
    {
      id: 6,
      icon: Target,
      title: 'Monthly Budget Status',
      value: insights.thisMonthExpense > insights.thisMonthIncome * 0.8 
        ? 'Near Limit'
        : 'On Track',
      subtext: `${formatCurrency(insights.thisMonthExpense)} of ${formatCurrency(insights.thisMonthIncome * 0.8)} budget`,
      gradient: insights.thisMonthExpense > insights.thisMonthIncome * 0.8 
        ? (isDarkMode ? 'from-red-500/20 to-orange-500/20' : 'from-red-100 to-orange-100')
        : (isDarkMode ? 'from-emerald-500/20 to-teal-500/20' : 'from-emerald-100 to-teal-100'),
      iconBg: insights.thisMonthExpense > insights.thisMonthIncome * 0.8 
        ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600')
        : (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'),
      trend: null
    }
  ];
  
  const generateTips = () => {
    const tips = [];
    
    if (insights.savingsRate < 10) {
      tips.push({
        icon: AlertTriangle,
        title: 'Low Savings Rate',
        description: 'Your savings rate is below 10%. Try to reduce discretionary spending.',
        action: 'Review expenses'
      });
    }
    
    if (insights.expenseChange > 20) {
      tips.push({
        icon: TrendingUp,
        title: 'Spending Increased',
        description: 'Your spending has increased significantly compared to last month.',
        action: 'Analyze spending'
      });
    }
    
    if (insights.thisMonthExpense > insights.thisMonthIncome * 0.9) {
      tips.push({
        icon: AlertTriangle,
        title: 'Budget Alert',
        description: 'You have used over 90% of your monthly budget.',
        action: 'Check budget'
      });
    }
    
    if (insights.savingsRate > 30) {
      tips.push({
        icon: Lightbulb,
        title: 'Great Savings!',
        description: 'Your savings rate is excellent. Consider investing the surplus.',
        action: 'Explore investments'
      });
    }
    
    if (tips.length === 0) {
      tips.push({
        icon: Lightbulb,
        title: 'Keep It Up!',
        description: 'Your finances are on track. Continue monitoring your spending.',
        action: 'View details'
      });
    }
    
    return tips;
  };
  
  const tips = generateTips();
  
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insightCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`p-5 rounded-2xl border overflow-hidden transition-all duration-500
                ${isDarkMode 
                  ? 'bg-[#131826] border-white/5' 
                  : 'bg-white border-gray-200 shadow-lg shadow-gray-200/50'}`}>
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} ${isDarkMode ? 'opacity-50' : 'opacity-100'}`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {card.trend !== null && (
                      <span className={`flex items-center gap-1 text-sm font-medium
                        ${card.trend >= 0 
                          ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') 
                          : (isDarkMode ? 'text-red-400' : 'text-red-600')}`}>
                        {card.trend >= 0 ? '+' : ''}{card.trend.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`text-sm font-medium mb-1 transition-colors duration-500
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {card.title}
                  </h3>
                  <p className={`text-2xl font-bold mb-1 transition-colors duration-500
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {card.value}
                  </p>
                  <p className={`text-sm transition-colors duration-500
                    ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {card.subtext}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Personalized Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className={`p-6 rounded-2xl border transition-all duration-500
          ${isDarkMode 
            ? 'bg-[#131826] border-white/5' 
            : 'bg-white border-gray-200 shadow-lg shadow-gray-200/50'}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl transition-colors duration-500
            ${isDarkMode ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
            <Lightbulb className={`w-6 h-6 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold transition-colors duration-500
              ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Personalized Insights
            </h3>
            <p className={`text-sm transition-colors duration-500
              ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Based on your financial activity
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500
                  ${isDarkMode 
                    ? 'bg-[#0a0e1a] border-white/5 hover:border-violet-500/30' 
                    : 'bg-gray-50 border-gray-200 hover:border-violet-300'}`}
              >
                <div className={`p-2 rounded-lg transition-colors duration-500
                  ${isDarkMode ? 'bg-violet-500/10' : 'bg-violet-100'}`}>
                  <Icon className={`w-5 h-5 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium mb-1 transition-colors duration-500
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {tip.title}
                  </h4>
                  <p className={`text-sm mb-2 transition-colors duration-500
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tip.description}
                  </p>
                  <button className={`inline-flex items-center gap-1 text-sm font-medium transition-colors duration-500
                    ${isDarkMode ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-700'}`}>
                    {tip.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;
