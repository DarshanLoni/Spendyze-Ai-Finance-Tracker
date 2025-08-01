import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

const API_URL = 'https://spendyze-fin-track.onrender.com/api/auth';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userToken: string | null;
  user: User | null;
  login: (email, password) => Promise<boolean>;
  signup: (name, email, password) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        setUserToken(token);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
        console.error("Could not access local storage", e);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        let errorMessage = "Login failed.";
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Fallback to default message
            }
        }
        toast.error(errorMessage);
        return false;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUserToken(data.token);
      setUser(data.user);
      return true;

    } catch (error) {
      toast.error("Could not connect to the server.");
      return false;
    }
  };
  
  const signup = async (name, email, password) => {
     try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        let errorMessage = "Signup failed.";
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // fallback to default message
            }
        }
        toast.error(errorMessage);
        return false;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUserToken(data.token);
      setUser(data.user);
      return true;

    } catch (error) {
      toast.error("Could not connect to the server.");
      return false;
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: !!userToken, 
        isLoading, 
        userToken, 
        user,
        login, 
        signup,
        logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
