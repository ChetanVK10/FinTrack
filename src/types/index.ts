export type TransactionType = 'income' | 'expense';
export type UserRole = 'viewer' | 'admin';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: TransactionType;
}

export interface FinancialData {
  transactions: Transaction[];
}

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}
