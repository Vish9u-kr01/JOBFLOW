"use client"

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationStatus } from '@/lib/types';
import { format } from 'date-fns';
import { Calendar, History, Briefcase, Building2, ExternalLink, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export function ApplicationList() {
  const { applications, updateApplicationStatus } = useApp();

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case 'Interview': return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case 'Offer': return "bg-green-500/10 text-green-400 border-green-500/20";
      case 'Rejected': return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-white/5 text-white/50 border-white/10";
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-24 glass-card rounded-3xl border border-white/5">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <History className="w-10 h-10 text-white/20" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Pipeline is Empty</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">Start applying to jobs to track your career progress here in real-time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="text-xs font-black uppercase tracking-widest text-muted-foreground h-14">Company & Position</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-muted-foreground h-14">Applied Date</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-muted-foreground h-14">Current Status</TableHead>
              <TableHead className="text-right text-xs font-black uppercase tracking-widest text-muted-foreground h-14">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className="group border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="py-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-bold text-white group-hover:text-primary transition-colors">{app.job.jobTitle}</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> {app.job.companyName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-white/70 font-medium">
                    <Calendar className="w-4 h-4 text-primary" />
                    {format(new Date(app.appliedDate), 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-[10px] font-black uppercase tracking-widest py-1 px-3 border", getStatusColor(app.status))} variant="outline">
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select 
                    value={app.status} 
                    onValueChange={(val) => updateApplicationStatus(app.id, val as ApplicationStatus)}
                  >
                    <SelectTrigger className="w-[140px] ml-auto h-10 bg-black/50 border-white/10 text-xs font-bold rounded-xl focus:ring-primary">
                      <SelectValue placeholder="Update" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 text-white">
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Interview">Interview</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
          <History className="w-5 h-5 text-secondary" />
          Event Timeline
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => (
            <Accordion type="single" collapsible key={`timeline-${app.id}`} className="glass-card rounded-2xl border border-white/5 px-6">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="hover:no-underline py-6 group">
                  <div className="flex items-center gap-5 text-left w-full">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner">
                      {app.job.companyName[0]}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-bold text-white text-lg leading-none mb-2">{app.job.jobTitle}</span>
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                        <History className="w-3 h-3" />
                        Updated {format(new Date(app.timeline[app.timeline.length-1].date), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <Badge className={cn("hidden sm:flex text-[10px] font-black uppercase tracking-widest border", getStatusColor(app.status))}>
                      {app.status}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 pt-2">
                  <div className="pl-16 relative space-y-8 before:absolute before:left-[1.9rem] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                    {app.timeline.map((entry, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[1.85rem] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10 z-10" />
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-xs uppercase tracking-widest text-white">{entry.status}</span>
                            <span className="text-[10px] font-medium text-muted-foreground">{format(new Date(entry.date), 'MMM d, yyyy · h:mm a')}</span>
                          </div>
                          {entry.note && (
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 mt-2 max-w-xl">
                              <p className="text-sm text-white/70 leading-relaxed font-medium">{entry.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}
