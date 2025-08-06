import React, { useState } from 'react';
import Card from '../components/Card';
import TransactionForm from '../components/forms/TransactionForm';
import BillScanner from '../components/forms/BillScanner';
import { Transaction, TransactionType, Category } from '../types';
import { useData } from '../context/DataContext';

const AddPage: React.FC = () => {
    const { addTransaction } = useData();
    const [activeTab, setActiveTab] = useState<'manual' | 'scan'>('manual');
    const [scannedData, setScannedData] = useState<Partial<Transaction> | null>(null);

    // This state will be passed down to the form to allow this parent to reset it.
    const [formKey, setFormKey] = useState(Date.now());

    const handleScanSuccess = (data: Partial<Transaction>) => {
        setScannedData(data);
        setActiveTab('manual'); // Switch to manual form to confirm/edit
    };

    const handleAddSubmit = async (formData: Omit<Transaction, 'id'>) => {
        const success = await addTransaction(formData);
        
        if (success) {
            // Reset form state in parent and show success notification
            setScannedData(null);
            // Change the key of the form to force a re-render with initial state
            setFormKey(Date.now());
        }
    };

    const initialFormState = scannedData || {
        type: TransactionType.EXPENSE,
        title: '',
        amount: undefined,
        date: new Date().toISOString(),
        category: Category.FOOD,
        description: '',
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`${
                            activeTab === 'manual'
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Add Manually
                    </button>
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`${
                            activeTab === 'scan'
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Scan Bill with AI
                    </button>
                </nav>
            </div>
            
            <Card>
                {activeTab === 'manual' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                            {scannedData ? 'Confirm Scanned Transaction' : 'Add New Transaction'}
                        </h2>
                        <TransactionForm
                            key={formKey} // Use key to easily reset the form
                            initialData={initialFormState}
                            onSubmit={handleAddSubmit}
                        />
                    </div>
                )}

                {activeTab === 'scan' && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Scan Bill with AI</h2>
                        <BillScanner onScanSuccess={handleScanSuccess} />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AddPage;