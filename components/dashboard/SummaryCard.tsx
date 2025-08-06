import React from 'react';
import Card from '../Card';
import { ArrowUpCircleIcon, ArrowDownCircleIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const icons = {
    income: <ArrowUpCircleIcon className="h-8 w-8 text-green-500" />,
    expense: <ArrowDownCircleIcon className="h-8 w-8 text-red-500" />,
    balance: <BanknotesIcon className="h-8 w-8 text-blue-500" />,
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(amount)}</p>
        </div>
        {icons[type]}
      </div>
    </Card>
  );
};

export default SummaryCard;