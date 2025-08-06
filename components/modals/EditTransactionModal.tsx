import React from 'react';
import { Transaction } from '../../types';
import TransactionForm from '../forms/TransactionForm';
import { useData } from '../../context/DataContext';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ isOpen, onClose, transaction }) => {
    const { updateTransaction } = useData();

    if (!isOpen || !transaction) return null;

    const handleSubmit = async (formData: Omit<Transaction, 'id'>) => {
        await updateTransaction({ ...formData, id: transaction.id });
        onClose(); // Close modal on successful submission
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl relative transform transition-all"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 id="modal-title" className="text-xl font-bold text-gray-800 dark:text-white">Edit Transaction</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <TransactionForm
                    initialData={transaction}
                    onSubmit={handleSubmit}
                    submitButtonText="Save Changes"
                />
            </div>
        </div>
    );
};

export default EditTransactionModal;