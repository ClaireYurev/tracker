'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useTracker } from '@/store/useTracker';
import { LoginForm } from './login-form';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, user } = useAuth();
  const { setCurrentUser } = useTracker();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentUser(user.id);
    }
    setIsLoading(false);
  }, [isAuthenticated, user, setCurrentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
