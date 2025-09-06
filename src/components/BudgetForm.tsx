import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Trash2,
  DollarSign,
  Target,
  Calendar,
  PiggyBank
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
}

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'biweekly';
}

interface BudgetFormProps {
  onBack: () => void;
}

export function BudgetForm({ onBack }: BudgetFormProps) {
  const { toast } = useToast();
  const [budgetName, setBudgetName] = useState("");
  const [budgetPeriod, setBudgetPeriod] = useState("monthly");
  const [savingsGoal, setSavingsGoal] = useState(0);
  
  const [incomeSource, setIncomeSource] = useState({ name: "", amount: "", frequency: "monthly" });
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  
  const [categoryName, setCategoryName] = useState("");
  const [categoryAmount, setCategoryAmount] = useState("");
  const [categoryType, setCategoryType] = useState<'fixed' | 'variable'>('variable');
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Housing', amount: 1200, type: 'fixed' },
    { id: '2', name: 'Food', amount: 400, type: 'variable' },
    { id: '3', name: 'Transportation', amount: 300, type: 'variable' },
  ]);

  const totalIncome = incomeSources.reduce((sum, income) => {
    const multiplier = income.frequency === 'weekly' ? 4.33 : income.frequency === 'biweekly' ? 2.17 : 1;
    return sum + (income.amount * multiplier);
  }, 0);

  const totalExpenses = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const availableForSavings = totalIncome - totalExpenses - savingsGoal;

  const addIncomeSource = () => {
    if (incomeSource.name && incomeSource.amount) {
      const newSource: IncomeSource = {
        id: Date.now().toString(),
        name: incomeSource.name,
        amount: parseFloat(incomeSource.amount),
        frequency: incomeSource.frequency as 'monthly' | 'weekly' | 'biweekly'
      };
      setIncomeSources([...incomeSources, newSource]);
      setIncomeSource({ name: "", amount: "", frequency: "monthly" });
    }
  };

  const removeIncomeSource = (id: string) => {
    setIncomeSources(incomeSources.filter(source => source.id !== id));
  };

  const addCategory = () => {
    if (categoryName && categoryAmount) {
      const newCategory: BudgetCategory = {
        id: Date.now().toString(),
        name: categoryName,
        amount: parseFloat(categoryAmount),
        type: categoryType
      };
      setCategories([...categories, newCategory]);
      setCategoryName("");
      setCategoryAmount("");
    }
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleSubmit = () => {
    if (!budgetName) {
      toast({
        title: "Missing Information",
        description: "Please enter a budget name.",
        variant: "destructive"
      });
      return;
    }

    if (incomeSources.length === 0) {
      toast({
        title: "Missing Information", 
        description: "Please add at least one income source.",
        variant: "destructive"
      });
      return;
    }

    if (categories.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one expense category.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Budget Created Successfully!",
      description: `Your ${budgetPeriod} budget "${budgetName}" has been created.`,
      variant: "default"
    });

    // Here you would normally save to a database
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Budget</h1>
          <p className="text-muted-foreground">Set up your income, expenses, and savings goals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Budget Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget-name">Budget Name</Label>
                  <Input
                    id="budget-name"
                    placeholder="e.g., Monthly Budget 2024"
                    value={budgetName}
                    onChange={(e) => setBudgetName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget-period">Budget Period</Label>
                  <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="savings-goal">Savings Goal</Label>
                <Input
                  id="savings-goal"
                  type="number"
                  placeholder="0"
                  value={savingsGoal || ""}
                  onChange={(e) => setSavingsGoal(parseFloat(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Income Sources */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                Income Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income-name">Source Name</Label>
                  <Input
                    id="income-name"
                    placeholder="e.g., Salary, Freelance"
                    value={incomeSource.name}
                    onChange={(e) => setIncomeSource({ ...incomeSource, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income-amount">Amount</Label>
                  <Input
                    id="income-amount"
                    type="number"
                    placeholder="0"
                    value={incomeSource.amount}
                    onChange={(e) => setIncomeSource({ ...incomeSource, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income-frequency">Frequency</Label>
                  <Select 
                    value={incomeSource.frequency} 
                    onValueChange={(value) => setIncomeSource({ ...incomeSource, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addIncomeSource} className="w-full">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>

              {incomeSources.length > 0 && (
                <div className="space-y-2">
                  <Separator />
                  {incomeSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{source.name}</span>
                        <span className="text-muted-foreground ml-2">
                          ${source.amount.toLocaleString()} {source.frequency}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeIncomeSource(source.id)}
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-warning" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    placeholder="e.g., Groceries, Gas"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-amount">Budget Amount</Label>
                  <Input
                    id="category-amount"
                    type="number"
                    placeholder="0"
                    value={categoryAmount}
                    onChange={(e) => setCategoryAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-type">Type</Label>
                  <Select 
                    value={categoryType} 
                    onValueChange={(value) => setCategoryType(value as 'fixed' | 'variable')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="variable">Variable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addCategory} className="w-full">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>

              {categories.length > 0 && (
                <div className="space-y-2">
                  <Separator />
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant={category.type === 'fixed' ? 'secondary' : 'outline'}>
                          {category.type}
                        </Badge>
                        <span className="text-muted-foreground">
                          ${category.amount.toLocaleString()}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div className="space-y-6">
          <Card className="shadow-soft border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-success" />
                Budget Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Income</span>
                  <span className="font-semibold text-success">
                    ${totalIncome.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Expenses</span>
                  <span className="font-semibold text-warning">
                    ${totalExpenses.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Savings Goal</span>
                  <span className="font-semibold text-primary">
                    ${savingsGoal.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Remaining</span>
                  <span className={`font-bold ${availableForSavings >= 0 ? 'text-success' : 'text-danger'}`}>
                    ${availableForSavings.toLocaleString()}
                  </span>
                </div>
              </div>

              {availableForSavings < 0 && (
                <div className="p-3 bg-danger-light border border-danger/30 rounded-lg">
                  <p className="text-sm text-danger">
                    Your expenses and savings goal exceed your income by ${Math.abs(availableForSavings).toLocaleString()}. 
                    Consider adjusting your budget.
                  </p>
                </div>
              )}

              <Button 
                variant="hero" 
                className="w-full" 
                onClick={handleSubmit}
                disabled={!budgetName || incomeSources.length === 0 || categories.length === 0}
              >
                Create Budget
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}