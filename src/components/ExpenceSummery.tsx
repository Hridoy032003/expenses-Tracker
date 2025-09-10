"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Target,
  Calendar,
} from "lucide-react";
import { ExpenseSummary } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

// Define Expense type for better type safety
interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // Format: YYYY-MM-DD
  description?: string;
}

export default function ExpenseSummaryComponent() {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Fetch expenses and calculate summary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expenses data
        const expensesResponse = await fetch("/api/getAllexpence"); // Replace with the actual API endpoint
        if (!expensesResponse.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const expensesData = await expensesResponse.json();
        const expenses: Expense[] = expensesData.Expences || []; // Ensure expenses are typed correctly

        // Calculate the summary based on fetched expenses
        const totalExpenses = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        // Calculate monthly total
        const thisMonth = new Date();
        const monthlyExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === thisMonth.getMonth() &&
            expenseDate.getFullYear() === thisMonth.getFullYear()
          );
        });
        const monthlyTotal = monthlyExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        // Calculate weekly total
        const thisWeekStart = new Date();
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
        const weeklyExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= thisWeekStart && expenseDate <= new Date();
        });
        const weeklyTotal = weeklyExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        // Calculate daily average
        const dailyAverage = totalExpenses / expenses.length;

        // Calculate top category (category with the highest total expense)
        const categoryTotals: Record<string, number> = expenses.reduce(
          (acc: Record<string, number>, expense: Expense) => {
            const category = expense.category;
            if (!acc[category]) acc[category] = 0; 
            acc[category] += expense.amount; 
            return acc;
          },
          {} 
        );

        const topCategory = Object.entries(categoryTotals).reduce(
          (max, entry) => {
            if (entry[1] > max[1]) {
              return entry;
            }
            return max;
          },
          ["", 0]
        )[0];

        // Calculate transaction count
        const transactionCount = expenses.length;

        const calculatedSummary: ExpenseSummary = {
          totalExpenses,
          monthlyTotal,
          weeklyTotal,
          dailyAverage,
          topCategory,
          transactionCount,
        };

        setSummary(calculatedSummary);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load summary data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryItems = [
    {
      title: "Total Expenses",
      value: summary ? formatAmount(summary.totalExpenses) : "-",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2.1%",
      isPositive: false,
    },
    {
      title: "This Month",
      value: summary ? formatAmount(summary.monthlyTotal) : "-",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+5.4%",
      isPositive: false,
    },
    {
      title: "This Week",
      value: summary ? formatAmount(summary.weeklyTotal) : "-",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "-12.5%",
      isPositive: true,
    },
    {
      title: "Daily Average",
      value: summary ? formatAmount(summary.dailyAverage) : "-",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+1.2%",
      isPositive: false,
    },
    {
      title: "Top Category",
      value: summary ? summary.topCategory : "-",
      icon: Target,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "-",
      isPositive: false,
    },
    {
      title: "Total Transactions",
      value: summary ? summary.transactionCount.toString() : "-",
      icon: CreditCard,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      change: "-",
      isPositive: false,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-between">
        <Skeleton className="p-15" />
        <Skeleton className="p-15" />
        <Skeleton className="p-15" />
        <Skeleton className="p-15" />
        <Skeleton className="p-15" />
        <Skeleton className="p-15" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {item.isPositive ? (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={
                        item.isPositive ? "text-green-600" : "text-red-600"
                      }
                    >
                      {item.change}
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${item.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
