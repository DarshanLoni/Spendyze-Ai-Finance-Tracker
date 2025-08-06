
import React from 'react';
import Card from '../Card';

interface BudgetUsageBarProps {
  totalIncome: number;
  totalExpenses: number;
}

const BudgetUsageBar: React.FC<BudgetUsageBarProps> = ({ totalIncome, totalExpenses }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  if (totalIncome === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Budget Usage</h3>
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          <p>Add some income to track your budget usage.</p>
        </div>
      </Card>
    );
  }

  const usagePercentage = (totalExpenses / totalIncome) * 100;
  const displayPercentage = Math.min(usagePercentage, 100);
  const overspent = totalExpenses > totalIncome;

  let barColorClass = 'bg-green-500';
  if (usagePercentage > 80) barColorClass = 'bg-yellow-500';
  if (usagePercentage > 95) barColorClass = 'bg-red-500';
  if (overspent) barColorClass = 'bg-red-600';


  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Budget Usage</h3>
        <span className={`font-bold text-lg ${overspent ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
          {usagePercentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden" role="progressbar" aria-valuenow={usagePercentage} aria-valuemin={0} aria-valuemax={100}>
        <div 
          className={`h-4 rounded-full transition-all duration-500 ${barColorClass}`}
          style={{ width: `${displayPercentage}%` }}
        ></div>
      </div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {overspent ? (
          <p className="text-red-500 font-semibold text-center">
            Warning: You have overspent by {formatCurrency(totalExpenses - totalIncome)}!
          </p>
        ) : (
          <p className="text-center">
            You've spent {formatCurrency(totalExpenses)} of your {formatCurrency(totalIncome)} income.
          </p>
        )}
      </div>
    </Card>
  );
};

export default BudgetUsageBar;