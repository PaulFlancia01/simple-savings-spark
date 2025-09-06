import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Plus, 
  Calendar as CalendarIcon,
  Receipt,
  DollarSign,
  Tag,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: string;
}

interface ExpenseFormProps {
  onBack: () => void;
}

const categories = [
  "Housing", "Food", "Transportation", "Entertainment", "Utilities", 
  "Healthcare", "Shopping", "Travel", "Education", "Other"
];

const paymentMethods = [
  "Cash", "Credit Card", "Debit Card", "Bank Transfer", "Check", "Digital Wallet"
];

export function ExpenseForm({ onBack }: ExpenseFormProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([
    {
      id: '1',
      amount: 45.50,
      category: 'Food',
      description: 'Grocery shopping',
      date: new Date(),
      paymentMethod: 'Credit Card'
    },
    {
      id: '2',
      amount: 12.99,
      category: 'Entertainment',
      description: 'Netflix subscription',
      date: new Date(Date.now() - 86400000),
      paymentMethod: 'Credit Card'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description || !date || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      description,
      date,
      paymentMethod
    };

    setRecentExpenses([newExpense, ...recentExpenses]);
    
    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date());
    setPaymentMethod("");

    toast({
      title: "Expense Added!",
      description: `$${parseFloat(amount).toFixed(2)} expense recorded successfully.`,
      variant: "default"
    });
  };

  const quickAmounts = [5, 10, 20, 50, 100];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Expense</h1>
          <p className="text-muted-foreground">Record your spending to track your budget</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Expense Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Section */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-base font-medium">
                    Amount *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 text-lg"
                      required
                    />
                  </div>
                  
                  {/* Quick Amount Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Quick amounts:</span>
                    {quickAmounts.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(quickAmount.toString())}
                      >
                        ${quickAmount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category and Payment Method */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method *</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="What was this expense for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full"
                  disabled={!amount || !category || !description || !date || !paymentMethod}
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses Sidebar */}
        <div>
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentExpenses.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No recent expenses
                </p>
              ) : (
                recentExpenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">${expense.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {expense.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {expense.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{format(expense.date, "MMM dd")}</span>
                      <span>{expense.paymentMethod}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-soft mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-success" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expenses Today</span>
                  <span className="font-semibold">
                    ${recentExpenses
                      .filter(exp => 
                        exp.date.toDateString() === new Date().toDateString()
                      )
                      .reduce((sum, exp) => sum + exp.amount, 0)
                      .toFixed(2)
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transactions</span>
                  <span className="font-semibold">
                    {recentExpenses.filter(exp => 
                      exp.date.toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}