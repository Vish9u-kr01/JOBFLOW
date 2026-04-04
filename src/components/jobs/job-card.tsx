
"use client"

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Building2, Sparkles, Globe } from 'lucide-react';
import { ScoredJobPosting } from '@/ai/flows/score-jobs-against-resume';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store/app-context';

export function JobCard({ job }: { job: ScoredJobPosting }) {
  const { setIsApplyingJob, applications } = useApp();
  
  const isApplied = applications.some(app => 
    app.job.jobTitle === job.jobTitle && app.job.companyName === job.companyName
  );

  const getMatchStyles = (score: number) => {
    if (score >= 70) return "bg-green-500/10 text-green-400 border-green-500/20";
    if (score >= 40) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    return "bg-white/5 text-muted-foreground border-white/10";
  };

  const handleApply = () => {
    setIsApplyingJob(job);
    const applyUrl = job.applicationUrl || `https://www.google.com/search?q=apply+${encodeURIComponent(job.jobTitle)}+at+${encodeURIComponent(job.companyName)}`;
    window.open(applyUrl, '_blank');
  };

  const getSourceSite = (url?: string) => {
    if (!url) return 'Original Post';
    if (url.includes('linkedin')) return 'LinkedIn';
    if (url.includes('indeed')) return 'Indeed';
    if (url.includes('glassdoor')) return 'Glassdoor';
    if (url.includes('wellfound') || url.includes('angel.co')) return 'Wellfound';
    if (url.includes('behance')) return 'Behance';
    if (url.includes('remotive')) return 'Remotive';
    if (url.includes('kaggle')) return 'Kaggle';
    return 'Company Site';
  };

  const sourceSite = getSourceSite(job.applicationUrl);

  return (
    <Card className={cn(
      "glass-card flex flex-col h-full transition-all duration-300 border-white/5 relative group",
      "hover:border-primary/50 hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)] hover:-translate-y-1",
      job.matchScore >= 70 && "border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
    )}>
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={cn(
            "text-[10px] font-black uppercase tracking-widest py-1 px-2 border",
            getMatchStyles(job.matchScore)
          )} variant="outline">
            {job.matchScore}% Match
          </Badge>
          {isApplied && (
            <Badge variant="outline" className="text-[10px] border-primary text-primary bg-primary/5">
              TRACKED
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl font-bold line-clamp-2 text-white group-hover:text-primary transition-colors duration-300">
          {job.jobTitle}
        </CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <Building2 className="w-4 h-4 text-primary/70" />
          <span>{job.companyName}</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-white/5 text-[10px] font-black tracking-widest text-muted-foreground border-white/5 uppercase px-2 py-0.5">
            <Globe className="w-3 h-3 mr-1 text-primary" /> {sourceSite}
          </Badge>
        </div>
        
        {job.explanation && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4 transition-colors group-hover:bg-primary/10">
            <p className="text-xs text-primary/90 font-medium italic leading-relaxed">
              "{job.explanation}"
            </p>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium">
          {job.jobDescription}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className={cn(
            "w-full rounded-xl font-bold transition-all h-11 uppercase tracking-widest text-xs",
            isApplied 
              ? "bg-white/5 text-muted-foreground border-white/5" 
              : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
          )}
          onClick={handleApply}
          disabled={isApplied}
        >
          {isApplied ? 'In Pipeline' : (
            <>
              Apply Now <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
