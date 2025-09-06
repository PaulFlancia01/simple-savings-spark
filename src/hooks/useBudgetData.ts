import { useState, useEffect } from 'react';
import { BudgetData, BudgetCategory, Expense } from '@/types/budget';

const STORAGE_KEY = 'budget-app-data';

const defaultCategories: BudgetCategory[] = [
  { id: '1', category: "Housing", budgeted: 0, spent: 0, color: "hsl(213, 94%, 68%)" },
  { id: '2', category: "Food", budgeted: 0, spent: 0, color: "hsl(158, 64%, 52%)" },
  { id: '3', category: "Transportation", budgeted: 0, spent: 0, color: "hsl(38, 92%, 58%)" },
  { id: '4', category: "Entertainment", budgeted: 0, spent: 0, color: "hsl(0, 84%, 60%)" },
  { id: '5', category: "Utilities", budgeted: 0, spent: 0, color: "hsl(213, 94%, 58%)" },
];

const initialData: BudgetData = {
  categories: defaultCategories,
  expenses: [],
  monthlyIncome: 0,
  savingsGoal: 0,
};

export function useBudgetData() {
  const [budgetData, setBudgetData] = useState<BudgetData>(initialData);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setBudgetData(parsedData);
      } catch (error) {
        console.error('Error loading budget data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetData));
  }, [budgetData]);

  const updateCategories = (categories: BudgetCategory[]) => {
    setBudgetData(prev => ({ ...prev, categories }));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };

    setBudgetData(prev => {
      const updatedCategories = prev.categories.map(category => 
        category.id === newExpense.categoryId
          ? { ...category, spent: category.spent + newExpense.amount }
          : category
      );

      return {
        ...prev,
        categories: updatedCategories,
        expenses: [...prev.expenses, newExpense],
      };
    });
  };

  const updateBudgetInfo = (monthlyIncome: number, savingsGoal: number) => {
    setBudgetData(prev => ({ ...prev, monthlyIncome, savingsGoal }));
  };

  const hasAnyData = budgetData.categories.some(cat => cat.budgeted > 0) || 
                    budgetData.monthlyIncome > 0 || 
                    budgetData.expenses.length > 0;

  return {
    budgetData,
    updateCategories,
    addExpense,
    updateBudgetInfo,
    hasAnyData,
  };
}