
"use client"

import React, { useEffect, useState } from 'react';
import { JobFeed } from '@/components/jobs/job-feed';
import { JobFilters } from '@/components/jobs/job-filters';
import { ChatSidebar } from '@/components/ai/chat-sidebar';
import { ApplicationTrackerPopup } from '@/components/applications/application-tracker-popup';
import { useApp } from '@/lib/store/app-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, FileText, Loader2, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const { profile, isLoadingAuth } = useApp();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Gate: If no profile, show landing page with login/signup buttons
  if (!profile) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center pt-10">
        <div className="hero-glow" />
        
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-violet-500/20 rounded-full blur-2xl group-hover:bg-violet-500/30 transition-all duration-500 animate-pulse-soft" />
              <div className="relative z-10 p-5 vibrant-bg rounded-3xl shadow-2xl shadow-violet-500/20 transition-transform group-hover:scale-110">
                <Briefcase className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
              <span className="gradient-text">JobFlow</span>
            </h1>
            <p className="text-primary font-bold text-sm md:text-base tracking-[0.3em] uppercase mb-8">
              The AI that actually gets you hired.
            </p>
          </div>
          
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-lg font-medium">
            Upload your resume and let our AI agents match you with the best opportunities.
            We track everything for you so you can focus on the interview.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Button size="lg" asChild className="bg-white text-black hover:bg-white/90 rounded-full px-10 h-14 text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
              <Link href="/login?mode=signup">
                Create Account <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-10 h-14 text-lg font-bold border-white/10 hover:bg-white/5 backdrop-blur-sm transition-all">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "AI Precision Match", 
                desc: "Neural scoring that maps your talent DNA directly to the most high-value opportunities.", 
                icon: Sparkles 
              },
              { 
                title: "Direct Portal Link", 
                desc: "Bypass the middle-men. One-click application links straight to official career portals.", 
                icon: Briefcase 
              },
              { 
                title: "Auto-Pilot Tracking", 
                desc: "Your career pipeline on autopilot. We track every status so you can focus on the win.", 
                icon: FileText 
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl text-left hover:border-violet-500/50 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] transition-all group border-white/5 cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-violet-500/10 transition-all" />
                <feature.icon className="w-10 h-10 text-violet-400 mb-6 group-hover:scale-110 transition-transform relative z-10" />
                <h3 className="text-xl font-bold mb-2 group-hover:text-violet-400 transition-colors relative z-10">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative z-10 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, show the "App"
  return (
    <div className="container mx-auto px-4 pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <JobFilters />
        </aside>
        
        <main className="lg:col-span-9">
          <JobFeed />
        </main>
      </div>

      <ChatSidebar />
      <ApplicationTrackerPopup />
    </div>
  );
}
