# JobFlow - AI-Powered Career Accelerator

JobFlow is a high-performance career platform that uses agentic AI to match talent with live opportunities. It automates resume analysis, calculates precise match scores, and provides an AI assistant to manage your search pipeline.

## 🚀 Setup Instructions

### 1. Get a Google AI API Key (Required for AI)
The AI matching and chat agent require a Gemini API key. Without this, the app will run in "offline" mode with mock data.
1. Visit **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2. Sign in with your Google Account.
3. Click **"Create API key"**.
4. Copy the key.

### 2. Get a LinkedIn Scraper API Key (Optional for Live Data)
To fetch real-time jobs from LinkedIn:
1. Sign up at [RapidAPI](https://rapidapi.com/).
2. Subscribe to the [Realtime LinkedIn Scraper](https://rapidapi.com/patelvatsal611/api/realtime-linkdin-scraper1).
3. Copy your **X-RapidAPI-Key**.

### 3. Configure Environment
Create a `.env` file in the root directory and paste your keys. Use these exact variable names:
```env
# --- GOOGLE GENAI CONFIG ---
# Get this from: https://aistudio.google.com/app/apikey
# This key powers Gemini 1.5 Pro matching and the career agent.
GOOGLE_GENAI_API_KEY=your_gemini_key_here

# --- LINKEDIN SCRAPER CONFIG ---
# Get this from: https://rapidapi.com/patelvatsal611/api/realtime-linkdin-scraper1
LINKEDIN_SCRAPER_API_KEY=your_rapidapi_key_here
LINKEDIN_SCRAPER_HOST=realtime-linkdin-scraper1.p.rapidapi.com

# --- FIREBASE CONFIG ---
# Get these from your Firebase Console Project Settings
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
```

### 4. Install & Run
1. `npm install`
2. `npm run dev`

---

## 🏗 Architecture
- **AI Engine**: Genkit v1.x + Gemini 1.5 Pro.
- **Backend**: Firebase Auth + Firestore (Real-time).
- **Frontend**: Next.js 15 (App Router) + Shadcn UI.
- **Job Source**: Realtime LinkedIn Scraper via RapidAPI.

Built with ❤️ using Next.js & Google Genkit.
