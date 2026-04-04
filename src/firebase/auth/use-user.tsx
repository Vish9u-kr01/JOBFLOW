'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Defensive check: only subscribe if auth is properly initialized and has an app
    if (!auth || !auth.app) {
      setIsLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setIsLoading(false);
      }, (error) => {
        console.error("Auth state change error:", error);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Failed to subscribe to auth state changes:", err);
      setIsLoading(false);
    }
  }, [auth]);

  return { user, isLoading };
}
