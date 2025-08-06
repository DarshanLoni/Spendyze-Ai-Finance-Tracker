
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType } from '../../types';

interface BalanceOverviewChartProps {
  transactions: Transaction[];
}

const BalanceOverviewChart: React.FC<BalanceOverviewChartProps> = ({ transactions }) => {
  const data = useMemo(() => {
    const monthlyData: { [key: string]: { name: string; income: number; expenses: number } } = {};
    
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { name: month, income: 0, expenses: 0 };
      }
      if (t.type === TransactionType.INCOME) {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
    });

    return Object.values(monthlyData).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
        <XAxis dataKey="name" tick={{ fill: 'rgb(107 114 128)' }} />
        <YAxis tick={{ fill: 'rgb(107 114 128)' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            borderColor: 'rgba(55, 65, 81, 1)',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend />
        <Bar dataKey="income" fill="#10b981" name="Income" />
        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BalanceOverviewChart;
