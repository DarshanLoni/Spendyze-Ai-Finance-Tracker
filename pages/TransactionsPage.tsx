import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { Transaction, TransactionType } from '../types';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import EditTransactionModal from '../components/modals/EditTransactionModal';

const TransactionsPage: React.FC = () => {
    const { transactions, deleteTransaction } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const handleEditClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedTransaction(null);
    };

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => {
                const typeMatch = filterType === 'all' ||
                    (filterType === 'income' && t.type === TransactionType.INCOME) ||
                    (filterType === 'expense' && t.type === TransactionType.EXPENSE);
                
                const searchMatch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
                
                return typeMatch && searchMatch;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, searchTerm, filterType]);

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

    return (
        <>
            <Card>
                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select 
                        value={filterType}
                        onChange={e => setFilterType(e.target.value as any)}
                        className="w-full md:w-auto p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTransactions.map(t => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{t.title}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{t.type}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{t.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-semibold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                                        {formatCurrency(t.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button onClick={() => handleEditClick(t)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 p-1">
                                            <PencilSquareIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => deleteTransaction(t.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1 ml-2">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredTransactions.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No transactions found.
                    </div>
                )}
            </Card>

            <EditTransactionModal
                isOpen={isEditModalOpen}
                onClose={handleCloseModal}
                transaction={selectedTransaction}
            />
        </>
    );
};

export default TransactionsPage;