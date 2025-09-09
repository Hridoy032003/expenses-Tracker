import { Expense, ExpenseCategory, ExpenseSummary } from './types';

export const defaultCategories: ExpenseCategory[] = [
  { id: '1', name: 'Food & Dining', color: 'bg-orange-500', icon: '🍽️' },
  { id: '2', name: 'Transportation', color: 'bg-blue-500', icon: '🚗' },
  { id: '3', name: 'Shopping', color: 'bg-pink-500', icon: '🛍️' },
  { id: '4', name: 'Entertainment', color: 'bg-purple-500', icon: '🎬' },
  { id: '5', name: 'Health', color: 'bg-green-500', icon: '🏥' },
  { id: '6', name: 'Bills & Utilities', color: 'bg-red-500', icon: '⚡' },
  { id: '7', name: 'Education', color: 'bg-indigo-500', icon: '📚' },
  { id: '8', name: 'Travel', color: 'bg-teal-500', icon: '✈️' },
];

export const getExpenses = (): Expense[] => {
  if (typeof window === 'undefined') return [];
  const expenses = localStorage.getItem('expenses');
  return expenses ? JSON.parse(expenses) : [];
};

export const saveExpenses = (expenses: Expense[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

export const addExpense = (expense: Omit<Expense, 'id'>): Expense => {
  const expenses = getExpenses();
  const newExpense: Expense = {
    ...expense,
    id: Date.now().toString(),
  };
  const updatedExpenses = [...expenses, newExpense];
  saveExpenses(updatedExpenses);
  return newExpense;
};

export const updateExpense = (id: string, expense: Partial<Expense>): void => {
  const expenses = getExpenses();
  const updatedExpenses = expenses.map(exp => 
    exp.id === id ? { ...exp, ...expense } : exp
  );
  saveExpenses(updatedExpenses);
};

export const deleteExpense = (id: string): void => {
  const expenses = getExpenses();
  const updatedExpenses = expenses.filter(exp => exp.id !== id);
  saveExpenses(updatedExpenses);
};

export const getExpenseSummary = (): ExpenseSummary => {
  const expenses = getExpenses();
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyExpenses = expenses.filter(exp => new Date(exp.date) >= thisMonth);
  const weeklyExpenses = expenses.filter(exp => new Date(exp.date) >= thisWeek);

  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const weeklyTotal = weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals: Record<string, number> = {};
  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const topCategory = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  const daysThisMonth = now.getDate();
  const dailyAverage = monthlyTotal / daysThisMonth;

  return {
    totalExpenses,
    monthlyTotal,
    weeklyTotal,
    dailyAverage,
    topCategory,
    transactionCount: expenses.length,
  };
};

export const getCategoryData = () => {
  const expenses = getExpenses();
  const categoryTotals: Record<string, number> = {};
  
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: expenses.length > 0 ? (amount / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};