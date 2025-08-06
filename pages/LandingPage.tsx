import React from 'react';
import { Link } from 'react-router-dom';
import { 
    BanknotesIcon, 
    SunIcon, 
    MoonIcon,
    ArrowRightIcon,
    UserPlusIcon,
    DocumentPlusIcon,
    ChartBarSquareIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated } = useAuth();

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <Link to="/" className="flex items-center space-x-2">
                    <BanknotesIcon className="h-8 w-8 text-primary-500" />
                    <span className="text-2xl font-bold">Spendyze</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                    </button>
                    {isAuthenticated ? (
                        <Link to="/app/dashboard" className="bg-primary-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-600 transition-colors">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-primary-500 font-semibold">Login</Link>
                            <Link to="/signup" className="bg-primary-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-600 transition-colors">Sign Up</Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                    Master Your Money with the Power of <span className="text-primary-500">AI</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Spendyze is the intelligent finance tracker that simplifies your budgeting and expenses. Stop guessing, start knowing.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                     {isAuthenticated ? (
                        <Link to="/app/dashboard" className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary-600 transition-transform transform hover:scale-105">
                            Manage Your Finances <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                    ) : (
                        <Link to="/signup" className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary-600 transition-transform transform hover:scale-105">
                            Get Started for Free <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                    )}
                </div>
            </main>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-gray-50 dark:bg-gray-800/50 py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold">Get Started in 3 Easy Steps</h2>
                         <p className="text-gray-600 dark:text-gray-400 mt-2">Effortless financial tracking is just minutes away.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="flex items-center justify-center h-16 w-16 mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
                               <UserPlusIcon className="h-8 w-8 text-primary-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Create Your Account</h3>
                            <p className="text-gray-600 dark:text-gray-400">Sign up in seconds. It's free, secure, and simple.</p>
                        </div>
                         <div className="p-6">
                            <div className="flex items-center justify-center h-16 w-16 mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
                               <DocumentPlusIcon className="h-8 w-8 text-primary-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. Add Transactions</h3>
                            <p className="text-gray-600 dark:text-gray-400">Manually add expenses or just snap a picture of your bills.</p>
                        </div>
                         <div className="p-6">
                            <div className="flex items-center justify-center h-16 w-16 mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
                               <ChartBarSquareIcon className="h-8 w-8 text-primary-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">3. Gain AI Insights</h3>
                            <p className="text-gray-600 dark:text-gray-400">Let our AI analyze your spending and provide you with smart summaries.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Features in Detail Section */}
            <section id="features" className="py-20">
                 <div className="container mx-auto px-6 space-y-24">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold">Unlock the Power of AI for Your Finances</h2>
                         <p className="text-gray-600 dark:text-gray-400 mt-2">Go beyond simple tracking with our intelligent features.</p>
                    </div>

                    {/* Feature 1: AI Bill Scanner */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <span className="text-primary-500 font-semibold">Effortless Entry</span>
                            <h3 className="text-2xl font-bold mt-2">Ditch the Data Entry with AI Bill Scanner</h3>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">
                                Why type when you can snap? Just take a picture of any receipt or bill. Spendyze's AI reads the vendor, date, and amount, then categorizes it for you automatically. It's the fastest way to log your expenses.
                            </p>
                        </div>
                         <div className="order-1 md:order-2">
                            <img src="https://images.unsplash.com/photo-1626207887298-da2fc1f50e82?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="AI Bill Scanner in action" className="rounded-lg shadow-xl aspect-video object-cover" />
                        </div>
                    </div>

                    {/* Feature 2: Financial Chatbot */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                         <div className="order-1">
                             <img src="https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?q=80&w=1996&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Chatbot interface" className="rounded-lg shadow-xl aspect-video object-cover" />
                        </div>
                        <div className="order-2">
                            <span className="text-primary-500 font-semibold">Instant Answers</span>
                            <h3 className="text-2xl font-bold mt-2">Chat with Your Finances</h3>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">
                                Have a question? Just ask Fin, your personal finance chatbot. Get immediate answers to questions like "How much did I spend on groceries last month?" or "What was my biggest expense in June?". It's like having a financial analyst in your pocket.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3: Smart Summaries */}
                     <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <span className="text-primary-500 font-semibold">Clear Insights</span>
                            <h3 className="text-2xl font-bold mt-2">Get AI-Powered Summaries</h3>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">
                                Stop scrolling through endless lists of transactions. Our AI provides clear, concise summaries of your financial activity, highlighting important trends, identifying potential savings, and giving you an actionable overview of your financial health.
                            </p>
                        </div>
                         <div className="order-1 md:order-2">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop" alt="Dashboard with charts and summaries" className="rounded-lg shadow-xl aspect-video object-cover" />
                        </div>
                    </div>
                 </div>
            </section>
            
            {/* Final CTA Section */}
            <section className="bg-primary-500 text-white">
                <div className="container mx-auto px-6 py-20 text-center">
                    <h2 className="text-3xl font-bold">Ready to Transform Your Financial Habits?</h2>
                    <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
                        Join thousands of users who are building a better financial future with Spendyze.
                    </p>
                     <div className="mt-8">
                        {isAuthenticated ? (
                            <Link to="/app/dashboard" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                                Go to Your Dashboard
                            </Link>
                        ) : (
                            <Link to="/signup" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                                Sign Up Now - It's Free!
                            </Link>
                        )}
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                <p>&copy; {new Date().getFullYear()} Spendyze. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
