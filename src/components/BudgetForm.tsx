import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, DollarSign, Target, Home } from "lucide-react";
import { BudgetCategory } from "@/types/budget";

interface BudgetFormProps {
  onBack: () => void;
  onSave: (categories: BudgetCategory[], monthlyIncome: number, savingsGoal: number) => void;
  initialData?: {
    categories: BudgetCategory[];
    monthlyIncome: number;
    savingsGoal: number;
  };
}

const categoryColors = [
  "hsl(213, 94%, 68%)",
  "hsl(158, 64%, 52%)",
  "hsl(38, 92%, 58%)",
  "hsl(0, 84%, 60%)",
  "hsl(213, 94%, 58%)",
  "hsl(46, 91%, 58%)",
  "hsl(336, 84%, 60%)",
  "hsl(271, 91%, 65%)",
];

export function BudgetForm({ onBack, onSave, initialData }: BudgetFormProps) {
  const [monthlyIncome, setMonthlyIncome] = useState(initialData?.monthlyIncome?.toString() || "");
  const [savingsGoal, setSavingsGoal] = useState(initialData?.savingsGoal?.toString() || "");
  const [categories, setCategories] = useState(
    initialData?.categories?.map(cat => ({ name: cat.category, amount: cat.budgeted.toString() })) || [
      { name: "Housing", amount: "" },
      { name: "Food", amount: "" },
      { name: "Transportation", amount: "" },
      { name: "Utilities", amount: "" },
      { name: "Entertainment", amount: "" },
    ]
  );

  const addCategory = () => {
    setCategories([...categories, { name: "", amount: "" }]);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: 'name' | 'amount', value: string) => {
    const newCategories = [...categories];
    newCategories[index][field] = value;
    setCategories(newCategories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetCategories: BudgetCategory[] = categories
      .filter(cat => cat.name && cat.amount && parseFloat(cat.amount) > 0)
      .map((cat, index) => ({
        id: (index + 1).toString(),
        category: cat.name,
        budgeted: parseFloat(cat.amount),
        spent: initialData?.categories.find(initial => initial.category === cat.name)?.spent || 0,
        color: categoryColors[index % categoryColors.length],
      }));
    
    onSave(
      budgetCategories,
      parseFloat(monthlyIncome) || 0,
      parseFloat(savingsGoal) || 0
    );
    
    onBack();
  };

  const totalBudget = categories.reduce((sum, cat) => sum + (parseFloat(cat.amount) || 0), 0);
  const income = parseFloat(monthlyIncome) || 0;
  const savings = parseFloat(savingsGoal) || 0;
  const remaining = income - totalBudget - savings;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Budget</h1>
          <p className="text-muted-foreground">Set up your income and spending categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                Income & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="0"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savings">Savings Goal</Label>
                  <Input
                    id="savings"
                    type="number"
                    placeholder="0"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Budget Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Category name"
                      value={category.name}
                      onChange={(e) => updateCategory(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={category.amount}
                      onChange={(e) => updateCategory(index, 'amount', e.target.value)}
                    />
                  </div>
                  {categories.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(index)}
                    >
                      <Trash2 className="w-4 h-4 text-danger" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addCategory}>
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="shadow-soft border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-success" />
                Budget Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Income</span>
                  <span className="font-semibold text-success">
                    ${income.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-semibold text-warning">
                    ${totalBudget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Savings Goal</span>
                  <span className="font-semibold text-primary">
                    ${savings.toLocaleString()}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="font-medium">Remaining</span>
                  <span className={`font-bold ${remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                    ${remaining.toLocaleString()}
                  </span>
                </div>
              </div>

              {remaining < 0 && (
                <div className="p-3 bg-danger-light border border-danger/30 rounded-lg">
                  <p className="text-sm text-danger">
                    Your budget exceeds your income by ${Math.abs(remaining).toLocaleString()}. 
                    Consider adjusting your categories or savings goal.
                  </p>
                </div>
              )}

              <Button 
                variant="hero" 
                className="w-full" 
                onClick={handleSubmit}
              >
                Save Budget
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}