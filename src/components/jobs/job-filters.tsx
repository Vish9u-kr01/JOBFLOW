"use client"

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Search, Calendar, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { JobType, WorkMode } from '@/lib/types';
import { cn } from '@/lib/utils';

export function JobFilters() {
  const { filters, setFilters } = useApp();

  const handleToggleType = (type: JobType) => {
    setFilters(prev => ({
      ...prev,
      jobType: prev.jobType.includes(type) 
        ? prev.jobType.filter(t => t !== type)
        : [...prev.jobType, type]
    }));
  };

  const handleToggleMode = (mode: WorkMode) => {
    setFilters(prev => ({
      ...prev,
      workMode: prev.workMode.includes(mode)
        ? prev.workMode.filter(m => m !== mode)
        : [...prev.workMode, mode]
    }));
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      skills: [],
      datePosted: 'anytime',
      jobType: [],
      workMode: [],
      minMatchScore: 0
    });
  };

  return (
    <Card className="sticky top-24 glass-card border-white/5">
      <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <CardTitle className="text-base font-bold text-white uppercase tracking-tighter">Filters</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-[10px] font-bold text-muted-foreground hover:text-white uppercase">
          Reset
        </Button>
      </CardHeader>
      <CardContent className="pt-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {/* Search */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Job title..." 
              className="pl-9 bg-white/5 border-white/10 text-white rounded-xl"
              value={filters.role || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            />
          </div>
        </div>

        {/* Date Posted */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-3 h-3" /> Date Posted
          </Label>
          <RadioGroup 
            value={filters.datePosted || 'anytime'} 
            onValueChange={(val) => setFilters(prev => ({ ...prev, datePosted: val as any }))}
            className="space-y-2"
          >
            {[
              { label: 'Last 24 hours', value: '24h' },
              { label: 'Last week', value: 'week' },
              { label: 'Last month', value: 'month' },
              { label: 'Any time', value: 'anytime' },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`date-${opt.value}`} className="border-white/20" />
                <Label htmlFor={`date-${opt.value}`} className="text-sm font-medium text-white/80 cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Job Type */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-3 h-3" /> Job Type
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
              <div key={type} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <Checkbox 
                  id={`type-${type}`} 
                  checked={filters.jobType.includes(type as JobType)}
                  onCheckedChange={() => handleToggleType(type as JobType)}
                  className="border-white/20 data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`type-${type}`} className="text-sm font-medium text-white/80 cursor-pointer w-full">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Match Score */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Match Score</Label>
          <RadioGroup 
            value={filters.minMatchScore?.toString() || '0'} 
            onValueChange={(val) => setFilters(prev => ({ ...prev, minMatchScore: parseInt(val) }))}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="70" id="score-high" className="border-white/20" />
              <Label htmlFor="score-high" className="text-sm font-medium text-white/80 cursor-pointer">High Match (70%+)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="40" id="score-med" className="border-white/20" />
              <Label htmlFor="score-med" className="text-sm font-medium text-white/80 cursor-pointer">Medium Match (40%+)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="score-all" className="border-white/20" />
              <Label htmlFor="score-all" className="text-sm font-medium text-white/80 cursor-pointer">All Jobs</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Work Mode */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Work Mode</Label>
          <div className="grid grid-cols-1 gap-2">
            {['Remote', 'Hybrid', 'On-site'].map((mode) => (
              <div key={mode} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <Checkbox 
                  id={`mode-${mode}`} 
                  checked={filters.workMode.includes(mode as WorkMode)}
                  onCheckedChange={() => handleToggleMode(mode as WorkMode)}
                  className="border-white/20 data-[state=checked]:bg-primary"
                />
                <Label htmlFor={`mode-${mode}`} className="text-sm font-medium text-white/80 cursor-pointer w-full">{mode}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Skills</Label>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Figma', 'UI/UX'].map(skill => (
              <Badge 
                key={skill} 
                variant="outline"
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-1 font-bold border-white/10 transition-all",
                  filters.skills.includes(skill) 
                    ? "bg-primary text-white border-primary" 
                    : "text-muted-foreground hover:border-white/30 hover:text-white"
                )}
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    skills: prev.skills.includes(skill) 
                      ? prev.skills.filter(s => s !== skill)
                      : [...prev.skills, skill]
                  }));
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
