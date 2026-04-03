import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Transaction, UserRole, TimeRange } from '../types';

interface AppContextType {
  // Role
  role: UserRole;
  setRole: (role: UserRole) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'income' | 'expense';
  setFilterType: (type: 'all' | 'income' | 'expense') => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  
  // Computed
  filteredTransactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  categories: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate sample data
const generateSampleData = (): Transaction[] => {
  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Other Income'],
    expense: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Education']
  };
  
  const sampleTransactions: Transaction[] = [];
  const now = new Date();
  
  // Generate transactions for the last 6 months
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const isIncome = Math.random() > 0.7;
    const type = isIncome ? 'income' : 'expense';
    const categoryList = categories[type];
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];
    
    const amount = isIncome 
      ? Math.floor(Math.random() * 3000) + 500
      : Math.floor(Math.random() * 500) + 20;
    
    const descriptions: Record<string, string[]> = {
      'Salary': ['Monthly Salary', 'Bonus Payment', 'Commission'],
      'Freelance': ['Web Design Project', 'Consulting Fee', 'Freelance Work'],
      'Investments': ['Stock Dividend', 'Crypto Gains', 'Interest Earned'],
      'Other Income': ['Gift Received', 'Refund', 'Sold Item'],
      'Housing': ['Rent Payment', 'Mortgage', 'Property Tax'],
      'Food': ['Grocery Shopping', 'Restaurant', 'Coffee Shop', 'Takeout'],
      'Transportation': ['Gas Station', 'Uber Ride', 'Public Transit', 'Car Maintenance'],
      'Entertainment': ['Movie Tickets', 'Streaming Service', 'Concert', 'Game Purchase'],
      'Shopping': ['Clothing', 'Electronics', 'Home Decor', 'Online Shopping'],
      'Utilities': ['Electric Bill', 'Internet Bill', 'Phone Bill', 'Water Bill'],
      'Health': ['Pharmacy', 'Doctor Visit', 'Gym Membership', 'Health Insurance'],
      'Education': ['Online Course', 'Books', 'Tuition Fee', 'Workshop']
    };
    
    const descList = descriptions[category] || ['Transaction'];
    const description = descList[Math.floor(Math.random() * descList.length)];
    
    sampleTransactions.push({
      id: `txn-${Date.now()}-${i}`,
      date: date.toISOString().split('T')[0],
      amount,
      category,
      description,
      type
    });
  }
  
  return sampleTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role state
  const [role, setRole] = useState<UserRole>('viewer');
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : generateSampleData();
    }
    return generateSampleData();
  });
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev: boolean) => !prev);
  }, []);
  
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setTransactions((prev: Transaction[]) => [newTransaction, ...prev]);
  }, []);
  
  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev: Transaction[]) => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);
  
  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev: Transaction[]) => prev.filter(t => t.id !== id));
  }, []);
  
  // Filter transactions based on all criteria
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    // Category filter
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    // Time range filter
    let matchesTimeRange = true;
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    
    switch (timeRange) {
      case '7d':
        matchesTimeRange = (now.getTime() - transactionDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        break;
      case '30d':
        matchesTimeRange = (now.getTime() - transactionDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        break;
      case '90d':
        matchesTimeRange = (now.getTime() - transactionDate.getTime()) <= 90 * 24 * 60 * 60 * 1000;
        break;
      case '1y':
        matchesTimeRange = (now.getTime() - transactionDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        matchesTimeRange = true;
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesTimeRange;
  });
  
  // Computed values
  const totalBalance = transactions.reduce((acc, t) => 
    acc + (t.type === 'income' ? t.amount : -t.amount), 0
  );
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const categories = Array.from(new Set(transactions.map(t => t.category)));
  
  return (
    <AppContext.Provider value={{
      role,
      setRole,
      isDarkMode,
      toggleDarkMode,
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      searchQuery,
      setSearchQuery,
      filterType,
      setFilterType,
      filterCategory,
      setFilterCategory,
      timeRange,
      setTimeRange,
      filteredTransactions,
      totalBalance,
      totalIncome,
      totalExpenses,
      categories
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
