import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Edit2, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Transaction, TransactionType } from '../types';

const TransactionList: React.FC = () => {
  const { 
    filteredTransactions, 
    isDarkMode,
    role, 
    searchQuery, 
    setSearchQuery,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    categories,
    deleteTransaction,
    updateTransaction,
    addTransaction
  } = useApp();
  
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as TransactionType,
    date: new Date().toISOString().split('T')[0]
  });
  
  const handleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });
  
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const handleAdd = () => {
    setFormData({
      description: '',
      amount: '',
      category: categories[0] || 'Food',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };
  
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      type: transaction.type,
      date: transaction.date
    });
    setIsEditModalOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };
  
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date
    });
    setIsAddModalOpen(false);
  };
  
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        date: formData.date
      });
      setIsEditModalOpen(false);
      setEditingTransaction(null);
    }
  };
  
  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Other Income'];
  const expenseCategories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Education'];
  const availableCategories = formData.type === 'income' ? incomeCategories : expenseCategories;
  
  return (
    <>
      {/* Filters */}
      <div className={`p-5 rounded-2xl border mb-6 transition-all duration-500
        ${isDarkMode 
          ? 'bg-[#131826] border-white/5' 
          : 'bg-white border-gray-200 shadow-lg shadow-gray-200/50'}`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-500
              ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-500 outline-none
                ${isDarkMode 
                  ? 'bg-[#0a0e1a] border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'}`}
            />
          </div>
          
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className={`px-4 py-3 rounded-xl border min-w-[140px] outline-none transition-all duration-500
              ${isDarkMode 
                ? 'bg-[#0a0e1a] border-white/10 text-white focus:border-violet-500/50' 
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500'}`}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`px-4 py-3 rounded-xl border min-w-[160px] outline-none transition-all duration-500
              ${isDarkMode 
                ? 'bg-[#0a0e1a] border-white/10 text-white focus:border-violet-500/50' 
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500'}`}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          {/* Add Button (Admin only) */}
          {role === 'admin' && (
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-500/25 btn-shine"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          )}
        </div>
        
        {/* Results count */}
        <div className={`mt-4 text-sm transition-colors duration-500
          ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Showing {sortedTransactions.length} transaction{sortedTransactions.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden transition-all duration-500
        ${isDarkMode 
          ? 'bg-[#131826] border-white/5' 
          : 'bg-white border-gray-200 shadow-lg shadow-gray-200/50'}`}>
        
        {/* Table Header */}
        <div className={`grid grid-cols-12 gap-4 p-5 border-b text-sm font-medium transition-colors duration-500
          ${isDarkMode 
            ? 'bg-[#1a1f2e]/50 border-white/5 text-gray-400' 
            : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
          <div className="col-span-3 lg:col-span-2">Date</div>
          <div className="col-span-4 lg:col-span-3">Description</div>
          <div className="col-span-2 hidden lg:block">Category</div>
          <div className="col-span-2">Type</div>
          <div 
            className={`col-span-3 lg:col-span-2 flex items-center gap-1 cursor-pointer transition-colors duration-500
              ${isDarkMode ? 'hover:text-violet-400' : 'hover:text-violet-600'}`}
            onClick={() => handleSort('amount')}
          >
            Amount
            <ChevronDown className={`w-4 h-4 transition-transform ${sortBy === 'amount' && sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </div>
          {role === 'admin' && <div className="col-span-1 text-right">Actions</div>}
        </div>
        
        {/* Table Body */}
        <div className="max-h-[500px] overflow-y-auto">
          <AnimatePresence>
            {sortedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`grid grid-cols-12 gap-4 p-5 border-b items-center transition-all duration-500
                  ${isDarkMode 
                    ? 'border-white/5 hover:bg-white/[0.02]' 
                    : 'border-gray-100 hover:bg-gray-50'}
                  ${index === sortedTransactions.length - 1 ? 'border-b-0' : ''}`}
              >
                <div className={`col-span-3 lg:col-span-2 text-sm transition-colors duration-500
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(transaction.date)}
                </div>
                <div className={`col-span-4 lg:col-span-3 font-medium transition-colors duration-500
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {transaction.description}
                </div>
                <div className={`col-span-2 hidden lg:block text-sm transition-colors duration-500
                  ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {transaction.category}
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
                    ${transaction.type === 'income'
                      ? isDarkMode
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : isDarkMode
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        : 'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                    {transaction.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                </div>
                <div className={`col-span-3 lg:col-span-2 font-semibold
                  ${transaction.type === 'income'
                    ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                    : isDarkMode ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                {role === 'admin' && (
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className={`p-2 rounded-lg transition-colors duration-500
                        ${isDarkMode 
                          ? 'text-gray-500 hover:text-violet-400 hover:bg-violet-500/10' 
                          : 'text-gray-400 hover:text-violet-600 hover:bg-violet-50'}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className={`p-2 rounded-lg transition-colors duration-500
                        ${isDarkMode 
                          ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10' 
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {sortedTransactions.length === 0 && (
            <div className={`p-8 text-center transition-colors duration-500
              ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className={`text-lg font-medium mb-1 transition-colors duration-500
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No transactions found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Modal */}
      {isAddModalOpen && (
        <TransactionModal
          title="Add Transaction"
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleSubmitAdd}
          formData={formData}
          setFormData={setFormData}
          availableCategories={availableCategories}
        />
      )}
      
      {/* Edit Modal */}
      {isEditModalOpen && (
        <TransactionModal
          title="Edit Transaction"
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleSubmitEdit}
          formData={formData}
          setFormData={setFormData}
          availableCategories={availableCategories}
        />
      )}
    </>
  );
};

interface TransactionModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  availableCategories: string[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  title,
  onClose,
  onSubmit,
  formData,
  setFormData,
  availableCategories
}) => {
  const { isDarkMode } = useApp();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl transition-all duration-500
          ${isDarkMode 
            ? 'bg-[#131826] border-white/10' 
            : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold transition-colors duration-500
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-500
              ${isDarkMode 
                ? 'text-gray-500 hover:text-white hover:bg-white/5' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-500
              ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all
                  ${formData.type === 'income'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isDarkMode
                      ? 'bg-[#0a0e1a] text-gray-400 border border-white/10 hover:border-emerald-500/50'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-emerald-500'
                  }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all
                  ${formData.type === 'expense'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : isDarkMode
                      ? 'bg-[#0a0e1a] text-gray-400 border border-white/10 hover:border-orange-500/50'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-orange-500'
                  }`}
              >
                Expense
              </button>
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-500
              ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-500
                ${isDarkMode 
                  ? 'bg-[#0a0e1a] border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'}`}
              placeholder="Enter description..."
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-500
              ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Amount
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-500
                ${isDarkMode 
                  ? 'bg-[#0a0e1a] border-white/10 text-white placeholder-gray-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'}`}
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-500
              ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-500
                ${isDarkMode 
                  ? 'bg-[#0a0e1a] border-white/10 text-white focus:border-violet-500/50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500'}`}
            >
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-500
              ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-500
                ${isDarkMode 
                  ? 'bg-[#0a0e1a] border-white/10 text-white focus:border-violet-500/50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-500'}`}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-500 border
                ${isDarkMode 
                  ? 'bg-[#0a0e1a] text-gray-400 hover:bg-white/5 border-white/10' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-violet-500/25"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TransactionList;
