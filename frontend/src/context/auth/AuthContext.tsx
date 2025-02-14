import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
  phone?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      if (email === 'demo@example.com' && password === 'demo123') {
        const user = {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'admin'
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // Check localStorage for registered users
        const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const foundUser = users.find((u: any) => 
          u.email === email && u.password === password
        );
        
        if (foundUser) {
          const userData = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: 'user',
            company: foundUser.company,
            phone: foundUser.phone
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Simulate API call
      // In real application, this would be an API request
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      
      // Check if email already exists
      if (users.some((u: any) => u.email === data.email)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: `user_${users.length + 1}`,
        ...data,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (simulating database)
      users.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(users));

      // Log user in
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: 'user',
        company: newUser.company,
        phone: newUser.phone
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
