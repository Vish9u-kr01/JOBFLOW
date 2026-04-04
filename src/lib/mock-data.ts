import { JobPosting } from "@/ai/flows/score-jobs-against-resume";

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

export const MOCK_JOBS: JobPosting[] = [
  {
    jobTitle: "Senior Frontend Developer",
    companyName: "TechFlow Systems",
    jobDescription: "We are looking for a Senior React developer with strong TypeScript skills and experience in Next.js. You should have 5+ years of experience and be familiar with Tailwind CSS and Shadcn UI. Remote work is supported.",
    applicationUrl: "https://www.linkedin.com/jobs/view/senior-frontend-developer-at-techflow-systems",
    jobType: "Full-time",
    postedDate: yesterday.toISOString()
  },
  {
    jobTitle: "Machine Learning Engineer",
    companyName: "AiVolution",
    jobDescription: "Join our core AI team. Expertise in Python, PyTorch, and TensorFlow is mandatory. Experience with GenAI models like LLMs and prompt engineering is a big plus. Bangalore on-site preferred.",
    applicationUrl: "https://www.google.com/about/careers/applications/jobs/results/machine-learning-engineer-aivolution",
    jobType: "Full-time",
    postedDate: now.toISOString()
  },
  {
    jobTitle: "Product Designer",
    companyName: "Creativio",
    jobDescription: "Seeking a designer with a strong portfolio in SaaS products. Experience with Figma, design systems, and basic HTML/CSS knowledge to collaborate with engineers. Full-time position.",
    applicationUrl: "https://www.behance.net/joblist/creativio-product-designer",
    jobType: "Full-time",
    postedDate: lastWeek.toISOString()
  },
  {
    jobTitle: "Fullstack Engineer (Node/React)",
    companyName: "StartupUp",
    jobDescription: "Fast-paced environment. Stack: Node.js, Express, PostgreSQL, React. Experience with Docker and AWS is required. Contract role for 6 months with possibility of extension.",
    applicationUrl: "https://wellfound.com/jobs/startupup-fullstack-engineer",
    jobType: "Contract",
    postedDate: now.toISOString()
  },
  {
    jobTitle: "Data Scientist",
    companyName: "Insights Corp",
    jobDescription: "Analyze large datasets and build predictive models. Proficiency in R/Python and SQL is essential. Experience with visualization tools like Tableau or PowerBI. Remote friendly.",
    applicationUrl: "https://www.kaggle.com/jobs/insights-corp-data-scientist",
    jobType: "Full-time",
    postedDate: lastMonth.toISOString()
  },
  {
    jobTitle: "Backend Developer",
    companyName: "SecureCloud",
    jobDescription: "Build scalable APIs using Go or Java. Focus on security and performance. Experience with Kubernetes and microservices architecture. On-site in Hyderabad.",
    applicationUrl: "https://www.glassdoor.com/Job/securecloud-backend-developer-jobs",
    jobType: "Full-time",
    postedDate: yesterday.toISOString()
  },
  {
    jobTitle: "DevOps Engineer",
    companyName: "Infrastructure Solutions",
    jobDescription: "Manage cloud infrastructure (GCP/AWS). Strong Linux skills and experience with Terraform/Ansible. Help us automate our CI/CD pipelines. Hybrid role.",
    applicationUrl: "https://www.indeed.com/q-DevOps-Infrastructure-Solutions-jobs.html",
    jobType: "Full-time",
    postedDate: lastWeek.toISOString()
  },
  {
    jobTitle: "React Native Developer",
    companyName: "MobileFirst",
    jobDescription: "Develop cross-platform mobile apps for millions of users. Expertise in React Native and mobile performance optimization. Remote role.",
    applicationUrl: "https://remotive.com/remote-jobs/software-dev/mobilefirst-react-native-developer",
    jobType: "Full-time",
    postedDate: now.toISOString()
  },
  {
    jobTitle: "Junior Web Developer",
    companyName: "NewGen Tech",
    jobDescription: "Exciting internship opportunity for fresh graduates. Learn React, Node, and Tailwind on live projects.",
    applicationUrl: "https://www.google.com",
    jobType: "Internship",
    postedDate: yesterday.toISOString()
  }
];
