import { useState } from "react";
import { BudgetDashboard } from "@/components/BudgetDashboard";
import { BudgetForm } from "@/components/BudgetForm";
import { ExpenseForm } from "@/components/ExpenseForm";
import { useBudgetData } from "@/hooks/useBudgetData";

type View = 'dashboard' | 'create-budget' | 'add-expense';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { budgetData, updateCategories, addExpense, updateBudgetInfo, hasAnyData } = useBudgetData();

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'create-budget':
        return (
          <BudgetForm 
            onBack={() => setCurrentView('dashboard')} 
            onSave={(categories, monthlyIncome, savingsGoal) => {
              updateCategories(categories);
              updateBudgetInfo(monthlyIncome, savingsGoal);
            }}
            initialData={{
              categories: budgetData.categories,
              monthlyIncome: budgetData.monthlyIncome,
              savingsGoal: budgetData.savingsGoal,
            }}
          />
        );
      case 'add-expense':
        return (
          <ExpenseForm 
            onBack={() => setCurrentView('dashboard')} 
            onAddExpense={addExpense}
            categories={budgetData.categories}
          />
        );
      default:
        return (
          <BudgetDashboard
            onCreateBudget={() => setCurrentView('create-budget')}
            onAddExpense={() => setCurrentView('add-expense')}
            budgetData={budgetData}
            hasAnyData={hasAnyData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {renderView()}
      </div>
    </div>
  );
};

export default Index;
