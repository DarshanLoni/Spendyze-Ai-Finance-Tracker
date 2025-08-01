import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { SparklesIcon } from '@heroicons/react/24/outline';

const API_URL = 'https://spendyze-fin-track.onrender.com/api/ai/summary';

const AISummary: React.FC = () => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { userToken } = useAuth();

    const generateSummary = useCallback(async () => {
        if (!userToken) {
            toast.error("You must be logged in to use this feature.");
            return;
        }

        setIsLoading(true);
        setSummary('');

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to generate summary.');
            }
            
            const data = await response.json();
            setSummary(data.summary);

        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]);
    
    return (
        <div className="bg-primary-500/10 dark:bg-primary-900/20 p-4 rounded-xl flex flex-col justify-between h-full">
            <div>
                <h4 className="font-semibold text-primary-800 dark:text-primary-200 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2"/>
                    AI Financial Summary
                </h4>
                {isLoading && <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Generating...</div>}
                {summary && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{summary}</p>}
            </div>
            <button
                onClick={generateSummary}
                disabled={isLoading || !userToken}
                className="mt-4 w-full bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition duration-200 disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <SparklesIcon className="w-4 h-4 mr-2"/>
                {summary ? 'Regenerate' : 'Generate'}
            </button>
        </div>
    );
};

export default AISummary;