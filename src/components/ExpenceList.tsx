import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Edit, Trash2, Calendar } from "lucide-react";
import { Expense } from "@/lib/types";
import { defaultCategories } from "@/lib/data";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fetchedExpenses, setFetchedExpenses] = useState<Expense[]>([]);

  useEffect(() => {
  
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/getAllexpence"); 
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const data = await response.json();
        setFetchedExpenses(data.Expences || []); 
        setLoading(false);
      } catch (error) {
        setError("Failed to load expenses");
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const filteredAndSortedExpenses = fetchedExpenses
    .filter((expense) => {
      const matchesSearch =
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || expense.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount":
          return b.amount - a.amount;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = defaultCategories.find((cat) => cat.name === categoryName);
    return category ? category.icon : "💰";
  };

  const getCategoryColor = (categoryName: string) => {
    const category = defaultCategories.find((cat) => cat.name === categoryName);
    return category ? category.color : "bg-gray-500";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Expenses
        </CardTitle>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {defaultCategories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
            <p className="text-muted-foreground">
              {fetchedExpenses.length === 0
                ? "Start tracking your expenses by adding your first transaction."
                : "No expenses match your current filters. Try adjusting your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`p-2 rounded-full ${getCategoryColor(
                      expense.category
                    )} text-white`}
                  >
                    <span className="text-lg">
                      {getCategoryIcon(expense.category)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">
                        {expense.title}
                      </h4>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {expense.category}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {expense.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <div className="font-bold text-lg">
                      {formatAmount(expense.amount)}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(expense)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(expense.id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
