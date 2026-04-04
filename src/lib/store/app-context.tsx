
"use client"

import React, { createContext, useContext, useState, useMemo } from 'react';
import { UserProfile, JobFilters, Application, ApplicationStatus } from '@/lib/types';
import { ScoredJobPosting } from '@/ai/flows/score-jobs-against-resume';
import { useUser, useAuth, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, collection } from 'firebase/firestore';
import { 
  setDocumentNonBlocking, 
  addDocumentNonBlocking, 
  updateDocumentNonBlocking 
} from '@/firebase/non-blocking-updates';
import { toast } from '@/hooks/use-toast';

interface AppContextType {
  profile: UserProfile | null;
  setProfile: (profile: Partial<UserProfile>) => Promise<void>;
  filters: JobFilters;
  setFilters: (filters: JobFilters | ((prev: JobFilters) => JobFilters)) => void;
  applications: Application[];
  addApplication: (job: ScoredJobPosting) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  isApplyingJob: ScoredJobPosting | null;
  setIsApplyingJob: (job: ScoredJobPosting | null) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoadingAuth: boolean;
  isLoadingData: boolean;
}

const defaultFilters: JobFilters = {
  skills: [],
  jobType: [],
  workMode: [],
  datePosted: 'anytime',
  role: '',
  minMatchScore: 0
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isLoadingAuth } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [isApplyingJob, setIsApplyingJob] = useState<ScoredJobPosting | null>(null);

  // Firestore Real-time Subscriptions
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid, 'profile', 'main');
  }, [db, user]);

  const appsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'job_applications');
  }, [db, user]);

  const { data: firestoreProfile, isLoading: isLoadingProfile } = useDoc<any>(profileRef);
  const { data: firestoreApps, isLoading: isLoadingApps } = useCollection<any>(appsQuery);

  const profile = useMemo(() => {
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || firestoreProfile?.name || 'User',
      resumeText: firestoreProfile?.resumeText || ''
    };
  }, [user, firestoreProfile]);

  const setProfile = async (updates: Partial<UserProfile>) => {
    if (!profileRef || !user) return;

    setDocumentNonBlocking(profileRef, {
      externalUserId: user.uid,
      email: user.email,
      name: user.displayName,
      ...updates,
      resumeUploadDate: new Date().toISOString()
    }, { merge: true });
    
    toast({
      title: "Profile Saved",
      description: "Your professional details have been updated in the cloud.",
    });
  };

  const addApplication = async (job: ScoredJobPosting) => {
    if (!db || !user) return;

    const appsCol = collection(db, 'users', user.uid, 'job_applications');
    const appData = {
      userId: user.uid,
      job: {
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        jobDescription: job.jobDescription,
        applicationUrl: job.applicationUrl || '',
        matchScore: job.matchScore,
        explanation: job.explanation
      },
      status: 'Applied' as ApplicationStatus,
      appliedDate: new Date().toISOString(),
      timeline: [{
        status: 'Applied' as ApplicationStatus,
        date: new Date().toISOString(),
        note: 'Tracked via JobFlow.'
      }]
    };

    addDocumentNonBlocking(appsCol, appData);
    
    toast({
      title: "Application Tracked",
      description: `Added ${job.companyName} to your pipeline.`,
    });
  };

  const updateApplicationStatus = async (id: string, status: ApplicationStatus) => {
    if (!db || !user) return;

    const appRef = doc(db, 'users', user.uid, 'job_applications', id);
    const appToUpdate = firestoreApps?.find(a => a.id === id);
    
    if (appToUpdate) {
      updateDocumentNonBlocking(appRef, {
        status,
        timeline: [...(appToUpdate.timeline || []), { 
          status, 
          date: new Date().toISOString(),
          note: `Status updated to ${status}.`
        }]
      });
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      // Direct call to signInWithPopup to avoid browser blocking
      await signInWithPopup(auth, provider);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in with Google.",
      });
    } catch (error: any) {
      console.error("Google Sign-in Error:", error);
      let message = error.message;
      
      // Handle common Firebase Auth errors
      if (error.code === 'auth/operation-not-allowed') {
        message = "Google Sign-in is not enabled. Please enable it in your Firebase Console (Authentication > Sign-in method).";
      } else if (error.code === 'auth/popup-blocked') {
        message = "Sign-in popup blocked! Look for a small icon in the right side of your address bar to 'Always allow popups' for this site, then try clicking Sign In again.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = "Sign-in window was closed before completion. Please try again.";
      } else if (error.code === 'auth/unauthorized-domain') {
        message = "This domain is not authorized for Google Sign-in. Add it to the 'Authorized domains' list in your Firebase Console.";
      }

      toast({ 
        title: "Sign in failed", 
        description: message, 
        variant: "destructive" 
      });
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error("Auth not configured");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast({ title: "Welcome back!", description: "Successfully signed in." });
    } catch (error: any) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    if (!auth) throw new Error("Auth not configured");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
      toast({ title: "Account created", description: `Welcome to JobFlow, ${name}!` });
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({ title: "Signed out", description: "You have been securely logged out." });
  };

  return (
    <AppContext.Provider value={{
      profile, setProfile,
      filters, setFilters,
      applications: firestoreApps || [], 
      addApplication, 
      updateApplicationStatus,
      isApplyingJob, setIsApplyingJob,
      signInWithGoogle, signInWithEmail, signUpWithEmail, logout, 
      isLoadingAuth,
      isLoadingData: isLoadingProfile || isLoadingApps
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
