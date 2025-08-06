
import { Transaction, TransactionType, Category } from './types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: TransactionType.INCOME,
    title: 'Monthly Salary',
    amount: 5000,
    date: new Date(new Date().setDate(1)).toISOString(),
    category: Category.SALARY,
    description: 'October salary deposit'
  },
  {
    id: '2',
    type: TransactionType.EXPENSE,
    title: 'Groceries',
    amount: 150.75,
    date: new Date(new Date().setDate(2)).toISOString(),
    category: Category.FOOD,
    description: 'Weekly grocery shopping'
  },
  {
    id: '3',
    type: TransactionType.EXPENSE,
    title: 'Rent Payment',
    amount: 1200,
    date: new Date(new Date().setDate(3)).toISOString(),
    category: Category.HOUSING
  },
  {
    id: '4',
    type: TransactionType.EXPENSE,
    title: 'Subway Pass',
    amount: 127.00,
    date: new Date(new Date().setDate(4)).toISOString(),
    category: Category.TRANSPORT
  },
  {
    id: '5',
    type: TransactionType.INCOME,
    title: 'Freelance Project',
    amount: 750,
    date: new Date(new Date().setDate(5)).toISOString(),
    category: Category.FREELANCE,
    description: 'Web design for client'
  },
  {
    id: '6',
    type: TransactionType.EXPENSE,
    title: 'Movie Tickets',
    amount: 45.50,
    date: new Date(new Date().setDate(7)).toISOString(),
    category: Category.ENTERTAINMENT
  },
  {
    id: '7',
    type: TransactionType.EXPENSE,
    title: 'Dinner with Friends',
    amount: 88.20,
    date: new Date(new Date().setDate(10)).toISOString(),
    category: Category.FOOD
  },
  {
    id: '8',
    type: TransactionType.EXPENSE,
    title: 'Pharmacy',
    amount: 32.10,
    date: new Date(new Date().setDate(12)).toISOString(),
    category: Category.HEALTH
  },
  {
    id: '9',
    type: TransactionType.EXPENSE,
    title: 'Concert',
    amount: 250.00,
    date: new Date(new Date().setDate(15)).toISOString(),
    category: Category.ENTERTAINMENT,
  },
];
