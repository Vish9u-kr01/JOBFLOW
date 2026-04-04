/**
 * @fileOverview Application-wide type definitions.
 * Definining types here locally instead of importing from 'use server' files
 * to prevent compilation hangs in the Next.js Turbopack graph.
 */

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface JobPosting {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  applicationUrl?: string;
  jobType?: JobType;
  postedDate?: string;
}

export interface ScoredJobPosting extends JobPosting {
  matchScore: number;
  explanation: string;
}

export interface Application {
  id: string;
  job: ScoredJobPosting;
  status: ApplicationStatus;
  appliedDate: string;
  timeline: {
    status: ApplicationStatus;
    date: string;
    note?: string;
  }[];
}

export interface UserProfile {
  uid?: string;
  resumeText: string;
  email: string;
  name: string;
}

export interface JobFilters {
  role?: string;
  skills: string[];
  datePosted?: '24h' | 'week' | 'month' | 'anytime';
  jobType: JobType[];
  workMode: WorkMode[];
  location?: string;
  minMatchScore?: number;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'tool' | 'system';
  content: string;
}
