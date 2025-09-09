"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, AlertTriangle } from "lucide-react";

import { getExpenses, getExpenseSummary, deleteExpense } from "@/lib/data";
import { Expense, ExpenseSummary } from "@/lib/types";
import ExpenseForm from "@/components/ExpenceForm";
import ExpenseSummaryComponent from "@/components/ExpenceSummery";
import ExpenseChart from "@/components/ExpenceChart";
import ExpenseList from "@/components/ExpenceList";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary>({
    totalExpenses: 0,
    monthlyTotal: 0,
    weeklyTotal: 0,
    dailyAverage: 0,
    topCategory: "None",
    transactionCount: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const expensesData = getExpenses();
    const summaryData = getExpenseSummary();
    setExpenses(expensesData);
    setSummary(summaryData);
  };

  const handleFormSuccess = () => {
    loadData();
    setShowForm(false);
    setEditingExpense(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      deleteExpense(id);
      loadData();
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleAddNew = () => {
    setEditingExpense(undefined);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Wallet className="h-10 w-10 text-blue-600" />
              Expense Tracker
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Track your spending, manage your budget, and achieve your
              financial goals.
            </p>
          </div>
          <Button
            onClick={handleAddNew}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Delete Confirmation Alert */}
        {/* {deleteConfirm && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Click delete again to confirm removal of this expense.
            </AlertDescription>
          </Alert>
        )} */}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <ExpenseForm
                expense={editingExpense}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Summary Cards */}
          <ExpenseSummaryComponent summary={summary} />

          {/* Charts */}
          <ExpenseChart />

          {/* Expenses List */}
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-muted-foreground">
          <p>Built with Next.js, Tailwind CSS, and shadcn/ui</p>
        </footer>
      </div>
    </div>
  );
}
