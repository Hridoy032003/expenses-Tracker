export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  monthlyTotal: number;
  weeklyTotal: number;
  dailyAverage: number;
  topCategory: string;
  transactionCount: number;
}