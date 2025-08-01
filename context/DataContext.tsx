import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Transaction } from '../types';
import { useAuth } from './AuthContext';

const API_URL = 'https://spendyze-fin-track.onrender.com/api/transactions';

// Helper to get auth headers
const getAuthHeader = (token: string | null) => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

interface DataContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<boolean>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userToken, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (token) => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch(API_URL, {
            headers: getAuthHeader(token),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch transactions.');
        }
        const data = await response.json();
        setTransactions(data);
    } catch (err) {
        const message = (err as Error).message || "An error occurred while fetching data.";
        setError(message);
        toast.error(message);
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (isAuthenticated && userToken) {
      fetchTransactions(userToken);
    } else {
      setTransactions([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, userToken, fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<boolean> => {
    if (!userToken) {
        toast.error("You must be logged in to add a transaction.");
        return false;
    }
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                ...getAuthHeader(userToken),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });
        if (!response.ok) {
            throw new Error('Failed to add transaction.');
        }
        const newTransaction = await response.json();
        setTransactions(prev => [newTransaction, ...prev]);
        toast.success('Transaction added successfully!');

        // Trigger backend to check for budget alerts
        await fetch(`${API_URL}/check-alerts`, {
          method: 'POST',
          headers: getAuthHeader(userToken)
        });

        return true;
    } catch (err) {
        console.error(err);
        const message = (err as Error).message || "Error adding transaction.";
        toast.error(message);
        return false;
    }
  };
  
  const updateTransaction = async (transaction: Transaction) => {
    if (!userToken) return;

    // Create a new object with only the fields that should be updated.
    const updateData = {
        type: transaction.type,
        title: transaction.title,
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        description: transaction.description,
    };

    try {
        const response = await fetch(`${API_URL}/${transaction.id}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(userToken),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to update transaction.';
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error("Could not parse JSON error response", e);
                }
            }
            throw new Error(errorMessage);
        }
        
        const updatedTransaction = await response.json();
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
        toast.success('Transaction updated successfully!');
    } catch (err) {
        console.error(err);
        const message = (err as Error).message || "Error updating transaction.";
        toast.error(message);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!userToken) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader(userToken),
        });
         if (!response.ok) {
            throw new Error('Failed to delete transaction.');
        }
        setTransactions(prev => prev.filter(t => t.id !== id));
        toast.success('Transaction deleted successfully!');
    } catch (err) {
        console.error(err);
        const message = (err as Error).message || "Error deleting transaction.";
        toast.error(message);
    }
  };

  return (
    <DataContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
