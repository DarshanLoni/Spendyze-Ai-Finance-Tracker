
import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const API_URL = 'https://spendyze-fin-track.onrender.com/api/ai/recommend-budget';

// Helper for currency formatting
const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const BudgetBreakdownCard: React.FC<{ title: string; plan: any; color: string }> = ({ title, plan, color }) => (
    <Card className="flex-1">
        <h3 className={`text-lg font-bold ${color}`}>{title} ({plan.percentage}%)</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recommended: <span className="font-semibold">{formatCurrency(plan.recommendedAmount)}</span></p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Actual: <span className="font-semibold">{formatCurrency(plan.actualAmount)}</span></p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
            <div 
                className={`${plan.actualAmount > plan.recommendedAmount ? 'bg-red-500' : 'bg-green-500' } h-2.5 rounded-full`}
                style={{ width: `${Math.min((plan.actualAmount / plan.recommendedAmount) * 100, 100)}%`}}
            ></div>
        </div>
    </Card>
);

const BudgetPage: React.FC = () => {
    const [budgetData, setBudgetData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { userToken } = useAuth();

    const generateBudget = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setBudgetData(null);

        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${userToken}` },
            });

            if (!response.ok) {
                let errorMessage = `An error occurred: ${response.status} ${response.statusText}`;
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
            
            const data = await response.json();
            setBudgetData(data);
            toast.success("Your smart budget is ready!");

        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]);
    
    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Smart Budget</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Let AI analyze your spending and create a personalized budget for you.</p>
                    </div>
                    <button
                        onClick={generateBudget}
                        disabled={isLoading}
                        className="w-full md:w-auto bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition duration-200 disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <SparklesIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Analyzing...' : budgetData ? 'Regenerate Budget' : 'Generate My Budget'}
                    </button>
                </div>
            </Card>

            {isLoading && (
                <div className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Our AI is analyzing your finances...</p>
                </div>
            )}
            
            {error && (
                 <Card>
                    <div className="text-center p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                        <h3 className="font-semibold">Error Generating Budget</h3>
                        <p>{error}</p>
                    </div>
                 </Card>
            )}

            {!isLoading && !error && budgetData && (
                <div className="space-y-6 animate-fade-in">
                     <Card>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><InformationCircleIcon className="w-6 h-6 text-primary-500" /> AI Summary</h2>
                        <p className="text-gray-600 dark:text-gray-300 italic">{budgetData.summary}</p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Monthly Income</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">{formatCurrency(budgetData.analysis.averageMonthlyIncome)}</p>
                            </div>
                            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Monthly Expenses</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">{formatCurrency(budgetData.analysis.totalMonthlyExpense)}</p>
                            </div>
                        </div>
                    </Card>

                    <div className="flex flex-col md:flex-row gap-6">
                       <BudgetBreakdownCard title="Needs" plan={budgetData.plan.needs} color="text-blue-500" />
                       <BudgetBreakdownCard title="Wants" plan={budgetData.plan.wants} color="text-purple-500" />
                       <BudgetBreakdownCard title="Savings" plan={budgetData.plan.savings} color="text-green-500" />
                    </div>

                     <Card>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Category Recommendations</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actual Spend</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Recommended</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">AI Insight</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                                    {budgetData.categoryRecommendations.map((rec, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{rec.category}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-300">{formatCurrency(rec.actualAmount)}</td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-bold ${rec.actualAmount > rec.recommendedAmount ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(rec.recommendedAmount)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{rec.insight}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default BudgetPage;
