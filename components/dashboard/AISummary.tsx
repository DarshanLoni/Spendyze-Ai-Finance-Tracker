import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, LightBulbIcon } from '@heroicons/react/24/solid';

const API_URL = 'https://spendyze-fin-track.onrender.com/api/ai/summary';

interface AISummaryData {
    overview: string;
    positive: string;
    suggestion: string;
}

const AISummary: React.FC = () => {
    const [summary, setSummary] = useState<AISummaryData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { userToken } = useAuth();

    const generateSummary = useCallback(async () => {
        if (!userToken) {
            toast.error("You must be logged in to use this feature.");
            return;
        }

        setIsLoading(true);
        setSummary(null);

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            if (!response.ok) {
                let errorMessage = 'Failed to generate summary.';
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
            setSummary(data.summary);

        } catch (err) {
            console.error(err);
            const message = (err as Error).message;
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]);

    return (
        <div className="bg-primary-500/10 dark:bg-primary-900/20 p-4 rounded-xl flex flex-col justify-between h-full">
            <div>
                <h4 className="font-semibold text-primary-800 dark:text-primary-200 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    AI Financial Summary
                </h4>
                {isLoading && (
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse mb-3"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                    </div>
                )}
                {summary && (
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-3">
                        <p>{summary.overview}</p>
                        <div className="flex items-start gap-2 text-green-800 dark:text-green-300 bg-green-500/10 p-2 rounded-md">
                            <CheckCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <p><span className="font-semibold">Positive:</span> {summary.positive}</p>
                        </div>
                        <div className="flex items-start gap-2 text-yellow-800 dark:text-yellow-200 bg-yellow-500/10 p-2 rounded-md">
                            <LightBulbIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <p><span className="font-semibold">Suggestion:</span> {summary.suggestion}</p>
                        </div>
                    </div>
                )}
            </div>
            <button
                onClick={generateSummary}
                disabled={isLoading || !userToken}
                className="mt-4 w-full bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition duration-200 disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <SparklesIcon className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Generating...' : summary ? 'Regenerate' : 'Generate'}
            </button>
        </div>
    );
};

export default AISummary;
