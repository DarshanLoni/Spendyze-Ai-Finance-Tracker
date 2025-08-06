import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BanknotesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !password) {
            // Toast will be shown from context, but we can stop loading here.
            setIsLoading(false);
            return;
        }

        const success = await login(email, password);

        if (success) {
            navigate('/app/dashboard');
        }
        
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
             <Link to="/" className="flex items-center space-x-2 mb-8">
                <BanknotesIcon className="h-10 w-10 text-primary-500" />
                <span className="text-3xl font-bold text-gray-800 dark:text-white">Spendyze</span>
            </Link>
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Welcome Back!</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed">
                             {isLoading ? <ArrowPathIcon className="h-6 w-6 animate-spin" /> : 'Log In'}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign up
                    </Link>
                </p>
            </Card>
            <div className="mt-8">
                <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;