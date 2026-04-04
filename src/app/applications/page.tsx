
"use client"

import React, { useEffect } from 'react';
import { ApplicationList } from '@/components/applications/application-list';
import { useApp } from '@/lib/store/app-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, ArrowRight, LayoutDashboard, Loader2, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplicationsPage() {
  const { applications, profile, isLoadingAuth } = useApp();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Gate: If not logged in, show a prompt to sign in
  if (!profile) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-24">
        <div className="hero-glow opacity-30" />
        <Card className="text-center py-12 px-6 border-dashed border-2 glass-card border-white/10 rounded-3xl">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase">Private Pipeline</CardTitle>
            <CardDescription className="text-muted-foreground font-medium text-lg pt-2">
              Sign in to manage your active applications and track your interview progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Button size="lg" asChild className="bg-white text-black hover:bg-white/90 font-black px-12 h-14 rounded-full shadow-xl shadow-white/5 transition-transform active:scale-95">
              <Link href="/login">
                <LogIn className="w-5 h-5 mr-2" /> Access Tracker
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="hero-glow opacity-30" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary mb-2">
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Manager</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Application Pipeline
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Tracking {applications.length} active opportunities for {profile.name}.
          </p>
        </div>
        <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 font-bold shadow-xl shadow-white/5">
          <Link href="/">
            Search More Jobs <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-8 rounded-3xl border-l-4 border-l-primary relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="w-12 h-12 text-white" />
          </div>
          <h4 className="text-muted-foreground text-xs font-black uppercase tracking-widest">Applied</h4>
          <p className="text-4xl font-black text-white mt-2">{applications.filter(a => a.status === 'Applied').length}</p>
        </div>
        
        <div className="glass-card p-8 rounded-3xl border-l-4 border-l-purple-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="w-12 h-12 text-white" />
          </div>
          <h4 className="text-muted-foreground text-xs font-black uppercase tracking-widest">Interviews</h4>
          <p className="text-4xl font-black text-white mt-2">{applications.filter(a => a.status === 'Interview').length}</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border-l-4 border-l-secondary relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="w-12 h-12 text-white" />
          </div>
          <h4 className="text-muted-foreground text-xs font-black uppercase tracking-widest">Offers</h4>
          <p className="text-4xl font-black text-white mt-2">{applications.filter(a => a.status === 'Offer').length}</p>
        </div>
      </div>

      <ApplicationList />
    </div>
  );
}
