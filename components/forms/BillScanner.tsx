import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Transaction } from '../../types';
import { PhotoIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const API_URL = 'https://spendyze-fin-track.onrender.com/api/ai/scan';

interface BillScannerProps {
    onScanSuccess: (data: Partial<Transaction>) => void;
}

const BillScanner: React.FC<BillScannerProps> = ({ onScanSuccess }) => {
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { userToken } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setImage(dataUrl);
                setImageBase64(dataUrl.split(',')[1]); // Store base64 part
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeBill = useCallback(async () => {
        if (!imageBase64 || !userToken) {
            toast.error('Please select an image and be logged in.');
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({ image: imageBase64 })
            });

            if (!response.ok) {
                let errorMessage = 'Failed to analyze bill.';
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
            toast.success("Bill analyzed successfully! Please review the details.");
            onScanSuccess(data.scannedData);

        } catch (err) {
            console.error('AI bill scan error:', err);
            const message = (err as Error).message;
            toast.error(message);
        } finally {
            setIsLoading(false);
        }

    }, [imageBase64, onScanSuccess, userToken]);

    return (
        <div className="text-center">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10">
                <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                        <label
                            htmlFor="bill-upload"
                            className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-primary-600 dark:text-primary-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800 hover:text-primary-500"
                        >
                            <span>Upload a file</span>
                            <input id="bill-upload" name="bill-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>

            {image && (
                <div className="mt-4">
                    <img src={image} alt="Bill preview" className="mx-auto max-h-60 rounded-md shadow-md" />
                </div>
            )}
            
            <button
                onClick={analyzeBill}
                disabled={!image || isLoading || !userToken}
                className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-3" />
                ) : (
                    <SparklesIcon className="h-5 w-5 mr-3" />
                )}
                {isLoading ? 'Analyzing...' : 'Analyze with AI'}
            </button>
        </div>
    );
};

export default BillScanner;
