'use server';

/**
 * @fileOverview Server actions for fetching live job data from LinkedIn Scraper.
 * Robustly handles API key environment variables.
 */

import { JobPosting } from "@/lib/types";
import { MOCK_JOBS } from "@/lib/mock-data";

/**
 * Fetches live job postings from Realtime LinkedIn Scraper (RapidAPI).
 */
export async function fetchLiveJobs(query: string = 'Software Engineer'): Promise<JobPosting[]> {
  const rapidApiKey = process.env.LINKEDIN_SCRAPER_API_KEY;
  const rapidApiHost = process.env.LINKEDIN_SCRAPER_HOST || "realtime-linkdin-scraper1.p.rapidapi.com";

  if (rapidApiKey && rapidApiKey !== 'your_key' && rapidApiKey !== '') {
    try {
      console.log(`JobFlow: Fetching LinkedIn jobs for "${query}" via RapidAPI...`);
      
      const url = `https://${rapidApiHost}/jobSearch.php?searchTerm=${encodeURIComponent(query)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost,
        },
        next: { revalidate: 3600 } // Cache for 1 hour to manage rate limits
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle various LinkedIn Scraper data structures
        const rawJobs = Array.isArray(data) ? data : (data.jobs || data.results || []);
        
        if (rawJobs.length > 0) {
          return rawJobs.map((j: any) => ({
            jobTitle: j.jobTitle || j.title || j.job_title || "Untitled position",
            companyName: j.companyName || j.company || j.employer_name || "Confidential",
            jobDescription: j.jobDescription || j.description || j.snippet || "View details on LinkedIn.",
            applicationUrl: j.jobUrl || j.url || j.apply_url || `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(query)}`,
            jobType: (j.jobType || "Full-time") as any,
            postedDate: j.postDate || j.posted_at || new Date().toISOString()
          }));
        }
      } else {
        console.warn(`JobFlow: LinkedIn API responded with error ${response.status}`);
      }
    } catch (error) {
      console.error("JobFlow: LinkedIn Scraper fetch failed:", error);
    }
  }

  // Fallback to high-fidelity mock data if API fails or key is missing
  console.log("JobFlow: API key missing or request failed. Using fallback data.");
  return MOCK_JOBS;
}
