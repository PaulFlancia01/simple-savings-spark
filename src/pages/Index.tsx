import { useState } from "react";
import { BudgetDashboard } from "@/components/BudgetDashboard";
import { BudgetForm } from "@/components/BudgetForm";
import { ExpenseForm } from "@/components/ExpenseForm";

type View = 'dashboard' | 'create-budget' | 'add-expense';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'create-budget':
        return <BudgetForm onBack={() => setCurrentView('dashboard')} />;
      case 'add-expense':
        return <ExpenseForm onBack={() => setCurrentView('dashboard')} />;
      default:
        return (
          <BudgetDashboard
            onCreateBudget={() => setCurrentView('create-budget')}
            onAddExpense={() => setCurrentView('add-expense')}
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
