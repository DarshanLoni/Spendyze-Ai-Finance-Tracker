import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Category } from '../../types';

interface TransactionFormProps {
    initialData?: Partial<Transaction> | null;
    onSubmit: (formData: Omit<Transaction, 'id'>) => Promise<void> | void;
    submitButtonText?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSubmit, submitButtonText = "Save Transaction" }) => {
    const [formData, setFormData] = useState({
        type: TransactionType.EXPENSE,
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: Category.FOOD,
        description: '',
    });
     const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type || TransactionType.EXPENSE,
                title: initialData.title || '',
                amount: initialData.amount?.toString() || '',
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                category: initialData.category || Category.OTHER,
                description: initialData.description || '',
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const newTransaction = {
            ...formData,
            amount: parseFloat(formData.amount),
            date: new Date(formData.date).toISOString(),
        };
        await onSubmit(newTransaction);
        setIsSubmitting(false);
    };
    
    const categories = formData.type === TransactionType.INCOME ? [Category.SALARY, Category.FREELANCE, Category.OTHER] : [Category.FOOD, Category.TRANSPORT, Category.HOUSING, Category.ENTERTAINMENT, Category.HEALTH, Category.OTHER];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        <option value={TransactionType.EXPENSE}>Expense</option>
                        <option value={TransactionType.INCOME}>Income</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                 <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                    <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} required step="0.01" className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                    <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={1} className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                </div>
            </div>
            <div className="flex justify-end">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : submitButtonText}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;