
"use client"

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Briefcase, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, profile } = useApp();
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);

useEffect(() => {
  setIsSignUp(searchParams.get('mode') === 'signup');
}, [searchParams]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (profile) {
      router.push('/');
    }
  }, [profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      // Redirection is handled by the useEffect above
    } catch (error) {
      console.error("Auth form submission error", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (profile) return null;

  return (
    <div className="container mx-auto px-4 flex items-center justify-center min-h-[80vh]">
      <div className="hero-glow opacity-50" />
      <Card className="w-full max-w-md glass-card border-white/10 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center space-y-2 pt-10">
          <div className="mx-auto w-16 h-16 vibrant-bg rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-violet-500/20">
            <Briefcase className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-black text-white tracking-tighter">
            {isSignUp ? 'Join JobFlow' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            {isSignUp 
              ? 'The AI-powered career accelerator.' 
              : 'Sign in to access your matched pipeline.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
            onClick={() => signInWithGoogle()}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
              <span className="bg-[#050912] px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="Jane Cooper" 
                    className="pl-9 bg-white/5 border-white/10 text-white rounded-xl h-11" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-9 bg-white/5 border-white/10 text-white rounded-xl h-11" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-9 bg-white/5 border-white/10 text-white rounded-xl h-11" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-xl font-bold text-base mt-4" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center py-8 bg-white/5 border-t border-white/5">
          <p className="text-sm text-muted-foreground font-medium">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="ml-2 text-white font-bold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
