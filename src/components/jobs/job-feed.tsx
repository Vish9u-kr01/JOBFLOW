"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '@/lib/store/app-context';
import { fetchLiveJobs } from '@/app/actions/jobs';
import { scoreJobsAgainstResume, ScoredJobPosting } from '@/ai/flows/score-jobs-against-resume';
import { JobCard } from './job-card';
import { Loader2, Sparkles, FilterX, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JobFeed() {
  const { profile, filters, setFilters } = useApp();
  const [jobs, setJobs] = useState<ScoredJobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      setIsLoading(true);
      try {
        // 1. Fetch live jobs based on current role filter or generic search
        const liveJobs = await fetchLiveJobs(filters.role || 'Software Developer');
        
        // 2. Score them if a resume exists
        if (profile?.resumeText) {
          const scored = await scoreJobsAgainstResume({
            resumeText: profile.resumeText,
            jobPostings: liveJobs
          });
          setJobs(scored.sort((a, b) => b.matchScore - a.matchScore));
        } else {
          // No resume: show jobs with zero score
          setJobs(liveJobs.map(j => ({ 
            ...j, 
            matchScore: 0, 
            explanation: "Upload your resume in Profile to see your match score.",
            jobDescription: j.jobDescription // Keep original if not scored
          } as ScoredJobPosting)));
        }
      } catch (error) {
        console.error("JobFlow Pipeline Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadJobs();
  }, [profile?.resumeText, filters.role]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // 1. Min match score
      if (filters.minMatchScore && job.matchScore < filters.minMatchScore) return false;
      
      // 2. Job Type
      if (filters.jobType.length > 0 && job.jobType) {
        if (!filters.jobType.includes(job.jobType as any)) return false;
      }

      // 3. Date Posted
      if (filters.datePosted && filters.datePosted !== 'anytime' && job.postedDate) {
        const posted = new Date(job.postedDate);
        const now = new Date();
        const diffMs = now.getTime() - posted.getTime();
        
        if (filters.datePosted === '24h' && diffMs > 24 * 60 * 60 * 1000) return false;
        if (filters.datePosted === 'week' && diffMs > 7 * 24 * 60 * 60 * 1000) return false;
        if (filters.datePosted === 'month' && diffMs > 30 * 24 * 60 * 60 * 1000) return false;
      }
      
      // 4. Skill filter (client-side refinement)
      if (filters.skills.length > 0) {
        const hasSkill = filters.skills.some(skill => 
          job.jobDescription.toLowerCase().includes(skill.toLowerCase()) || 
          job.jobTitle.toLowerCase().includes(skill.toLowerCase())
        );
        if (!hasSkill) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  const bestMatches = useMemo(() => {
    // Top 8 highest scoring jobs from the filtered set
    return [...filteredJobs]
      .filter(j => j.matchScore >= 70)
      .slice(0, 8);
  }, [filteredJobs]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-xl animate-pulse rounded-full" />
          <Loader2 className="w-12 h-12 animate-spin text-primary relative z-10" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-white font-black uppercase tracking-[0.2em] text-xs">Accessing Live Job Portals</p>
          <p className="text-muted-foreground text-xs font-medium">Neural matching in progress...</p>
        </div>
      </div>
    );
  }

  if (filteredJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="bg-white/5 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
          <FilterX className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">No Matches Found</h3>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto font-medium">Try broadening your search or chat with our AI agent to refine your career criteria.</p>
        <Button 
          variant="outline" 
          className="rounded-full px-8 h-12 border-white/10 hover:bg-white/5 text-xs font-black uppercase tracking-widest"
          onClick={() => setFilters({ skills: [], jobType: [], workMode: [], datePosted: 'anytime', role: '', minMatchScore: 0 })}
        >
          Reset All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20">
      {bestMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-xl shadow-primary/5">
                <Sparkles className="text-primary w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Best Matches</h2>
                <p className="text-[10px] text-primary font-black tracking-[0.3em] uppercase mt-1">AI-Verified Opportunities</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestMatches.map((job, i) => (
              <JobCard key={`best-${i}`} job={job} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <Globe className="text-muted-foreground w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Global Feed</h2>
              <p className="text-[10px] text-muted-foreground font-black tracking-[0.3em] uppercase mt-1">Live Pipeline Results</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job, i) => (
            <JobCard key={`all-${i}`} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}
