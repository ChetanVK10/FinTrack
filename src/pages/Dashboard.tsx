import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MetricCard from '../components/MetricCard';
import { BalanceTrendChart, CategoryBreakdownChart, IncomeExpenseChart } from '../components/Charts';
import TimeRangeSelector from '../components/TimeRangeSelector';

const Dashboard: React.FC = () => {
  const { totalBalance, totalIncome, totalExpenses, filteredTransactions, isDarkMode } = useApp();
  
  const calculateTrend = () => {
    return {
      balance: 8.5,
      income: 12.3,
      expense: -3.2
    };
  };
  
  const trends = calculateTrend();
  const recentTransactions = filteredTransactions.slice(0, 5);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold tracking-tight transition-colors duration-500
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h1>
          <p className={`mt-1 transition-colors duration-500
            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Track your financial health and activity
          </p>
        </div>
        <TimeRangeSelector />
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Balance"
          amount={totalBalance}
          type="balance"
          trend={trends.balance}
          delay={0}
        />
        <MetricCard
          title="Total Income"
          amount={totalIncome}
          type="income"
          trend={trends.income}
          delay={0.1}
        />
        <MetricCard
          title="Total Expenses"
          amount={totalExpenses}
          type="expense"
          trend={trends.expense}
          delay={0.2}
        />
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceTrendChart />
        <CategoryBreakdownChart />
      </div>
      
      {/* Charts Row 2 */}
      <IncomeExpenseChart />
      
      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className={`p-6 rounded-2xl border transition-all duration-500
          ${isDarkMode 
            ? 'bg-[#131826] border-white/5' 
            : 'bg-white border-gray-200 shadow-lg shadow-gray-200/50'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-semibold transition-colors duration-500
              ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Transactions
            </h3>
            <p className={`text-sm transition-colors duration-500
              ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Your latest financial activity
            </p>
          </div>
          <a 
            href="/transactions" 
            className={`flex items-center gap-1 text-sm font-medium transition-colors duration-500
              ${isDarkMode ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-700'}`}
          >
            View all
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 group
                ${isDarkMode 
                  ? 'bg-[#0a0e1a] border-white/5 hover:border-violet-500/30' 
                  : 'bg-gray-50 border-gray-100 hover:border-violet-300'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${transaction.type === 'income'
                    ? isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                    : isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                  }`}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-medium transition-colors duration-500
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {transaction.description}
                  </p>
                  <p className={`text-sm flex items-center gap-2 transition-colors duration-500
                    ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    <Calendar className="w-3 h-3" />
                    {formatDate(transaction.date)}
                    <span className="mx-1">•</span>
                    {transaction.category}
                  </p>
                </div>
              </div>
              <span className={`font-semibold
                ${transaction.type === 'income'
                  ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                  : isDarkMode ? 'text-orange-400' : 'text-orange-600'
                }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
          
          {recentTransactions.length === 0 && (
            <div className={`text-center py-8 transition-colors duration-500
              ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
