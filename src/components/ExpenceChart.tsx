"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function ExpenseChart() {
  const [categoryData, setCategoryData] = useState<unknown[]>([]);
  const [expenses, setExpenses] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses and category data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expenses data
        const expensesResponse = await fetch("/api/getAllexpence"); 
        if (!expensesResponse.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const expensesData = await expensesResponse.json();
        setExpenses(expensesData.Expences || []);

    
        const categoryResponse = await fetch("/api/categoryData"); 
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch category data");
        }
        const categoryData = await categoryResponse.json();
        setCategoryData(categoryData.categories || []); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get monthly data for the last 6 months
  const getMonthlyData = () => {
    const now = new Date();
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= month && expenseDate < nextMonth;
      });

      const total = monthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      monthlyData.push({
        month: month.toLocaleDateString("en-US", { month: "short" }),
        amount: total,
      });
    }

    return monthlyData;
  };

  const monthlyData = getMonthlyData();

  const COLORS = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#F97316", // Orange
    "#06B6D4", // Teal
    "#84CC16", // Lime
  ];

  const getCategoryColor = (categoryName: string) => {
    const categoryIndex = categoryData.findIndex(
      (cat) => cat.category === categoryName
    );
    // Return color from COLORS array based on index
    return categoryIndex >= 0
      ? COLORS[categoryIndex % COLORS.length]
      : "#000000"; // Default to black if not found
  };

  const pieData = categoryData.map((data) => ({
    name: data.category,
    value: data.amount,
    color: getCategoryColor(data.category),
  }));

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Skeleton className="p-50" /><Skeleton className="p-50" /></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatAmount(Number(value))} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {categoryData.slice(0, 6).map((data) => (
                  <div key={data.category} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: getCategoryColor(data.category),
                      }}
                    />
                    <span className="truncate">{data.category}</span>
                    <span className="font-semibold ml-auto">
                      {formatAmount(data.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-muted-foreground">
                No data available for chart
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trend Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.some((data) => data.amount > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => formatAmount(Number(value))} />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="#3B82F6"
                  name="Expenses"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📈</div>
              <p className="text-muted-foreground">
                No data available for trend
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
