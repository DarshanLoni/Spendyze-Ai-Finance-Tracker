export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export enum Category {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  HOUSING = 'Housing',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string; // ISO string format
  category: Category;
  description?: string;
}

export interface ChartData {
  name: string;
  [key: string]: string | number;
}
