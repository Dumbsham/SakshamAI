# Saksham 🎯 — AI Voice Career Guide

> A voice-first AI career counselor for Indian women. Speak your background, get personalized career paths, courses, and jobs — all in Hindi, Tamil, Telugu, or Marathi.

[![Status](https://img.shields.io/badge/Status-In%20Development-orange)](.)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20FastAPI%20%7C%20React%20%7C%20LangGraph-blue)](.)
[![Auth](https://img.shields.io/badge/Auth-Clerk-purple)](.)

---

## 🚀 What's Working (Done)

### Core Voice Pipeline
- [x] **Voice Input** — Push-to-talk mic via browser
- [x] **Speech-to-Text** — GCP Speech API (Hindi, Tamil, Telugu, Marathi + English fallback)
- [x] **AI Career Suggestions** — Gemini 2.0 Flash suggests career paths from voice transcript
- [x] **Push-to-Talk Agent** — Continuous voice loop (mic → STT → agent → TTS)
- [x] **Auto-Listen** — Mic auto-activates after agent finishes speaking (toggle ON/OFF)
- [x] **Agent Voice Output** — GCP Chirp3-HD TTS speaks agent responses naturally

### AI Agent (LangGraph)
- [x] **Properly Agentic** — Python LangGraph + FastAPI agent service (port 8000)
- [x] **Guaranteed Tool Execution** — Agent always calls tools, never just says "I will"
- [x] **4 Tools** — `get_filtered_courses`, `get_filtered_jobs`, `get_govt_schemes`, `trigger_ui_action`
- [x] **UI Control** — Agent scrolls to sections, highlights them, opens URLs in browser
- [x] **State Machine** — LangGraph graph with agent → tools → agent loop
- [x] **Voice-Friendly Responses** — Short, warm, no markdown (spoken aloud via TTS)

### Courses & Jobs
- [x] **YouTube Courses** — Language + level filtered search links
- [x] **Udemy Link** — Dynamic Udemy search per career
- [x] **Smart Job Platforms** — Filtered by education level:
  - Padha nahi / 5th tak → Apna App, WorkIndia, Urban Company, WhatsApp Tip
  - 10th tak → Apna App, WorkIndia, JustDial, Meesho, WhatsApp Tip
  - 12th/College → LinkedIn, Apna App, Upwork, Fiverr
- [x] **Direct Registration Links** — No landing pages — straight to register/apply
- [x] **WhatsApp Tip Card** — Actionable local networking advice (no broken link)
- [x] **Govt Schemes** — Gemini-powered real-time career-specific scheme suggestions
- [x] **Govt Schemes UI** — Yellow card section in Step 2, agent-triggered via voice

### Multi-Language Support
- [x] **4 Languages** — Hindi, Tamil, Telugu, Marathi
- [x] **Full UI Translation** — All strings translated in all 4 languages (translations.ts)
- [x] **Language-aware STT** — Correct language code per selection
- [x] **Language-aware TTS** — Chirp3-HD voices per language (Aoede voice)
- [x] **Agent responds in chosen language** — System prompt enforced
- [x] **Govt Schemes in chosen language** — Scheme names, benefits, eligibility translated
- [x] **Language persisted** — localStorage saves preference across sessions

### Onboarding Voice Flow
- [x] **Voice Onboarding Page** — `/onboarding` — agent greets and asks 5 questions by voice
- [x] **5 Questions** — Name, age, education, smartphone use, English level
- [x] **State from MongoDB** — Already collected fields never re-asked
- [x] **Resume on refresh** — Picks up from where user left off
- [x] **Auto-redirect** — After profile complete → `/guide` automatically
- [x] **Profile Guard** — `/guide` checks profile completeness, redirects to `/onboarding` if needed
- [x] **Auto-listen in Onboarding** — Mic auto-on after each agent question

### Frontend
- [x] **3-Step Wizard** — Record → Choose Career → Courses & Jobs
- [x] **AgentChat Component** — Voice-first chat with 4 mic states (idle/recording/thinking/speaking)
- [x] **UI Highlight** — Courses/jobs/schemes sections highlight + scroll when agent triggers
- [x] **Dark/Light Mode** — Full theme support
- [x] **Language Dropdown** — Native script labels (हिंदी, தமிழ், తెలుగు, मराठी)
- [x] **Custom Logo** — Woman silhouette logo in header
- [x] **Responsive Design** — Mobile-friendly

### Auth & Data
- [x] **Clerk Authentication** — Sign in/out, protected routes
- [x] **MongoDB Sessions** — Career sessions saved with chat history + courses
- [x] **UserProfile** — name, age, education, digitalLiteracy, englishLevel, preferredLanguage
- [x] **Profile Page** — Shows onboarding data (naam, umar, padhai, smartphone, english level)
- [x] **Edit Profile Button** — Re-do onboarding from profile page
- [x] **Profile Incomplete Warning** — Shown if onboarding not finished
- [x] **Rate Limiting** — 100 requests per 15 min on `/api`

---

## 🔧 In Progress / Partially Done

- [ ] **Interrupt Handling** — User can't interrupt agent mid-speech cleanly
- [ ] **Mongoose Deprecation Warnings** — `new: true` → `returnDocument: 'after'` fix pending

---

## ❌ Not Yet Built

### Features
- [ ] **"More Careers" Button** — `getMoreCareers` tool exists but no UI trigger
- [ ] **Course Level Selection UI** — User tells agent verbally, no visual selector
- [ ] **Progress Tracking** — Mark courses completed, track learning journey
- [ ] **Sharing** — Share career path / courses with friends
- [ ] **Highlighted job card** — Specific card glows (currently whole section highlights)

### Infrastructure
- [ ] **AWS Migration** — Move from GCP to AWS (Transcribe, Bedrock, S3, Amplify, EC2)
- [ ] **S3 Audio Storage** — Currently audio processed in-memory, not stored
- [ ] **Deployment** — Not deployed yet (Railway / Render / AWS planned)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express 5 |
| Agent Service | Python + FastAPI + LangGraph + LangChain |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini 2.0 Flash (Vertex AI) |
| STT | GCP Speech-to-Text (4 Indian languages) |
| TTS | GCP Chirp3-HD (Aoede voice, 4 languages) |
| Auth | Clerk |
| Planned | AWS Bedrock, AWS Transcribe, S3, Amplify |

---

## 📁 Project Structure

```
Career-Guide/
├── career-guide-backend/
│   ├── server.js
│   ├── models/
│   │   ├── Session.js              # Career sessions + chat history
│   │   └── UserProfile.js          # Onboarding profile data
│   ├── routes/
│   │   ├── agent.js                # POST /api/agent/chat → Python service
│   │   ├── career.js               # POST /api/career/suggest
│   │   ├── conversation.js         # Voice onboarding flow
│   │   ├── courses.js              # POST /api/courses/suggest
│   │   ├── jobs.js                 # POST /api/jobs/platforms
│   │   ├── speech.js               # POST /api/speech/transcribe(-only)
│   │   └── user.js                 # GET /api/user/profile
│   ├── services/
│   │   ├── conversation.js         # Onboarding conversation logic
│   │   ├── gcpSpeech.js            # STT wrapper
│   │   ├── gemini.js               # Gemini JSON response wrapper
│   │   ├── tts.js                  # TTS wrapper (Chirp3-HD)
│   │   └── youtube.js              # YouTube course search
│   └── agent_service/              # Python LangGraph Agent
│       ├── main.py                 # FastAPI app (port 8000)
│       ├── agent.py                # LangGraph state machine
│       └── tools.py                # 4 agent tools
│
└── FRONTENDOFSAKSHAM/
    └── src/
        ├── components/
        │   ├── AgentChat.tsx        # Voice-first agent chat
        │   └── Header.tsx           # Language dropdown + theme toggle
        ├── pages/
        │   ├── CareerGuidePage.tsx  # Main 3-step wizard
        │   ├── LandingPage.tsx
        │   ├── OnboardingPage.tsx   # Voice onboarding flow
        │   └── ProfilePage.tsx      # Profile + stats + history
        ├── contexts/
        │   ├── LanguageContext.tsx  # 4-language support
        │   └── ThemeContext.tsx
        ├── i18n/
        │   └── translations.ts     # All UI strings in 4 languages
        └── types/
            └── index.ts
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
PYTHON_AGENT_URL=http://localhost:8000
```

### Agent Service (`career-guide-backend/agent_service/.env`)

```env
GOOGLE_PROJECT_ID=your-gcp-project-id
GCP_CREDENTIALS_JSON={"type":"service_account",...}
```

### Frontend (`FRONTENDOFSAKSHAM/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_...
```

---

## ▶️ Running Locally

```bash
# Terminal 1 — Python Agent Service
cd career-guide-backend/agent_service
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2 — Node.js Backend
cd career-guide-backend
npm run dev

# Terminal 3 — React Frontend
cd FRONTENDOFSAKSHAM
npm run dev
```

---

## 📊 Progress Overview

```
Overall Completion: ~93%

Core Voice Pipeline    ████████████████████  100%
AI Agent (LangGraph)   ████████████████████  100%
Multi-Language (4)     ████████████████████  100%
Onboarding Flow        ████████████████████  100%
Smart Job Filtering    ████████████████████  100%
Govt Schemes           ████████████████████  100%
Frontend UI            ████████████████████  100%
Auth + Data            ██████████████████░░   90%
AWS Migration          ░░░░░░░░░░░░░░░░░░░░    0%
Deployment             ░░░░░░░░░░░░░░░░░░░░    0%
```

---

## 👩‍💻 Authors

**Saksham & Radhika** — Building Saksham AI
