# Saksham 🎯 — AI Voice Career Guide

> A voice-first AI career counselor for Indian students. Speak your background, get personalized career paths, courses, and jobs — all in Hindi/Hinglish.

[![Status](https://img.shields.io/badge/Status-In%20Development-orange)](.)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20Gemini-blue)](.)
[![Auth](https://img.shields.io/badge/Auth-Clerk-purple)](.)

---

## 🚀 What's Working (Done)

### Core Voice Pipeline
- [x] **Voice Input** — User records audio via browser mic
- [x] **Speech-to-Text** — GCP Speech API transcribes Hindi/English/Hinglish
- [x] **AI Career Suggestions** — Gemini 2.0 Flash suggests 5 career paths from transcript
- [x] **Push-to-Talk Agent** — Continuous voice loop in Step 2 (mic → STT → agent → TTS)
- [x] **Agent Voice Output** — GCP Chirp3-HD TTS speaks agent responses naturally

### AI Agent
- [x] **Agentic Loop** — Gemini with function calling (tool use)
- [x] **3 Tools** — `getFilteredCourses`, `getFilteredJobs`, `getMoreCareers`
- [x] **UI Control Tool** — `triggerUIAction` — agent can scroll to courses/jobs, open URLs
- [x] **Personalization** — Agent reads past sessions + UserProfile for preferences
- [x] **Voice-Friendly Responses** — Short, conversational, no markdown (spoken aloud)

### Courses & Jobs
- [x] **YouTube Courses** — Real YouTube API search with language/level/duration filters
- [x] **Udemy Link** — Dynamic Udemy search URL per career
- [x] **Job Platforms** — LinkedIn, Naukri, Internshala, Upwork, Fiverr, Freelancer
- [x] **Job Type Filtering** — Freelance / Full-time / Internship filter support

### Frontend
- [x] **3-Step Wizard** — Record → Choose Career → Courses & Jobs
- [x] **AgentChat Component** — Voice-first chat with mic button states (idle/recording/thinking/speaking)
- [x] **UI Highlight** — Courses/jobs section highlights + scrolls when agent triggers action
- [x] **Dark/Light Mode** — Full theme support
- [x] **Hindi/English Toggle** — i18n support throughout
- [x] **Responsive Design** — Mobile-friendly

### Auth & Data
- [x] **Clerk Authentication** — Sign in/out, protected routes
- [x] **MongoDB Sessions** — Career sessions saved with chat history + courses
- [x] **UserProfile** — Onboarding profile (language, work preference, education, interests)
- [x] **Profile Page** — Past careers, courses seen, chat history, account info with 3 tabs
- [x] **Rate Limiting** — 100 requests per 15 min on `/api`

---

## 🔧 In Progress / Partially Done

- [ ] **Context Persistence** — Chat history sent per-request from frontend; MongoDB save working but LocalStorage cache not yet implemented
- [ ] **UserProfile → Agent Fallback** — When no sessions exist, agent should read UserProfile preferences (code written, needs testing)
- [ ] **Onboarding Voice Flow** — `conversation/turn` route exists but not connected to frontend properly
- [ ] **Mongoose Deprecation Warnings** — `new: true` → `returnDocument: 'after'` fix pending

---

## ❌ Not Yet Built

### Voice & Agent
- [ ] **Job Apply Voice Guidance** — Agent guides user step-by-step to apply on LinkedIn/Upwork via voice
- [ ] **Interrupt Handling** — User can't interrupt agent mid-speech cleanly
- [ ] **Wake Word / Auto-Listen** — After agent finishes speaking, mic should auto-activate
- [ ] **Emotion/Tone in TTS** — Agent sounds the same regardless of context (excited vs serious)

### UI/UX
- [ ] **Frontend connected to Onboarding flow** — `conversation/start` and `conversation/turn` routes exist but no frontend page
- [ ] **Agent narrates courses on load** — When Step 2 opens, agent should auto-narrate what it found
- [ ] **Highlighted job card** — When agent says "LinkedIn kholo", that specific card should glow (currently whole section highlights)

### Infrastructure
- [ ] **AWS Migration** — Move from GCP to AWS (Transcribe, Bedrock, S3, Amplify, EC2)
- [ ] **S3 Audio Storage** — Currently audio processed in-memory, not stored
- [ ] **Deployment** — Not deployed yet (Railway / Render / AWS planned)
- [ ] **README update** — Env vars outdated (missing `GCP_CREDENTIALS_JSON`, `CLERK_SECRET_KEY`, `YOUTUBE_API_KEY`, `FRONTEND_URLS`)

### Features
- [ ] **"More Careers" Button** — `getMoreCareers` tool exists in agent but no UI button to trigger it
- [ ] **Course Level Selection UI** — User can tell agent verbally but no visual selector
- [ ] **Sharing** — Share career path / courses with friends
- [ ] **Progress Tracking** — Mark courses as completed, track learning journey

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini 2.0 Flash (Vertex AI) |
| STT | GCP Speech-to-Text (Hindi + English) |
| TTS | GCP Chirp3-HD (hi-IN-Chirp3-HD-Aoede) |
| Auth | Clerk |
| Courses | YouTube Data API v3 |
| Planned | AWS Bedrock, AWS Transcribe, S3, Amplify |

---

## 📁 Project Structure

```
Career-Guide/
├── career-guide-backend/
│   ├── server.js
│   ├── models/
│   │   ├── Session.js         # Career sessions + chat history
│   │   └── UserProfile.js     # Onboarding profile data
│   ├── routes/
│   │   ├── agent.js           # POST /api/agent/chat
│   │   ├── career.js          # POST /api/career/suggest
│   │   ├── conversation.js    # Voice onboarding flow
│   │   ├── courses.js         # POST /api/courses/suggest
│   │   ├── jobs.js            # POST /api/jobs/platforms
│   │   ├── speech.js          # POST /api/speech/transcribe(-only)
│   │   └── user.js            # GET /api/user/profile
│   └── services/
│       ├── agent.js           # Gemini agentic loop + tools
│       ├── conversation.js    # Onboarding conversation logic
│       ├── gcpSpeech.js       # STT wrapper
│       ├── gemini.js          # Gemini JSON response wrapper
│       ├── tts.js             # TTS wrapper (Chirp3-HD)
│       └── youtube.js         # YouTube course search
│
└── FRONTENDOFSAKSHAM/
    └── src/
        ├── components/
        │   ├── AgentChat.tsx  # Voice-first agent chat component
        │   └── Header.tsx
        ├── pages/
        │   ├── CareerGuidePage.tsx  # Main 3-step wizard
        │   ├── LandingPage.tsx
        │   └── ProfilePage.tsx
        ├── contexts/          # Theme, Language
        └── i18n/              # Hindi/English translations
```

---

## 🔑 Environment Variables

### Backend (`career-guide-backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://...
GOOGLE_PROJECT_ID=your-gcp-project-id
GCP_CREDENTIALS_JSON={"type":"service_account",...}
YOUTUBE_API_KEY=your-youtube-api-key
CLERK_SECRET_KEY=sk_...
FRONTEND_URLS=http://localhost:5173,https://yourdomain.com
```

### Frontend (`FRONTENDOFSAKSHAM/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_...
```

---

## 📊 Progress Overview

```
Overall Completion: ~75%

Core Voice Pipeline    ████████████████████  100%
AI Agent + Tools       ████████████████░░░░   80%
Frontend UI            ████████████████░░░░   80%
Auth + Data            ██████████████████░░   90%
Onboarding Flow        ████████░░░░░░░░░░░░   40%
Deployment             ░░░░░░░░░░░░░░░░░░░░    0%
AWS Migration          ░░░░░░░░░░░░░░░░░░░░    0%
```

---

## 👨‍💻 Authors

**Saksham & Radhika** — Building Saksham AI 
