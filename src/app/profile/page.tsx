"use client"

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileText, Upload, CheckCircle2, AlertCircle, Trash2, Loader2, LogIn, User, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { interpretResume } from '@/ai/flows/interpret-resume-flow';

export default function ProfilePage() {
  const { profile, setProfile, isLoadingAuth } = useApp();
  const [resumeText, setResumeText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setResumeText(profile.resumeText || '');
    }
  }, [profile]);

  const handleSave = () => {
    if (!profile) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your profile.",
        variant: "destructive"
      });
      return;
    }

    if (!resumeText) {
      toast({
        title: "Resume Content Required",
        description: "Please upload a resume or paste your experience details.",
        variant: "destructive"
      });
      return;
    }

    setProfile({
      ...profile,
      resumeText
    });

    toast({
      title: "Profile Updated",
      description: "Your resume has been saved successfully.",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUri = event.target?.result as string;
      
      try {
        toast({
          title: "AI Analysis Started",
          description: "Our agent is interpreting your resume data...",
        });

        const extractedText = await interpretResume({ fileDataUri: dataUri });
        setResumeText(extractedText);
        
        toast({
          title: "Interpretation Complete",
          description: "We've successfully extracted your profile details.",
        });
      } catch (error: any) {
        console.error("AI Interpretation failed:", error);
        toast({
          title: "AI Analysis Failed",
          description: error.message || "We couldn't parse the file. Please try pasting the text manually.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
        // Reset the input value so the same file can be uploaded again if needed
        e.target.value = '';
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "Could not read the file.",
        variant: "destructive"
      });
    };

    reader.readAsDataURL(file);
  };

  const clearResume = () => {
    setResumeText('');
    if (profile) {
      setProfile({ ...profile, resumeText: '' });
    }
    toast({
      title: "Profile Cleared",
      description: "Resume content has been reset.",
    });
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-12">
        <Card className="text-center py-12 px-6 border-dashed border-2 glass-card border-white/10">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white/50" />
            </div>
            <CardTitle className="text-white">Sign In to Manage Your Profile</CardTitle>
            <CardDescription className="text-muted-foreground">
              Join JobFlow to save your resume, track applications, and get personalized job scores.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button size="lg" asChild className="bg-white text-black hover:bg-white/90 font-bold px-10 rounded-full transition-transform active:scale-95">
              <Link href="/login">
                <LogIn className="w-5 h-5 mr-2" /> Sign In / Sign Up
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Your Career Profile</h1>
        <p className="text-muted-foreground mt-2 font-medium">Authenticated as <span className="font-bold text-primary">{profile.email}</span></p>
      </div>

      <div className="space-y-6">
        <Card className="glass-card border-white/10 shadow-2xl rounded-3xl overflow-hidden relative">
          {isUploading && (
            <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                <Loader2 className="w-16 h-16 text-primary animate-spin absolute inset-0 -m-2 opacity-20" />
              </div>
              <div className="text-center">
                <p className="font-black text-white uppercase tracking-widest text-sm">AI Agent Analysis</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Extracting professional DNA...</p>
              </div>
            </div>
          )}

          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Resume Information</CardTitle>
                <CardDescription>Upload a PDF, Word, or Image to let AI interpret your experience.</CardDescription>
              </div>
              {resumeText && !isUploading && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1 border-primary/20" variant="outline">
                  <CheckCircle2 className="w-3 h-3" /> Profile Loaded
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 hover:bg-white/10 transition-all relative group cursor-pointer">
              <Input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={handleFileUpload}
                accept=".txt,.pdf,.doc,.docx,image/*"
                disabled={isUploading}
              />
              <div className="space-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-cyan-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                  {isUploading ? <Loader2 className="w-7 h-7 text-white animate-spin" /> : <Upload className="w-7 h-7 text-white" />}
                </div>
                <div className="font-bold text-white text-lg">
                  {isUploading ? 'AI is thinking...' : 'Drop your resume here'}
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Supports PDF, Word, Images or Text</div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="resume-text" className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                <span>Text Interpretation</span>
                {resumeText && <span>{resumeText.length} characters</span>}
              </Label>
              <Textarea 
                id="resume-text" 
                placeholder="Paste your summary or edit AI extracted text..." 
                className="min-h-[300px] font-mono text-sm leading-relaxed bg-black/50 border-white/10 text-white rounded-2xl focus:ring-primary"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="bg-white/5 border-t border-white/10 px-8 py-6 flex flex-col sm:flex-row gap-4 justify-between">
            <Button variant="ghost" onClick={clearResume} className="text-destructive hover:text-destructive hover:bg-destructive/10 order-2 sm:order-1 font-bold">
              <Trash2 className="w-4 h-4 mr-2" /> Reset Profile
            </Button>
            <Button onClick={handleSave} className="bg-white text-black hover:bg-white/90 font-black px-10 w-full sm:w-auto order-1 sm:order-2 rounded-xl h-12 uppercase tracking-tighter shadow-xl shadow-white/5 transition-transform active:scale-95">
              Save Career Data
            </Button>
          </CardFooter>
        </Card>

        {!resumeText && !isUploading && (
          <div className="flex items-start gap-3 p-6 bg-primary/10 border border-primary/20 rounded-3xl glass-card">
            <AlertCircle className="w-6 h-6 text-primary mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold text-white mb-1">AI-Powered Extraction</p>
              <p className="text-muted-foreground leading-relaxed">Simply upload your resume file. Our AI agent will read the contents and build your profile automatically, mapping your professional DNA to live opportunities.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
