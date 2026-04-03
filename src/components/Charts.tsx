import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

// Color palette
const DARK_COLORS = ['#8b5cf6', '#a78bfa', '#ec4899', '#f97316', '#fbbf24', '#06b6d4', '#10b981', '#f59e0b'];
const LIGHT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#fbbf24', '#06b6d4', '#10b981', '#f59e0b'];

interface BalanceDataPoint {
  date: string;
  balance: number;
  income: number;
  expense: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
  percentage: number;
}

interface MonthlyDataPoint {
  month: string;
  income: number;
  expense: number;
}

export const BalanceTrendChart: React.FC = () => {
  const { transactions, timeRange, isDarkMode } = useApp();
  
  const processData = (): BalanceDataPoint[] => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data: BalanceDataPoint[] = [];
    const now = new Date();
    
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const dateMap = new Map<string, BalanceDataPoint>();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { date: dateStr, balance: 0, income: 0, expense: 0 });
    }
    
    sortedTransactions.forEach(t => {
      if (dateMap.has(t.date)) {
        const entry = dateMap.get(t.date)!;
        if (t.type === 'income') {
          entry.income += t.amount;
        } else {
          entry.expense += t.amount;
        }
      }
    });
    
    let cumulativeBalance = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return tDate < cutoffDate;
      })
      .reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
    
    const sortedDates = Array.from(dateMap.keys()).sort();
    sortedDates.forEach(date => {
      const entry = dateMap.get(date)!;
      cumulativeBalance += entry.income - entry.expense;
      entry.balance = cumulativeBalance;
      data.push(entry);
    });
    
    return data;
  };
  
  const data = processData();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      <div className={`p-6 rounded-2xl border overflow-hidden transition-all duration-500
        ${isDarkMode 
          ? 'bg-[#131826] border-white/5' 
          : 'bg-white border-gray-200 shadow-lg shadow-gray-200/50'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold transition-colors duration-500
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Balance Trend
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-violet-500' : 'bg-indigo-500'}`} />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Balance</span>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDarkMode ? "#8b5cf6" : "#6366f1"} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={isDarkMode ? "#8b5cf6" : "#6366f1"} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={isDarkMode ? "#8b5cf6" : "#6366f1"} />
                  <stop offset="50%" stopColor={isDarkMode ? "#a78bfa" : "#8b5cf6"} />
                  <stop offset="100%" stopColor={isDarkMode ? "#ec4899" : "#ec4899"} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                tick={{ fill: isDarkMode ? '#6b7280' : '#9ca3af', fontSize: 12 }}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                tick={{ fill: isDarkMode ? '#6b7280' : '#9ca3af', fontSize: 12 }}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1a1f2e' : '#ffffff',
                  border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                  borderRadius: '12px',
                  boxShadow: isDarkMode 
                    ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: isDarkMode ? '#fff' : '#111827', fontWeight: 600, marginBottom: '8px' }}
                itemStyle={{ color: isDarkMode ? '#a78bfa' : '#6366f1' }}
                formatter={(value) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  return [formatCurrency(numValue), 'Balance'];
                }}
                labelFormatter={(label) => formatDate(label as string)}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="url(#lineGradient)" 
                strokeWidth={3}
                fill="url(#balanceGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export const CategoryBreakdownChart: React.FC = () => {
  const { transactions, isDarkMode } = useApp();
  
  const processData = (): CategoryDataPoint[] => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });
    
    const total = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);
    
    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: Math.round((amount / total) * 100)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };
  
  const data = processData();
  const COLORS = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className={`p-6 rounded-2xl border overflow-hidden transition-all duration-500
        ${isDarkMode 
          ? 'bg-[#131826] border-white/5' 
          : 'bg-white border-gray-200 shadow-lg shadow-gray-200/50'}`}>
        <h3 className={`text-lg font-semibold mb-6 transition-colors duration-500
          ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Spending by Category
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1a1f2e' : '#ffffff',
                  border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                  borderRadius: '12px',
                  boxShadow: isDarkMode 
                    ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: isDarkMode ? '#fff' : '#111827', fontWeight: 600 }}
                formatter={(value, name, props) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const percentage = (props as any)?.payload?.percentage ?? 0;
                  return [`${formatCurrency(numValue)} (${percentage}%)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {data.slice(0, 6).map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className={`text-sm truncate transition-colors duration-500
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const IncomeExpenseChart: React.FC = () => {
  const { transactions, isDarkMode } = useApp();
  
  const processData = (): MonthlyDataPoint[] => {
    const monthlyMap = new Map<string, MonthlyDataPoint>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const now = new Date();
    const recentMonths: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = months[d.getMonth()];
      recentMonths.push({ key, label });
      monthlyMap.set(key, { month: label, income: 0, expense: 0 });
    }
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap.has(key)) {
        const entry = monthlyMap.get(key)!;
        if (t.type === 'income') {
          entry.income += t.amount;
        } else {
          entry.expense += t.amount;
        }
      }
    });
    
    return recentMonths.map(m => monthlyMap.get(m.key)!);
  };
  
  const data = processData();
  
  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(1)}k`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className={`p-6 rounded-2xl border overflow-hidden transition-all duration-500
        ${isDarkMode 
          ? 'bg-[#131826] border-white/5' 
          : 'bg-white border-gray-200 shadow-lg shadow-gray-200/50'}`}>
        <h3 className={`text-lg font-semibold mb-6 transition-colors duration-500
          ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Income vs Expenses
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                tick={{ fill: isDarkMode ? '#6b7280' : '#9ca3af', fontSize: 12 }}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                tick={{ fill: isDarkMode ? '#6b7280' : '#9ca3af', fontSize: 12 }}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1a1f2e' : '#ffffff',
                  border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                  borderRadius: '12px',
                  boxShadow: isDarkMode 
                    ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: isDarkMode ? '#fff' : '#111827', fontWeight: 600 }}
                formatter={(value) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  return [formatCurrency(numValue), ''];
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill={isDarkMode ? "#8b5cf6" : "#6366f1"}
                radius={[6, 6, 0, 0]}
              />
              <Bar 
                dataKey="expense" 
                name="Expenses" 
                fill="#f97316"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
