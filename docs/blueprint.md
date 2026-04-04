# **App Name**: CareerCompass AI

## Core Features:

- Job Fetching: Fetch job postings from external sources like Azzura and display them in a unified feed.
- AI-Powered Matching: Intelligently match jobs with a user's resume using AI algorithms. When jobs load, automatically score each job against the user's resume. Show a match score (0-100%) on every job card, with color-coded badges (Green >70%, Yellow 40-70%, Gray <40%). Display a Best Matches section at the top (6-8 highest scoring jobs). Show a short explanation of matching skills, relevant experience, and keywords alignment. LangChain is mandatory for AI-based job matching.
- Application Tracking: Track job applications and manage them effectively with smart UX decisions.
- Conversational AI Assistant: Integrate a conversational AI assistant to help users control UI filters and refine their job search in real-time, using resume information as a tool. Choose one UI approach: Option A: Floating chat bubble (bottom-right, expandable) or Option B: Collapsible sidebar (slides in/out). Users should be able to ask: "Show me React developer jobs with Node.js", "Find ML engineer roles using PyTorch and TensorFlow", and "Remote frontend jobs". The AI should: Understand intent, Return relevant jobs, Respect existing filters, and Show match scores. The AI must directly update UI filters, not just reply in chat. Examples: "Show only remote jobs" - Applies Remote filter, "Filter by last 24 hours" - Updates date filter, "Only full-time roles in Bangalore" - Applies multiple filters, and "High match scores only" - Match score >70%. Also include: "Clear all filters" - Resets UI. The AI should answer questions like: "Where can I see my applications?", "Where do I upload my resume?", and "How does job matching work?". LangGraph is mandatory. LangGraph must handle: Intent detection, Action routing (search, filter update, help), Conversation state, and Tool/function calling for UI/filter updates.
- Job Feed UI: Display jobs in a clean, readable feed with job title, company name, location, job description, job type, and an apply button.
- Filtering: Offer comprehensive filtering options including role/title text search, multi-select skills (e.g., React, Node.js, Python), date posted (last 24 hours, last week, last month, anytime), and job type (full-time, part-time, contract, internship). Allow filtering by work mode (Remote, Hybrid, On-site), location (city or region), and match score (High (>70%), Medium (40-70%), All).
- Resume Upload & Profile: At login, prompt the user to upload a resume (PDF or TXT). Use the following test credentials: Email: test@gmail.com, Password: test123. Only one resume per user. User should be able to replace/update resume anytime. Extract and store resume text for AI processing.
- Smart Application Tracking: When the user clicks 'Apply', open the job's external link in a new tab. When the user returns to your app, show a popup: Did you apply to [Job Title] at [Company]? Options: Yes, Applied; No, just browsing; Applied Earlier. Behavior: If Yes - save job as Applied with timestamp. Allow status updates: Applied -> Interview -> Other -> Rejected. Display all applications in a dashboard view. Include a timeline per application.

## Style Guidelines:

- Primary color: Dark Blue (#34495E) to convey professionalism and stability.
- Background color: Light Gray (#F0F3F4) to provide a clean and readable layout.
- Accent color: Teal (#008080) for interactive elements and call-to-action buttons, signaling opportunity.
- Body and headline font: 'Inter', sans-serif, for a modern, objective, and neutral feel suitable for both headlines and body text.
- Use clear and professional icons to represent job categories, filters, and actions.
- Employ a clean and organized layout with clear sections for job listings, filters, and user profile information.
- Use subtle transitions and animations to provide feedback on user interactions, such as loading new jobs or applying filters.