export interface BudgetCategory {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
}

export interface BudgetData {
  categories: BudgetCategory[];
  expenses: Expense[];
  monthlyIncome: number;
  savingsGoal: number;
}