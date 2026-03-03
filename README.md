# Saksham 🎯 — AI Voice Career Guide

> A voice-first AI career counselor for Indian women. Speak your background, get personalized career paths, courses, and jobs — all in Hindi, Tamil, Telugu, or Marathi.

[![Status](https://img.shields.io/badge/Status-In%20Development-orange)](.)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Python%20%7C%20React%20%7C%20LangGraph-blue)](.)
[![Auth](https://img.shields.io/badge/Auth-Clerk-purple)](.)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Backend Analysis](#backend-analysis)
- [Frontend Analysis](#frontend-analysis)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Environment Setup](#environment-setup)
- [Running Locally](#running-locally)
- [Deployment Considerations](#deployment-considerations)
- [Future Roadmap](#future-roadmap)

---

## 🎯 Overview

Saksham is an innovative AI-powered career guidance platform specifically designed for Indian women, with a focus on accessibility through voice-first interaction and multi-language support. The platform addresses the unique challenges faced by women in India seeking career opportunities, particularly those with limited digital literacy or English proficiency.

### Key Differentiators

1. **Voice-First Design**: Push-to-talk interface with automatic speech recognition and text-to-speech
2. **Multi-Language Support**: Native support for Hindi, Tamil, Telugu, and Marathi
3. **Education-Aware Job Matching**: Smart filtering based on user's education level
4. **Agentic AI**: LangGraph-powered agent that actively calls tools and controls UI
5. **Government Schemes Integration**: Real-time, career-specific government scheme recommendations
6. **Browser Automation**: Agent can open websites and perform actions on behalf of users

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  React 19 + TypeScript + Tailwind CSS (Port 5173)              │
│  - Voice Recording (MediaRecorder API)                          │
│  - Multi-language UI (4 Indian languages)                       │
│  - Theme Support (Dark/Light)                                   │
│  - Clerk Authentication                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────────────┐
│                      Backend Layer (Node.js)                    │
│  Express 5 Server (Port 5000)                                   │
│  - API Gateway & Rate Limiting                                  │
│  - Clerk Auth Middleware                                        │
│  - MongoDB Integration                                          │
│  - GCP Speech/TTS Services                                      │
└────────┬───────────────────────────────┬────────────────────────┘
         │                               │
         │ HTTP                          │ MongoDB Atlas
         │                               │
┌────────▼────────────────────┐  ┌──────▼──────────────────────┐
│  Agent Service (Python)     │  │   Database Layer            │
│  FastAPI (Port 8000)        │  │   - UserProfile Collection  │
│  - LangGraph State Machine  │  │   - Session Collection      │
│  - Gemini 2.0 Flash         │  │   - Chat History            │
│  - 5 Agent Tools            │  └─────────────────────────────┘
│  - Browser Automation       │
│  - GCP STT/TTS              │
└─────────────────────────────┘
         │
         │ Playwright
         │
┌────────▼────────────────────┐
│  Browser Automation Layer   │
│  - Headless Chrome          │
│  - Session Persistence      │
│  - Credential Management    │
└─────────────────────────────┘
```

### Data Flow

1. **Voice Input Flow**:
   ```
   User speaks → MediaRecorder → WebM/Opus → Backend → Python Agent → GCP Speech API → Text
   ```

2. **Agent Processing Flow**:
   ```
   Text → LangGraph Agent → Gemini 2.0 → Tool Calls → Results → Response Generation
   ```

3. **Voice Output Flow**:
   ```
   Agent Response → GCP Chirp3-HD TTS → Base64 Audio → Frontend → Audio Playback
   ```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.5.3 | Type Safety |
| Vite | 5.4.2 | Build Tool & Dev Server |
| Tailwind CSS | 3.4.1 | Styling |
| Framer Motion | 12.34.3 | Animations |
| React Router | 7.13.1 | Routing |
| Clerk React | 5.61.1 | Authentication |
| Lucide React | 0.344.0 | Icons |

### Backend (Node.js)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Express | 5.2.1 | Web Framework |
| Mongoose | 9.2.1 | MongoDB ODM |
| Clerk Express | 1.7.73 | Auth Middleware |
| AWS SDK | 3.997.0 | AWS Services (Planned) |
| Google Cloud APIs | Latest | Speech, TTS, Vertex AI |
| Express Rate Limit | 8.2.1 | API Protection |
| Multer | 2.0.2 | File Upload |
| CORS | 2.8.6 | Cross-Origin Requests |

### Agent Service (Python)
| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | Latest | API Framework |
| LangGraph | Latest | Agent State Machine |
| LangChain | Latest | LLM Framework |
| Gemini 2.0 Flash | Latest | LLM Model |
| Playwright | Latest | Browser Automation |
| Google Cloud Speech | Latest | Speech-to-Text |
| Google Cloud TTS | Latest | Text-to-Speech (Chirp3-HD) |
| Pydantic | Latest | Data Validation |

### Database
| Technology | Purpose |
|-----------|---------|
| MongoDB Atlas | Primary Database |
| Mongoose | ODM & Schema Validation |

### Cloud Services
| Service | Provider | Purpose |
|---------|----------|---------|
| Speech-to-Text | Google Cloud | Multi-language transcription |
| Text-to-Speech (Chirp3-HD) | Google Cloud | Natural voice synthesis |
| Vertex AI (Gemini 2.0) | Google Cloud | LLM for agent & schemes |
| Authentication | Clerk | User management |
| Database | MongoDB Atlas | Data persistence |

### Planned Migrations
- AWS Transcribe (replacing GCP Speech)
- AWS Bedrock (replacing Vertex AI)
- AWS S3 (audio storage)
- AWS Amplify (frontend hosting)
- AWS EC2 (backend hosting)

---

## ✨ Features

### Core Voice Pipeline ✅
- **Push-to-Talk Interface**: Browser-based voice recording with visual feedback
- **Multi-Language STT**: GCP Speech API supporting Hindi, Tamil, Telugu, Marathi + English fallback
- **AI Career Suggestions**: Gemini 2.0 Flash analyzes voice transcript and suggests career paths
- **Continuous Voice Loop**: Mic → STT → Agent → TTS → Auto-listen cycle
- **Auto-Listen Mode**: Mic automatically activates after agent finishes speaking (toggleable)
- **Natural Voice Output**: GCP Chirp3-HD TTS with Aoede voice for all 4 languages

### AI Agent (LangGraph) ✅
- **True Agentic Behavior**: Python LangGraph + FastAPI agent service (port 8000)
- **Guaranteed Tool Execution**: Agent always calls tools, never just describes actions
- **5 Powerful Tools**:
  1. `get_filtered_courses` - YouTube & Udemy courses filtered by language & level
  2. `get_filtered_jobs` - Smart job platforms filtered by education level
  3. `get_govt_schemes` - Real-time Gemini-powered government scheme recommendations
  4. `trigger_ui_action` - Controls frontend UI (scroll, highlight, open URLs)
  5. `browse_website` - Automated browser actions (search, apply, register)
- **UI Control**: Agent can scroll to sections, highlight them, open URLs in browser
- **State Machine**: LangGraph graph with agent → tools → agent loop
- **Voice-Optimized Responses**: Short, warm, conversational (no markdown)
- **Browser Automation**: Playwright-based headless browser for complex web interactions

### Multi-Language Support ✅
- **4 Indian Languages**: Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी)
- **Full UI Translation**: All strings translated in `translations.ts`
- **Language-Aware STT**: Correct language code per user selection
- **Language-Aware TTS**: Chirp3-HD voices per language (Aoede voice)
- **Agent Language Enforcement**: System prompt ensures responses in chosen language
- **Govt Schemes Translation**: Scheme names, benefits, eligibility in user's language
- **Persistent Preference**: localStorage saves language across sessions

### Smart Job Matching ✅
Education-based platform filtering:

**Padha nahi / 5th tak**:
- Apna App (local jobs, Hindi support)
- WorkIndia (blue collar jobs)
- Urban Company (home-based work)
- WhatsApp networking tip

**10th tak**:
- Apna App
- WorkIndia
- JustDial (local employers)
- Meesho (reselling)
- WhatsApp tip

**12th/College**:
- LinkedIn (professional jobs)
- Apna App
- Upwork (freelance)
- Fiverr (gig-based)

All links are direct registration/application URLs (no landing pages).

### Voice Onboarding Flow ✅
- **Dedicated Onboarding Page**: `/onboarding` route
- **5 Voice Questions**: Name, age, education, smartphone use, English level
- **MongoDB State Management**: Already collected fields never re-asked
- **Resume on Refresh**: Picks up from where user left off
- **Auto-Redirect**: After profile complete → `/guide` automatically
- **Profile Guard**: `/guide` checks completeness, redirects to `/onboarding` if needed
- **Auto-Listen**: Mic auto-activates after each agent question

### Frontend Features ✅
- **3-Step Wizard**: Record → Choose Career → Courses & Jobs
- **AgentChat Component**: Voice-first chat with 4 mic states (idle/recording/thinking/speaking)
- **UI Highlighting**: Courses/jobs/schemes sections highlight + scroll when agent triggers
- **Dark/Light Mode**: Full theme support with ThemeContext
- **Language Dropdown**: Native script labels in header
- **Custom Logo**: Woman silhouette logo
- **Responsive Design**: Mobile-friendly layout
- **Profile Page**: Shows onboarding data with edit capability
- **Session History**: Past career sessions saved

### Authentication & Data ✅
- **Clerk Authentication**: Sign in/out, protected routes
- **MongoDB Sessions**: Career sessions with chat history + courses
- **UserProfile Schema**: Comprehensive user data model
- **Profile Completeness Check**: Guards against incomplete onboarding
- **Rate Limiting**: 100 requests per 15 min on `/api` routes

---

## 📁 Project Structure

```
Career-Guide/
├── career-guide-backend/              # Node.js Backend
│   ├── server.js                      # Express server entry point
│   ├── package.json                   # Node dependencies
│   ├── .env                           # Environment variables
│   ├── .env.example                   # Environment template
│   │
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   │
│   ├── models/
│   │   ├── Session.js                 # Career session schema
│   │   └── UserProfile.js             # User profile schema
│   │
│   ├── routes/
│   │   ├── agent.js                   # POST /api/agent/chat → Python service
│   │   ├── career.js                  # POST /api/career/suggest
│   │   ├── conversation.js            # Voice onboarding endpoints
│   │   ├── courses.js                 # POST /api/courses/suggest
│   │   ├── jobs.js                    # POST /api/jobs/platforms
│   │   ├── speech.js                  # POST /api/speech/transcribe
│   │   └── user.js                    # GET /api/user/profile
│   │
│   ├── services/
│   │   ├── conversation.js            # Onboarding conversation logic
│   │   ├── gcpSpeech.js               # STT wrapper
│   │   ├── gemini.js                  # Gemini JSON response wrapper
│   │   ├── tts.js                     # TTS wrapper (Chirp3-HD)
│   │   └── youtube.js                 # YouTube course search
│   │
│   └── agent_service/                 # Python LangGraph Agent
│       ├── main.py                    # FastAPI app (port 8000)
│       ├── agent.py                   # LangGraph state machine
│       ├── tools.py                   # 5 agent tools
│       ├── browser.py                 # Browser automation logic
│       ├── browser_runner.py          # Subprocess runner for browser
│       ├── requirements.txt           # Python dependencies
│       ├── .env                       # Python service env vars
│       └── .browser_sessions/         # Persistent browser sessions
│           └── linkedin/              # Site-specific sessions
│
└── FrontendOfSaksham/                 # React Frontend
    ├── package.json                   # Frontend dependencies
    ├── vite.config.ts                 # Vite configuration
    ├── tailwind.config.js             # Tailwind CSS config
    ├── tsconfig.json                  # TypeScript config
    ├── .env                           # Frontend env vars
    ├── .env.example                   # Frontend env template
    │
    ├── public/
    │   ├── logo.png                   # App logo
    │   └── hero-video.mp4             # Landing page video
    │
    └── src/
        ├── main.tsx                   # App entry point
        ├── App.tsx                    # Root component with routing
        ├── index.css                  # Global styles
        │
        ├── components/
        │   ├── AgentChat.tsx          # Voice-first agent chat
        │   └── Header.tsx             # Language dropdown + theme toggle
        │
        ├── pages/
        │   ├── LandingPage.tsx        # Public landing page
        │   ├── OnboardingPage.tsx     # Voice onboarding flow
        │   ├── CareerGuidePage.tsx    # Main 3-step wizard
        │   └── ProfilePage.tsx        # User profile + history
        │
        ├── contexts/
        │   ├── LanguageContext.tsx    # 4-language support
        │   └── ThemeContext.tsx       # Dark/light theme
        │
        ├── i18n/
        │   └── translations.ts        # All UI strings in 4 languages
        │
        └── types/
            └── index.ts               # TypeScript type definitions
```

---

## 🔍 Backend Analysis

### Node.js Backend (Express)

#### Server Architecture (`server.js`)
```javascript
// Middleware Stack (Order Matters!)
1. CORS - Whitelist frontend origins
2. JSON Parser - Body parsing
3. Clerk Middleware - Authentication
4. MongoDB Connection - Database
5. Rate Limiter - 100 req/15min
6. Route Handlers - API endpoints
```

#### Key Design Decisions

1. **Clerk Integration**: Uses `@clerk/express` for JWT-based authentication
   - `clerkMiddleware()` - Adds auth context to all requests
   - `requireAuth()` - Protects sensitive routes

2. **CORS Configuration**: Dynamic origin validation from env variable
   ```javascript
   origin: function (origin, callback) {
     if (!origin || allowedOrigins.includes(origin)) {
       callback(null, true);
     }
   }
   ```

3. **Rate Limiting**: Express-rate-limit protects against abuse
   - Window: 15 minutes
   - Max requests: 100
   - Applied to all `/api` routes

#### Route Handlers

**`/api/conversation`** (Onboarding)
- `POST /profile` - Get/create user profile
- `POST /chat` - Voice onboarding conversation
- Handles 5-question flow with state management

**`/api/agent`** (LangGraph Agent)
- `POST /chat` - Proxies to Python agent service (port 8000)
- Forwards user message, history, context, courses, jobs, schemes
- Returns agent response with audio, UI actions, updated data

**`/api/speech`** (Voice Processing)
- `POST /transcribe` - Audio → Text (GCP Speech API)
- `POST /transcribe-only` - Standalone transcription
- Handles WebM/Opus audio format

**`/api/career`** (Career Suggestions)
- `POST /suggest` - Gemini analyzes transcript → career paths
- Returns 3-5 career options with reasoning

**`/api/courses`** (Course Recommendations)
- `POST /suggest` - YouTube + Udemy course links
- Filtered by language and level

**`/api/jobs`** (Job Platforms)
- `POST /platforms` - Education-aware job platform list
- Smart filtering based on user's education level

**`/api/user`** (User Management)
- `GET /profile` - Fetch user profile
- `PUT /profile` - Update profile

---

### Python Agent Service (FastAPI + LangGraph)

#### Architecture Overview

The agent service is the brain of Saksham, implementing a sophisticated agentic AI system using LangGraph.

#### Core Components

**1. FastAPI Server (`main.py`)**
```python
Endpoints:
- GET  /health          # Health check
- POST /transcribe      # Audio → Text
- POST /chat            # Main agent endpoint
- POST /speak           # Text → Audio
- POST /credentials     # Save site login credentials
```

**2. LangGraph State Machine (`agent.py`)**

```python
State Definition:
class AgentState(TypedDict):
    messages: list              # Conversation history
    language: str               # User's language
    selected_career: str        # Chosen career path
    user_transcript: str        # Voice background
    courses: list               # Current courses
    jobs: list                  # Current job platforms
    schemes: list               # Current govt schemes
    ui_actions: list            # UI control actions
    education_level: str        # User's education
```

**Graph Flow**:
```
┌─────────┐     ┌──────────┐     ┌─────────┐
│  Agent  │────▶│  Tools   │────▶│  Agent  │
│  Node   │     │  Node    │     │  Node   │
└─────────┘     └──────────┘     └─────────┘
     │               │                 │
     │               │                 │
     ▼               ▼                 ▼
  Gemini 2.0    Tool Execution    Final Response
```

**3. Agent Tools (`tools.py`)**

Five powerful tools that the agent can call:

**a) `get_filtered_courses`**
```python
Purpose: Find courses filtered by language and level
Args:
  - career: Career name
  - language: hindi/tamil/telugu/marathi/english
  - level: beginner/intermediate/advanced
Returns: YouTube + Udemy course links
```

**b) `get_filtered_jobs`**
```python
Purpose: Get job platforms filtered by education level
Args:
  - career: Career name
  - job_type: local/freelance/professional
  - education_level: padha nahi/5th tak/10th tak/12th/college
Returns: Smart-filtered platform list with tips
Logic:
  - Padha nahi/5th → Apna, WorkIndia, Urban Company
  - 10th → + JustDial, Meesho
  - 12th/College → LinkedIn, Upwork, Fiverr
```

**c) `get_govt_schemes`**
```python
Purpose: Get career-specific government schemes
Args:
  - career: Career name
  - education_level: User's education
  - language: Response language
Process:
  1. Calls Gemini 2.0 with career context
  2. Gemini finds 4 most relevant schemes
  3. Returns translated scheme details
Fallback: PMKVY, MUDRA, Skill India, Startup India
```

**d) `trigger_ui_action`**
```python
Purpose: Control frontend UI
Args:
  - action: scroll_to_courses/jobs/schemes/open_url
  - url: URL to open (for open_url action)
Returns: Action trigger confirmation
```

**e) `browse_website`**
```python
Purpose: Automated browser actions
Args:
  - task: What to do (e.g., "search jobs and apply")
  - url: Starting URL
Process:
  1. Spawns Playwright browser subprocess
  2. Executes task with up to 12 steps
  3. Handles login, search, form filling
  4. Returns screenshot + summary
Special Cases:
  - needs_credentials → Prompts user for login
  - needs_human → Opens URL for manual action
  - CAPTCHA/OTP → Falls back to manual
```

#### Agent Behavior

**System Prompt Strategy**:
- Language-specific instructions enforce response language
- Tool usage rules are explicit and mandatory
- Agent MUST call tools, never just describe actions
- Short, warm responses (2-3 sentences)
- No markdown in responses (voice-friendly)

**Tool Calling Logic**:
```python
User Intent → Tool Mapping:
- "jobs/kaam/naukri" → get_filtered_jobs + trigger_ui_action
- "courses/seekhna" → get_filtered_courses + trigger_ui_action
- "schemes/yojana" → get_govt_schemes + trigger_ui_action
- "website/link" → browse_website or trigger_ui_action
```

**State Management**:
- LangGraph maintains conversation state
- Tool results update state (courses, jobs, schemes, ui_actions)
- State persists across agent → tools → agent loop

#### Voice Processing

**Speech-to-Text**:
```python
Input: WebM/Opus audio bytes
Process: GCP Speech API with language code
Config:
  - encoding: WEBM_OPUS
  - sample_rate: 48000
  - language: User's selected language
  - alternative: en-IN (fallback)
  - punctuation: Enabled
Output: Transcribed text
```

**Text-to-Speech**:
```python
Input: Agent response text
Process: GCP Chirp3-HD TTS
Voice: Aoede (natural female voice)
Languages: hi-IN, ta-IN, te-IN, mr-IN, en-IN
Output: Base64-encoded MP3 audio
```

---

## 🎨 Frontend Analysis

### React Architecture

#### Core Technologies
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety across codebase
- **Vite**: Lightning-fast dev server and build tool
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations

#### Application Structure

**1. Entry Point (`main.tsx`)**
```typescript
StrictMode → App Component
- Enables React strict mode for development
- Mounts to #root element
```

**2. Root Component (`App.tsx`)**
```typescript
Provider Hierarchy:
BrowserRouter
  └─ ThemeProvider
      └─ LanguageProvider
          └─ ClerkProvider
              └─ Routes
```

**Key Features**:
- **GuideGuard**: Checks profile completeness before allowing access to `/guide`
- **Protected Routes**: All main routes require authentication
- **Auto-Redirect**: Incomplete profiles → `/onboarding`

#### Context Providers

**1. ThemeContext**
```typescript
Features:
- Dark/Light mode toggle
- localStorage persistence
- System preference detection
- CSS class-based theming
```

**2. LanguageContext**
```typescript
Features:
- 4 language support (Hindi, Tamil, Telugu, Marathi)
- Translation lookup from translations.ts
- localStorage persistence
- Language-specific formatting
```

#### Page Components

**1. LandingPage**
```typescript
Purpose: Public homepage
Features:
- Hero section with video background
- Feature highlights
- CTA to sign in
- Responsive design
```

**2. OnboardingPage**
```typescript
Purpose: Voice-based profile collection
Flow:
1. Agent greets user
2. Asks 5 questions (name, age, education, smartphone, English)
3. Saves to MongoDB after each answer
4. Auto-redirects to /guide when complete

State Management:
- Fetches existing profile on mount
- Skips already-answered questions
- Resumes from last incomplete field
- Shows progress indicator

Voice Integration:
- Auto-listen after agent speaks
- Push-to-talk for user responses
- Real-time transcription display
```

**3. CareerGuidePage**
```typescript
Purpose: Main 3-step career guidance wizard

Step 1: Record Background
- Voice recording interface
- Transcription display
- Language selection
- Submit to get career suggestions

Step 2: Choose Career
- Display 3-5 career options
- Career cards with descriptions
- Select career → triggers agent chat
- Shows courses, jobs, schemes sections

Step 3: Explore Resources
- AgentChat component (voice-first)
- Courses section (YouTube + Udemy)
- Jobs section (smart-filtered platforms)
- Govt Schemes section (career-specific)
- UI highlighting on agent trigger

Features:
- Session persistence (MongoDB)
- Chat history
- Auto-scroll to sections
- Responsive layout
```

**4. ProfilePage**
```typescript
Purpose: User profile and history
Displays:
- Name, age, education
- Digital literacy, English level
- Preferred language
- Profile completeness status
- Past career sessions
- Edit profile button (→ /onboarding)

Features:
- Fetches from MongoDB
- Shows incomplete warning
- Session history with timestamps
```

#### Key Components

**1. Header**
```typescript
Features:
- App logo
- Language dropdown (native scripts)
- Theme toggle (sun/moon icon)
- User menu (Clerk UserButton)
- Responsive navigation

Language Dropdown:
- हिंदी (Hindi)
- தமிழ் (Tamil)
- తెలుగు (Telugu)
- मराठी (Marathi)
```

**2. AgentChat**
```typescript
Purpose: Voice-first AI chat interface

Mic States:
1. Idle: Ready to record (gray)
2. Recording: User speaking (red pulse)
3. Thinking: Processing (orange spin)
4. Speaking: Agent talking (green pulse)

Features:
- Push-to-talk recording
- Auto-listen mode (toggle)
- Real-time transcription
- Audio playback
- Chat history display
- Scroll to bottom on new messages

Voice Flow:
1. User holds mic button
2. Records audio (MediaRecorder)
3. Sends to backend
4. Displays transcript
5. Agent processes
6. Plays audio response
7. Auto-activates mic (if enabled)

UI Actions:
- scroll_to_courses → Scrolls + highlights courses
- scroll_to_jobs → Scrolls + highlights jobs
- scroll_to_schemes → Scrolls + highlights schemes
- open_url → Opens URL in new tab
- needs_credentials → Shows login form
- browser_result → Shows task completion
```

#### Styling Approach

**Tailwind CSS**:
```css
Theme Colors:
- Primary: Orange (#f97316)
- Background: Gray-50 (light) / Gray-950 (dark)
- Text: Gray-900 (light) / Gray-50 (dark)
- Accent: Orange-500

Responsive Breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
```

**Dark Mode**:
- Class-based: `dark:` prefix
- Applies to all components
- Smooth transitions

#### State Management

**Local State**:
- React useState for component state
- useEffect for side effects
- useRef for DOM references

**Context State**:
- Theme (dark/light)
- Language (4 options)
- User (Clerk)

**Server State**:
- Fetched from backend APIs
- No global state library (React Query could be added)
- Direct fetch calls with error handling

#### API Integration

**Base URL**: `http://localhost:5000/api`

**Authentication**:
```typescript
const token = await getToken(); // Clerk
headers: { Authorization: `Bearer ${token}` }
```

**Key Endpoints Used**:
```typescript
POST /conversation/profile  # Get/create profile
POST /conversation/chat     # Onboarding chat
POST /agent/chat            # Main agent chat
POST /speech/transcribe     # Audio → Text
POST /career/suggest        # Get career options
GET  /user/profile          # Fetch profile
```

#### Performance Optimizations

1. **Code Splitting**: React.lazy for route-based splitting (not yet implemented)
2. **Vite Optimization**: Fast HMR and optimized builds
3. **Tailwind Purging**: Unused CSS removed in production
4. **Image Optimization**: Logo and assets optimized

#### Accessibility Considerations

1. **Voice-First**: Reduces need for typing
2. **Multi-Language**: Native language support
3. **High Contrast**: Dark mode for low vision
4. **Keyboard Navigation**: All interactive elements accessible
5. **Screen Reader**: Semantic HTML (could be improved)

---

## 🗄️ Database Schema

### MongoDB Collections

#### UserProfile Collection
```javascript
{
  userId: String,              // Clerk user ID (unique)
  
  // Onboarding Data
  name: String,                // User's name
  age: String,                 // Age
  education: String,           // padha nahi | 5th tak | 10th tak | 12th/college
  digitalLiteracy: Boolean,    // Can use smartphone?
  englishLevel: String,        // bilkul nahi | thoda | achha
  
  // Preferences
  preferredLanguage: String,   // hindi | tamil | telugu | marathi | english
  workPreference: String,      // remote | offline | both
  hoursPerDay: Number,         // Available hours per day
  interests: String,           // User interests
  transcript: String,          // Voice background transcript
  
  // Metadata
  profileComplete: Boolean,    // Onboarding finished?
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId`: Unique index for fast lookups

**Validation**:
- `education`: Enum validation
- `englishLevel`: Enum validation
- `preferredLanguage`: Enum validation

#### Session Collection
```javascript
{
  userId: String,              // Clerk user ID
  
  // Career Session Data
  transcript: String,          // Voice background
  careers: Array,              // Suggested career options
  chosenCareer: String,        // Selected career
  
  // Resources
  courses: Array,              // Course recommendations
  jobPlatforms: Array,         // Job platform list
  
  // Agent Conversation
  chatHistory: [
    {
      role: String,            // user | assistant
      content: String,         // Message content
      timestamp: Date
    }
  ],
  
  // Preferences
  preferredLanguage: String,   // Session language
  preferredJobType: String,    // local | freelance | both
  courseLevel: String,         // beginner | intermediate | advanced
  
  // Metadata
  createdAt: Date
}
```

**Indexes**:
- `userId`: Index for user's sessions
- `createdAt`: Index for sorting by date

**Usage**:
- One session per career exploration
- Stores complete conversation history
- Persists courses and jobs shown
- Enables session history on profile page

### Data Flow

**Onboarding Flow**:
```
1. User signs in (Clerk)
2. Frontend checks /api/conversation/profile
3. If no profile → Create empty UserProfile
4. Agent asks questions
5. Each answer → Update UserProfile
6. After 5 questions → Set profileComplete = true
7. Redirect to /guide
```

**Career Session Flow**:
```
1. User records background
2. POST /api/career/suggest → Get careers
3. User selects career
4. Create new Session document
5. Agent chat → Update Session.chatHistory
6. Tools called → Update Session.courses/jobPlatforms
7. Session persists for history
```

### Database Connection

**Configuration** (`config/db.js`):
```javascript
mongoose.connect(process.env.MONGO_URI)
- Connection string from MongoDB Atlas
- Auto-reconnect enabled
- Error handling with process.exit(1)
```

**Connection String Format**:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

---

## 🔌 API Endpoints

### Authentication
All endpoints except `/health` and `/api/conversation/*` require Clerk JWT token in `Authorization: Bearer <token>` header.

### Conversation Endpoints (Onboarding)

#### `POST /api/conversation/profile`
Get or create user profile.

**Request**:
```json
{
  "userId": "clerk_user_id"
}
```

**Response**:
```json
{
  "profile": {
    "userId": "clerk_user_id",
    "name": "Priya",
    "age": "25",
    "education": "10th tak",
    "digitalLiteracy": true,
    "englishLevel": "thoda",
    "preferredLanguage": "hindi",
    "profileComplete": true,
    "createdAt": "2026-03-01T10:00:00Z"
  }
}
```

#### `POST /api/conversation/chat`
Voice onboarding conversation.

**Request**:
```json
{
  "userId": "clerk_user_id",
  "message": "Mera naam Priya hai",
  "language": "hindi"
}
```

**Response**:
```json
{
  "message": "Bahut achha Priya! Aapki umar kya hai?",
  "audio": "base64_encoded_audio",
  "profile": { /* updated profile */ },
  "complete": false
}
```

### Agent Endpoints

#### `POST /api/agent/chat`
Main agent chat (proxies to Python service).

**Request**:
```json
{
  "message": "Mujhe jobs chahiye",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Namaste!" }
  ],
  "context": {
    "language": "hindi",
    "selectedCareer": "Web Developer",
    "transcript": "Main 12th pass hoon...",
    "educationLevel": "12th/college"
  },
  "courses": [],
  "jobs": [],
  "schemes": []
}
```

**Response**:
```json
{
  "message": "Main aapke liye jobs dhoondh rahi hoon...",
  "audio": "base64_encoded_audio",
  "action": "scroll_to_jobs",
  "actionPayload": {
    "url": null
  },
  "history": [ /* updated history */ ],
  "courses": [],
  "jobs": [
    {
      "name": "LinkedIn",
      "url": "https://linkedin.com/jobs/...",
      "type": "full-time",
      "tip": "Professional jobs",
      "isTip": false
    }
  ],
  "schemes": [],
  "allUiActions": [ /* all UI actions */ ]
}
```

### Speech Endpoints

#### `POST /api/speech/transcribe`
Transcribe audio to text.

**Request**:
- `Content-Type: multipart/form-data`
- `audio`: Audio file (WebM/Opus)
- `language`: Language code (hindi/tamil/telugu/marathi)

**Response**:
```json
{
  "transcript": "Main web developer banna chahti hoon"
}
```

#### `POST /api/speech/transcribe-only`
Standalone transcription (same as above).

### Career Endpoints

#### `POST /api/career/suggest`
Get career suggestions from transcript.

**Request**:
```json
{
  "transcript": "Main 12th pass hoon aur computer mein interest hai",
  "language": "hindi"
}
```

**Response**:
```json
{
  "careers": [
    {
      "title": "Web Developer",
      "description": "Websites aur apps banao",
      "skills": ["HTML", "CSS", "JavaScript"],
      "salary": "₹3-8 LPA"
    },
    {
      "title": "Digital Marketing",
      "description": "Online marketing aur social media",
      "skills": ["SEO", "Social Media", "Content"],
      "salary": "₹2-6 LPA"
    }
  ]
}
```

### Course Endpoints

#### `POST /api/courses/suggest`
Get course recommendations.

**Request**:
```json
{
  "career": "Web Developer",
  "language": "hindi",
  "level": "beginner"
}
```

**Response**:
```json
{
  "courses": [
    {
      "title": "Web Developer - Beginner Course (Hindi)",
      "platform": "YouTube",
      "url": "https://youtube.com/results?search_query=...",
      "level": "beginner"
    },
    {
      "title": "Web Developer Complete Tutorial",
      "platform": "Udemy",
      "url": "https://udemy.com/courses/search/?q=...",
      "level": "beginner"
    }
  ]
}
```

### Job Endpoints

#### `POST /api/jobs/platforms`
Get job platforms filtered by education.

**Request**:
```json
{
  "career": "Web Developer",
  "educationLevel": "12th/college",
  "jobType": "both"
}
```

**Response**:
```json
{
  "platforms": [
    {
      "name": "LinkedIn",
      "url": "https://linkedin.com/jobs/search/?keywords=web+developer",
      "type": "full-time",
      "tip": "Professional jobs — profile banao aur apply karo",
      "isTip": false
    },
    {
      "name": "Upwork",
      "url": "https://upwork.com/freelancer/registration",
      "type": "freelance",
      "tip": "Freelance clients internationally",
      "isTip": false
    },
    {
      "name": "WhatsApp Tip",
      "url": null,
      "type": "tip",
      "tip": "Apne 10 contacts ko message karo: 'Main Web Developer ka kaam karti hoon'",
      "isTip": true
    }
  ]
}
```

### User Endpoints

#### `GET /api/user/profile`
Get user profile.

**Response**:
```json
{
  "profile": { /* UserProfile document */ }
}
```

#### `PUT /api/user/profile`
Update user profile.

**Request**:
```json
{
  "name": "Priya Sharma",
  "age": "26",
  "education": "12th/college"
}
```

**Response**:
```json
{
  "profile": { /* updated UserProfile */ }
}
```

### Health Check

#### `GET /health`
Backend health check.

**Response**:
```json
{
  "status": "ok"
}
```

#### `GET /api/agent/health` (Python service)
Agent service health check.

**Response**:
```json
{
  "status": "ok",
  "service": "Saksham LangGraph Agent"
}
```

---

## 🔑 Environment Setup

### Backend Environment Variables

Create `career-guide-backend/.env`:

```env
# Server Configuration
PORT=5000
FRONTEND_URLS=http://localhost:5173,https://yourdomain.com

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Google Cloud Platform
GOOGLE_PROJECT_ID=your-gcp-project-id
GCP_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"..."}

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_...

# Python Agent Service
PYTHON_AGENT_URL=http://localhost:8000
```

### Python Agent Service Environment Variables

Create `career-guide-backend/agent_service/.env`:

```env
# Google Cloud Platform
GOOGLE_PROJECT_ID=your-gcp-project-id
GCP_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"..."}

# YouTube API (for course search)
YOUTUBE_API_KEY=your-youtube-api-key
```

### Frontend Environment Variables

Create `FrontendOfSaksham/.env`:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Getting API Keys

#### 1. Google Cloud Platform (GCP)

**Services Needed**:
- Speech-to-Text API
- Text-to-Speech API
- Vertex AI API

**Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable APIs:
   - Cloud Speech-to-Text API
   - Cloud Text-to-Speech API
   - Vertex AI API
4. Create Service Account:
   - IAM & Admin → Service Accounts → Create
   - Grant roles: Speech Admin, Vertex AI User
   - Create JSON key
5. Copy JSON key content to `GCP_CREDENTIALS_JSON`

#### 2. MongoDB Atlas

**Steps**:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Database Access → Add user (username + password)
4. Network Access → Add IP (0.0.0.0/0 for development)
5. Connect → Get connection string
6. Replace `<username>`, `<password>`, `<database>` in connection string

#### 3. Clerk Authentication

**Steps**:
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application
3. Get API keys:
   - Backend: Secret Key (`CLERK_SECRET_KEY`)
   - Frontend: Publishable Key (`VITE_CLERK_PUBLISHABLE_KEY`)
4. Configure allowed origins in Clerk dashboard

#### 4. YouTube Data API

**Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable YouTube Data API v3
3. Credentials → Create API Key
4. Restrict key to YouTube Data API v3
5. Copy API key to `YOUTUBE_API_KEY`

---

## ▶️ Running Locally

### Prerequisites

- **Node.js**: v18+ (for backend and frontend)
- **Python**: 3.9+ (for agent service)
- **MongoDB**: Atlas account or local instance
- **GCP Account**: For Speech, TTS, and Vertex AI
- **Clerk Account**: For authentication

### Installation Steps

#### 1. Clone Repository

```bash
git clone <repository-url>
cd Career-Guide
```

#### 2. Backend Setup

```bash
cd career-guide-backend

# Install Node.js dependencies
npm install

# Create .env file (see Environment Setup section)
cp .env.example .env
# Edit .env with your credentials

# Test connection
node server.js
# Should see: "Server running on port 5000" and "MongoDB connected"
```

#### 3. Python Agent Service Setup

```bash
cd career-guide-backend/agent_service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Create .env file
cp .env.example .env
# Edit .env with your GCP credentials

# Test agent service
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
# Should see: "Application startup complete"
```

#### 4. Frontend Setup

```bash
cd FrontendOfSaksham

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Clerk publishable key

# Start dev server
npm run dev
# Should see: "Local: http://localhost:5173"
```

### Running All Services

Open 3 terminal windows:

**Terminal 1 - Python Agent Service**:
```bash
cd career-guide-backend/agent_service
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 - Node.js Backend**:
```bash
cd career-guide-backend
node server.js
```

**Terminal 3 - React Frontend**:
```bash
cd FrontendOfSaksham
npm run dev
```

### Accessing the Application

1. Open browser: `http://localhost:5173`
2. Sign up/Sign in with Clerk
3. Complete voice onboarding
4. Start exploring careers!

### Troubleshooting

**MongoDB Connection Failed**:
- Check `MONGO_URI` in `.env`
- Verify IP whitelist in MongoDB Atlas
- Check username/password

**GCP API Errors**:
- Verify `GCP_CREDENTIALS_JSON` is valid JSON
- Check APIs are enabled in GCP Console
- Verify service account has correct roles

**Clerk Authentication Failed**:
- Check `CLERK_SECRET_KEY` and `VITE_CLERK_PUBLISHABLE_KEY`
- Verify allowed origins in Clerk dashboard
- Check CORS configuration in backend

**Python Agent Not Responding**:
- Check port 8000 is not in use
- Verify Python dependencies installed
- Check `PYTHON_AGENT_URL` in backend `.env`

**Audio Recording Not Working**:
- Check browser permissions for microphone
- Use HTTPS or localhost (required for MediaRecorder)
- Check browser console for errors

---

## 🚀 Deployment Considerations

### Current Architecture (Development)

```
Frontend (Vite Dev Server) → Backend (Node.js) → Agent Service (Python) → GCP APIs
                                    ↓
                              MongoDB Atlas
```

### Production Deployment Strategy

#### Option 1: AWS Migration (Planned)

**Services**:
- **Frontend**: AWS Amplify
- **Backend**: AWS EC2 or ECS
- **Agent Service**: AWS EC2 or Lambda (with container)
- **Database**: MongoDB Atlas (keep) or AWS DocumentDB
- **Speech**: AWS Transcribe (replace GCP Speech)
- **LLM**: AWS Bedrock (replace Vertex AI)
- **Storage**: AWS S3 (for audio files)

**Benefits**:
- Single cloud provider
- Better integration
- Cost optimization
- Scalability

**Migration Steps**:
1. Replace GCP Speech with AWS Transcribe
2. Replace Vertex AI with AWS Bedrock
3. Add S3 for audio storage
4. Deploy backend to EC2/ECS
5. Deploy agent service to EC2/Lambda
6. Deploy frontend to Amplify

#### Option 2: Multi-Cloud (Current)

**Services**:
- **Frontend**: Vercel or Netlify
- **Backend**: Railway or Render
- **Agent Service**: Railway or Render
- **Database**: MongoDB Atlas
- **APIs**: Google Cloud Platform

**Benefits**:
- Faster deployment
- No code changes needed
- Managed services

**Deployment Steps**:

**Frontend (Vercel)**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd FrontendOfSaksham
vercel

# Set environment variables in Vercel dashboard
VITE_CLERK_PUBLISHABLE_KEY=...
```

**Backend (Railway)**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
cd career-guide-backend
railway login
railway init
railway up

# Set environment variables in Railway dashboard
PORT=5000
MONGO_URI=...
GCP_CREDENTIALS_JSON=...
CLERK_SECRET_KEY=...
PYTHON_AGENT_URL=https://agent-service.railway.app
```

**Agent Service (Railway)**:
```bash
cd career-guide-backend/agent_service
railway init
railway up

# Set environment variables
GOOGLE_PROJECT_ID=...
GCP_CREDENTIALS_JSON=...
```

### Environment Variables for Production

**Frontend**:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_API_BASE_URL=https://api.yourdomain.com
```

**Backend**:
```env
PORT=5000
NODE_ENV=production
FRONTEND_URLS=https://yourdomain.com,https://www.yourdomain.com
MONGO_URI=mongodb+srv://...
GOOGLE_PROJECT_ID=...
GCP_CREDENTIALS_JSON=...
YOUTUBE_API_KEY=...
CLERK_SECRET_KEY=sk_live_...
PYTHON_AGENT_URL=https://agent.yourdomain.com
```

**Agent Service**:
```env
GOOGLE_PROJECT_ID=...
GCP_CREDENTIALS_JSON=...
YOUTUBE_API_KEY=...
```

### Security Considerations

**1. API Keys**:
- Never commit `.env` files
- Use environment variables in deployment platforms
- Rotate keys regularly

**2. CORS**:
- Update `FRONTEND_URLS` with production domains
- Remove wildcard origins

**3. Rate Limiting**:
- Current: 100 req/15min
- Production: Consider per-user limits
- Add Redis for distributed rate limiting

**4. Authentication**:
- Use Clerk production keys
- Enable MFA for admin accounts
- Set up webhook verification

**5. Database**:
- Enable MongoDB Atlas IP whitelist
- Use strong passwords
- Enable encryption at rest

**6. HTTPS**:
- Required for microphone access
- Use SSL certificates (Let's Encrypt)
- Enforce HTTPS redirects

### Performance Optimizations

**Frontend**:
- Enable Vite build optimizations
- Implement code splitting
- Add service worker for offline support
- Optimize images and assets
- Enable gzip compression

**Backend**:
- Add Redis caching for frequent queries
- Implement connection pooling
- Enable compression middleware
- Add CDN for static assets

**Agent Service**:
- Implement response caching
- Optimize Gemini prompts
- Add request queuing for high load
- Consider GPU instances for faster inference

### Monitoring & Logging

**Recommended Tools**:
- **Application Monitoring**: Sentry or LogRocket
- **Performance**: New Relic or Datadog
- **Logs**: CloudWatch (AWS) or Logtail
- **Uptime**: UptimeRobot or Pingdom

**Key Metrics to Track**:
- API response times
- Agent processing time
- Speech API latency
- Error rates
- User session duration
- Conversion rates (onboarding completion)

### Scaling Strategy

**Horizontal Scaling**:
- Load balancer for backend (Nginx or AWS ALB)
- Multiple backend instances
- Multiple agent service instances
- Session affinity for WebSocket connections (if added)

**Vertical Scaling**:
- Increase instance sizes for agent service (CPU/RAM)
- Optimize database queries
- Add read replicas for MongoDB

**Cost Optimization**:
- Use spot instances for non-critical workloads
- Implement auto-scaling based on load
- Cache frequently accessed data
- Optimize GCP API usage (batch requests)

---

## 🔮 Future Roadmap

### High Priority

#### 1. Interrupt Handling ⚠️
**Problem**: User can't interrupt agent mid-speech
**Solution**:
- Add stop button during agent speech
- Cancel audio playback on user mic activation
- Clear agent response queue

#### 2. AWS Migration 🔄
**Goal**: Move from GCP to AWS
**Tasks**:
- Replace GCP Speech with AWS Transcribe
- Replace Vertex AI with AWS Bedrock (Claude or Titan)
- Add S3 for audio storage
- Deploy to AWS infrastructure

#### 3. Mongoose Deprecation Warnings 🐛
**Issue**: `new: true` → `returnDocument: 'after'`
**Fix**: Update all `findOneAndUpdate` calls

#### 4. Production Deployment 🚀
**Platforms**:
- Frontend: Vercel/Netlify/AWS Amplify
- Backend: Railway/Render/AWS EC2
- Agent: Railway/Render/AWS Lambda
**Requirements**:
- SSL certificates
- Environment variables
- Monitoring setup

### Medium Priority

#### 5. "More Careers" Feature
**Status**: Tool exists but no UI trigger
**Implementation**:
- Add button in career selection step
- Call `getMoreCareers` tool
- Display additional 3-5 careers

#### 6. Course Level Selection UI
**Current**: User tells agent verbally
**Improvement**:
- Add visual selector (Beginner/Intermediate/Advanced)
- Update courses on selection
- Persist preference

#### 7. Progress Tracking
**Features**:
- Mark courses as completed
- Track learning journey
- Show progress percentage
- Celebrate milestones

#### 8. Sharing Functionality
**Features**:
- Share career path with friends
- Share course recommendations
- Generate shareable link
- WhatsApp/SMS integration

#### 9. Highlighted Job Card
**Current**: Whole section highlights
**Improvement**:
- Specific card glows when agent mentions it
- Smooth scroll to card
- Pulse animation

### Low Priority

#### 10. Advanced Features

**a) Resume Builder**
- Voice-based resume creation
- PDF export
- Multi-language support
- Templates for different careers

**b) Mock Interviews**
- AI-powered interview practice
- Career-specific questions
- Voice-based Q&A
- Feedback and tips

**c) Skill Assessment**
- Quick skill tests
- Career aptitude tests
- Personalized recommendations
- Progress tracking

**d) Community Features**
- Connect with mentors
- Join career-specific groups
- Success stories
- Peer support

**e) Job Application Tracking**
- Track applications
- Follow-up reminders
- Interview scheduling
- Offer management

**f) Notifications**
- New job postings
- Course recommendations
- Scheme updates
- Reminders

### Technical Improvements

#### 11. Code Quality

**Testing**:
- Unit tests (Jest/Vitest)
- Integration tests
- E2E tests (Playwright)
- Property-based tests

**Code Organization**:
- Extract reusable hooks
- Component library
- Shared utilities
- Better error handling

**Performance**:
- Code splitting
- Lazy loading
- Image optimization
- Bundle size reduction

#### 12. Accessibility

**Improvements**:
- Screen reader optimization
- Keyboard navigation
- ARIA labels
- High contrast mode
- Font size controls

#### 13. Analytics

**Metrics**:
- User behavior tracking
- Conversion funnels
- Feature usage
- Error tracking
- Performance monitoring

**Tools**:
- Google Analytics
- Mixpanel
- Hotjar
- Sentry

### Infrastructure

#### 14. DevOps

**CI/CD**:
- GitHub Actions
- Automated testing
- Automated deployment
- Environment management

**Monitoring**:
- Application monitoring
- Error tracking
- Performance monitoring
- Uptime monitoring

**Backup & Recovery**:
- Database backups
- Disaster recovery plan
- Data retention policy

### Localization

#### 15. More Languages

**Potential Additions**:
- Bengali (বাংলা)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Gujarati (ગુજરાતી)
- Punjabi (ਪੰਜਾਬੀ)

**Requirements**:
- GCP TTS support
- UI translations
- Agent prompt translations
- Testing with native speakers

---

## 📊 Progress Overview

### Overall Completion: ~93%

```
Core Voice Pipeline       ████████████████████  100%
AI Agent (LangGraph)      ████████████████████  100%
Multi-Language (4)        ████████████████████  100%
Onboarding Flow           ████████████████████  100%
Smart Job Filtering       ████████████████████  100%
Govt Schemes              ████████████████████  100%
Frontend UI               ████████████████████  100%
Browser Automation        ████████████████████  100%
Auth + Data               ██████████████████░░   90%
AWS Migration             ░░░░░░░░░░░░░░░░░░░░    0%
Deployment                ░░░░░░░░░░░░░░░░░░░░    0%
Testing                   ░░░░░░░░░░░░░░░░░░░░    0%
```

### Feature Status

✅ **Completed**:
- Voice input/output pipeline
- Multi-language support (4 languages)
- LangGraph agent with 5 tools
- Voice onboarding flow
- Smart job platform filtering
- Government schemes integration
- Browser automation
- Profile management
- Session persistence
- Dark/light theme
- Responsive design

⚠️ **In Progress**:
- Interrupt handling
- Mongoose deprecation fixes

❌ **Not Started**:
- AWS migration
- Production deployment
- More careers button
- Course level UI selector
- Progress tracking
- Sharing functionality
- Testing suite
- Analytics integration

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and test locally**
4. **Commit with descriptive messages**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Code Style

**TypeScript/JavaScript**:
- Use ESLint configuration
- Prettier for formatting
- Meaningful variable names
- Add comments for complex logic

**Python**:
- Follow PEP 8
- Type hints where applicable
- Docstrings for functions
- Black for formatting

### Testing Guidelines

**Before submitting PR**:
- Test all 3 services locally
- Test voice recording in multiple browsers
- Test all 4 languages
- Test onboarding flow
- Test agent chat with various queries
- Check console for errors

---

## 📝 License

This project is currently unlicensed. Please contact the authors for usage permissions.

---

## 👥 Authors

**Saksham & Radhika** — Building Saksham AI

For questions or collaboration: [Contact Information]

---

## 🙏 Acknowledgments

- **Google Cloud Platform** - Speech, TTS, and Vertex AI services
- **LangChain & LangGraph** - Agent framework
- **Clerk** - Authentication platform
- **MongoDB** - Database platform
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool
- **React Team** - UI framework

---

## 📚 Additional Resources

### Documentation
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Google Cloud Speech API](https://cloud.google.com/speech-to-text/docs)
- [Google Cloud TTS API](https://cloud.google.com/text-to-speech/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Tutorials
- [Building Voice Apps with Web APIs](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [LangGraph Agent Tutorial](https://langchain-ai.github.io/langgraph/tutorials/)
- [React + TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)

---

## 🐛 Known Issues

1. **Interrupt Handling**: User cannot stop agent mid-speech
2. **Mongoose Warnings**: Deprecation warnings for `new: true` option
3. **Browser Automation**: CAPTCHA and OTP require manual intervention
4. **Audio Format**: Limited to WebM/Opus (browser-dependent)
5. **Mobile Safari**: MediaRecorder API has limited support

---

## 💡 Tips for Developers

### Working with Voice
- Test with real audio, not just text
- Different accents may affect transcription
- Background noise impacts quality
- Use headphones to prevent echo

### Working with LangGraph
- Debug with print statements in agent.py
- Check tool call logs
- Verify state updates
- Test tools independently

### Working with GCP
- Monitor API usage in GCP Console
- Set up billing alerts
- Use service account with minimal permissions
- Cache responses when possible

### Working with MongoDB
- Use indexes for frequent queries
- Monitor connection pool
- Handle connection errors gracefully
- Backup data regularly

---

**Last Updated**: March 1, 2026

**Version**: 1.0.0 (Development)

---

