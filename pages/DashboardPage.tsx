
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import { Transaction, TransactionType } from '../types';
import SummaryCard from '../components/dashboard/SummaryCard';
import BalanceOverviewChart from '../components/dashboard/BalanceOverviewChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import RecentTransactionsList from '../components/dashboard/RecentTransactionsList';
import AISummary from '../components/dashboard/AISummary';
import BudgetUsageBar from '../components/dashboard/BudgetUsageBar';

const DashboardPage: React.FC = () => {
  const { transactions, isLoading, error } = useData();

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === TransactionType.INCOME) {
          acc.totalIncome += t.amount;
        } else {
          acc.totalExpenses += t.amount;
        }
        acc.balance = acc.totalIncome - acc.totalExpenses;
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, balance: 0 }
    );
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center p-8 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            <h3 className="text-lg font-semibold">Failed to load data</h3>
            <p>{error}</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Income" amount={totalIncome} type="income" />
        <SummaryCard title="Total Expenses" amount={totalExpenses} type="expense" />
        <SummaryCard title="Current Balance" amount={balance} type="balance" />
        <AISummary />
      </div>

      <BudgetUsageBar totalIncome={totalIncome} totalExpenses={totalExpenses} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Income vs. Expenses</h3>
            <div className="h-80">
              <BalanceOverviewChart transactions={transactions} />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Expense Categories</h3>
            <div className="h-80">
              <CategoryPieChart transactions={transactions} />
            </div>
          </Card>
        </div>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Transactions</h3>
        {transactions.length > 0 ? (
            <RecentTransactionsList transactions={recentTransactions} />
        ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No transactions yet.</p>
                <p className="text-sm">Add your first transaction to get started!</p>
            </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;