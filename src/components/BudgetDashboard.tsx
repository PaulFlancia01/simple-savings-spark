import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Wallet, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Plus,
  DollarSign,
  Calendar,
  CreditCard
} from "lucide-react";
import { BudgetData } from "@/types/budget";

interface BudgetDashboardProps {
  onCreateBudget: () => void;
  onAddExpense: () => void;
  budgetData: BudgetData;
  hasAnyData: boolean;
}

export function BudgetDashboard({ onCreateBudget, onAddExpense, budgetData, hasAnyData }: BudgetDashboardProps) {
  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome to Your Budget Tracker</h1>
          <p className="text-muted-foreground max-w-md">
            Get started by creating your first budget. Set up your income, categories, and savings goals to begin tracking your finances.
          </p>
        </div>
        <Button variant="hero" onClick={onCreateBudget} size="lg">
          <Target className="w-5 h-5" />
          Create Your First Budget
        </Button>
      </div>
    );
  }

  const { categories } = budgetData;
  const totalBudget = categories.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = categories.reduce((sum, item) => sum + item.spent, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const overBudgetCategories = categories.filter(item => item.spent > item.budgeted);

  const pieChartData = categories
    .filter(item => item.spent > 0)
    .map(item => ({
      name: item.category,
      value: item.spent,
      color: item.color
    }));

  // Generate spending trend based on current data (simplified)
  const spendingTrend = [
    { month: "This Month", spending: totalSpent, budget: totalBudget },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budget Dashboard</h1>
          <p className="text-muted-foreground">Track your spending and stay on budget</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onAddExpense}>
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
          <Button variant="hero" onClick={onCreateBudget}>
            <Target className="w-4 h-4" />
            Create Budget
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-success">Monthly budget</p>
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-warning">{spentPercentage.toFixed(1)}% of budget</p>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${remaining.toLocaleString()}</div>
            <p className="text-xs text-success">Available to spend</p>
          </CardContent>
        </Card>

        <Card className="border-danger/20 bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Over Budget</CardTitle>
            <AlertTriangle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overBudgetCategories.length}</div>
            <p className="text-xs text-danger">Categories need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {overBudgetCategories.length > 0 && (
        <Card className="border-danger/30 bg-danger-light shadow-soft">
          <CardHeader>
            <CardTitle className="text-danger flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {overBudgetCategories.map((category) => (
                <Badge key={category.category} variant="destructive">
                  {category.category}: ${(category.spent - category.budgeted).toLocaleString()} over
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget vs Actual Spending */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              Budget vs Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                budgeted: { label: "Budgeted", color: "hsl(213, 94%, 68%)" },
                spent: { label: "Spent", color: "hsl(158, 64%, 52%)" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(215, 16%, 47%)"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(215, 16%, 47%)"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="budgeted" fill="hsl(213, 94%, 68%)" name="Budgeted" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="hsl(158, 64%, 52%)" name="Spent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Spending Breakdown Pie Chart */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Spending Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                spending: { label: "Spending", color: "hsl(213, 94%, 68%)" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Spending Trend */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              spending: { label: "Spending", color: "hsl(158, 64%, 52%)" },
              budget: { label: "Budget", color: "hsl(213, 94%, 68%)" }
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" stroke="hsl(215, 16%, 47%)" />
                <YAxis stroke="hsl(215, 16%, 47%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="budget" 
                  stroke="hsl(213, 94%, 68%)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Budget"
                />
                <Line 
                  type="monotone" 
                  dataKey="spending" 
                  stroke="hsl(158, 64%, 52%)" 
                  strokeWidth={3}
                  name="Actual Spending"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Category Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const percentage = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
            const isOverBudget = percentage > 100;
            
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.category}</span>
                  <span className={`text-sm ${isOverBudget ? 'text-danger' : 'text-success'}`}>
                    ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-2 ${isOverBudget ? '[&>div]:bg-danger' : '[&>div]:bg-success'}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{percentage.toFixed(1)}% used</span>
                  <span>${(category.budgeted - category.spent).toLocaleString()} remaining</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}