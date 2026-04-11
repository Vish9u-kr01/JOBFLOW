'use server';

/**
 * @fileOverview Server actions for fetching live job data from Adzuna API.
 * Robustly handles API key environment variables.
 */

import { JobPosting } from "@/lib/types";
import { MOCK_JOBS } from "@/lib/mock-data";

/**
 * Fetches live job postings from Adzuna API.
 */
export async function fetchLiveJobs(query: string = 'Software Engineer'): Promise<JobPosting[]> {
  const adzunaAppId = process.env.ADZUNA_APP_ID;
  const adzunaAppKey = process.env.ADZUNA_APP_KEY;

  if (adzunaAppId && adzunaAppKey && adzunaAppId !== '' && adzunaAppKey !== '') {
    try {
      console.log(`JobFlow: Fetching Adzuna jobs for "${query}"...`);
      
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${adzunaAppId}&app_key=${adzunaAppKey}&results_per_page=50&what=${encodeURIComponent(query)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour to manage rate limits
      });

      if (response.ok) {
        const data = await response.json();
        
        const rawJobs = data.results || [];
        
        if (rawJobs.length > 0) {
          return rawJobs.map((j: any) => ({
            jobTitle: j.title || "Untitled position",
            companyName: (j.company && j.company.display_name) || "Confidential",
            jobDescription: j.description || "View details on Adzuna.",
            applicationUrl: j.redirect_url || `https://www.adzuna.com/search?q=${encodeURIComponent(query)}`,
            jobType: (j.contract_time === 'full_time' ? "Full-time" : j.contract_time === 'part_time' ? 'Part-time' : j.contract_type || "Full-time") as any,
            postedDate: j.created || new Date().toISOString()
          }));
        }
      } else {
        console.warn(`JobFlow: Adzuna API responded with error ${response.status}`);
      }
    } catch (error) {
      console.error("JobFlow: Adzuna fetch failed:", error);
    }
  }

  // Fallback to high-fidelity mock data if API fails or key is missing
  console.log("JobFlow: API key missing or request failed. Using fallback data.");
  return MOCK_JOBS;
}
