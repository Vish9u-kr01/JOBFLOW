"use client"

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

/**
 * @fileOverview Detects when a user returns to the app after clicking "Apply"
 * and prompts them to track the application in their pipeline.
 */
export function ApplicationTrackerPopup() {
  const { isApplyingJob, setIsApplyingJob, addApplication } = useApp();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      if (isApplyingJob) {
        // Delay slightly to give user time to register they are back in the app
        const timer = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isApplyingJob]);

  const handleApplied = (type: 'yes' | 'no' | 'earlier') => {
    if (type === 'yes' || type === 'earlier') {
      addApplication(isApplyingJob!);
    }
    setShow(false);
    setIsApplyingJob(null);
  };

  if (!isApplyingJob) return null;

  return (
    <Dialog open={show} onOpenChange={(val) => { if(!val) handleApplied('no') }}>
      <DialogContent className="sm:max-w-md glass-card border-white/10 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <CheckCircle2 className="text-primary w-6 h-6" />
            Track Application
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-muted-foreground">
            Did you apply to <strong className="text-white">{isApplyingJob.jobTitle}</strong> at <strong className="text-white">{isApplyingJob.companyName}</strong>?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button onClick={() => handleApplied('yes')} className="bg-primary hover:bg-primary/90 text-white flex items-center justify-start gap-3 h-14 rounded-2xl font-bold shadow-lg shadow-primary/20">
            <CheckCircle2 className="w-5 h-5" /> Yes, I just applied
          </Button>
          <Button variant="outline" onClick={() => handleApplied('earlier')} className="flex items-center justify-start gap-3 h-14 rounded-2xl border-white/10 hover:bg-white/5 text-white font-bold">
            <Clock className="w-5 h-5" /> I applied earlier
          </Button>
          <Button variant="ghost" onClick={() => handleApplied('no')} className="flex items-center justify-start gap-3 h-14 rounded-2xl text-muted-foreground hover:text-white font-bold">
            <XCircle className="w-5 h-5" /> No, just browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
