"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";

import { defaultCategories } from "@/lib/data";
import { Expense } from "@/lib/types";


const API_BASE_URL = "/api/expence/addExpence";

interface ExpenseFormProps {
  expense?: Expense; 
  onSuccess: () => void; 
  onCancel: () => void; 
}

export default function ExpenseForm({
  expense,
  onSuccess,
  onCancel,
}: ExpenseFormProps) {
 
  const [formData, setFormData] = useState({
    title: expense?.title || "",
    amount: expense?.amount ? String(expense.amount) : "",
    category: expense?.category || "",
    date: expense?.date
      ? new Date(expense.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    description: expense?.description || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    // Convert amount to number for validation
    const amountNum = Number(formData.amount);
    if (!formData.amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  
    if (!validateForm()) {
      return; 
    }

    setIsSubmitting(true);
    setServerError(null); 
    try {
      
      const expenseDataToSend = {
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description.trim(),
      };

      let response;
      let url;

      if (expense) {
        url = `${API_BASE_URL}?id=${expense.id}`;
        response = await fetch(url, {
          method: "PUT", // Or 'PATCH' depending on your API
          headers: {
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify(expenseDataToSend),
        });
      } else {
       
        url = API_BASE_URL;
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
         
          },
          body: JSON.stringify(expenseDataToSend),
        });
      }

      if (!response.ok) {
        const errorResult = await response.json();
        const errorMessage =
          errorResult.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving expense:", error);
      setServerError(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleInputChange = (
    field: keyof typeof formData, 
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
   
    if (clientErrors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          {expense ? "Edit Expense" : "Add New Expense"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display server error message if any */}
          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter expense title"
                className={clientErrors.title ? "border-red-500" : ""}
                aria-invalid={!!clientErrors.title}
                aria-describedby={
                  clientErrors.title ? "title-error" : undefined
                }
              />
              {clientErrors.title && (
                <p id="title-error" className="text-sm text-red-500">
                  {clientErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="₹0.00"
                className={clientErrors.amount ? "border-red-500" : ""}
                aria-invalid={!!clientErrors.amount}
                aria-describedby={
                  clientErrors.amount ? "amount-error" : undefined
                }
              />
              {clientErrors.amount && (
                <p id="amount-error" className="text-sm text-red-500">
                  {clientErrors.amount}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: string) =>
                  handleInputChange("category", value)
                }
                // Adding aria attributes for accessibility
                aria-label="Select expense category"
              >
                <SelectTrigger
                  className={clientErrors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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
              {clientErrors.category && (
                <p className="text-sm text-red-500">{clientErrors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={clientErrors.date ? "border-red-500" : ""}
                aria-invalid={!!clientErrors.date}
                aria-describedby={clientErrors.date ? "date-error" : undefined}
              />
              {clientErrors.date && (
                <p id="date-error" className="text-sm text-red-500">
                  {clientErrors.date}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting
                ? "Saving..."
                : expense
                ? "Update Expense"
                : "Add Expense"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
