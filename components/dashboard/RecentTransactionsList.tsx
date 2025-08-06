import React from 'react';
import { Transaction, TransactionType } from '../../types';
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/solid';

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({ transactions }) => {
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  
  return (
    <div className="flow-root">
      <ul role="list" className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="flex items-center py-4 space-x-4">
            <div className="flex-shrink-0">
              {transaction.type === TransactionType.INCOME ? (
                <ArrowUpCircleIcon className="h-8 w-8 text-green-500" />
              ) : (
                <ArrowDownCircleIcon className="h-8 w-8 text-red-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {transaction.title}
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                {transaction.category} &middot; {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <div className={`text-base font-semibold ${transaction.type === TransactionType.INCOME ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {transaction.type === TransactionType.INCOME ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactionsList;