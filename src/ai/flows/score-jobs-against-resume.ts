'use server';

/**
 * @fileOverview Scores job postings against a user's resume using Gemini 1.5 Pro.
 */

import { ai, isAiConfigured, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'genkit';

const JobPostingSchema = z.object({
  jobTitle: z.string(),
  companyName: z.string(),
  jobDescription: z.string(),
  applicationUrl: z.string().optional(),
  jobType: z.string().optional(),
  postedDate: z.string().optional(),
});

const ScoredOutputSchema = z.object({
  matchScore: z.number().describe('Score 0-100 indicating relevance.'),
  explanation: z.string().describe('Concise reasoning (max 15 words) why this is a match.'),
  jobDescription: z.string().describe('Catchy, short description for the user (max 40 words).'),
});

const ScoreJobsAgainstResumeInputSchema = z.object({
  resumeText: z.string(),
  jobPostings: z.array(JobPostingSchema),
});

export type ScoreJobsAgainstResumeInput = z.infer<typeof ScoreJobsAgainstResumeInputSchema>;

export async function scoreJobsAgainstResume(input: ScoreJobsAgainstResumeInput): Promise<any[]> {
  if (!isAiConfigured()) {
    return input.jobPostings.map(j => ({
      ...j,
      matchScore: 0,
      explanation: "Configure GOOGLE_GENAI_API_KEY in .env to activate AI matching.",
      jobDescription: j.jobDescription
    }));
  }

  try {
    const { output } = await scoreJobsAgainstResumePrompt(input);
    
    return input.jobPostings.map((original, index) => {
      const scored = output?.[index];
      return {
        ...original,
        matchScore: scored?.matchScore ?? 0,
        explanation: scored?.explanation ?? "Analysis complete.",
        jobDescription: scored?.jobDescription ?? original.jobDescription
      };
    });
  } catch (error) {
    return input.jobPostings.map(j => ({ 
      ...j, 
      matchScore: 0, 
      explanation: "Scoring unavailable due to high demand or service error." 
    }));
  }
}

const scoreJobsAgainstResumePrompt = ai.definePrompt({
  name: 'scoreJobsAgainstResumePrompt',
  model: GEMINI_MODEL,
  input: { schema: ScoreJobsAgainstResumeInputSchema },
  output: { schema: z.array(ScoredOutputSchema) },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ]
  },
  prompt: `You are an expert recruitment agent. Analyze the user's resume and score the following job postings based on their professional DNA.

User Resume:
{{{resumeText}}}

Job List:
{{#each jobPostings}}
---
Title: {{{jobTitle}}}
Company: {{{companyName}}}
Description: {{{jobDescription}}}
---
{{/each}}`,
});
