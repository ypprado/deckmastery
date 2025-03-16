
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define types for the auth context
interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUserRole: (role: 'user' | 'admin') => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for an existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          const userData = data.session.user;
          // For demo purposes, set a mock user with admin role
          // In a real app, you would fetch the role from the database
          setUser({
            id: userData.id,
            email: userData.email || '',
            name: userData.user_metadata?.name,
            avatarUrl: userData.user_metadata?.avatar_url,
            // Set as admin if email is admin@example.com, otherwise user
            role: userData.email === 'admin@example.com' ? 'admin' : 'user',
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && event === 'SIGNED_IN') {
          const userData = session.user;
          setUser({
            id: userData.id,
            email: userData.email || '',
            name: userData.user_metadata?.name,
            avatarUrl: userData.user_metadata?.avatar_url,
            // Set as admin if email is admin@example.com, otherwise user
            role: userData.email === 'admin@example.com' ? 'admin' : 'user',
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Clean up the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  // Set user role function (for demo purposes)
  const setUserRole = (role: 'user' | 'admin') => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    setUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
