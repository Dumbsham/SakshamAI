<div align="center">

<img src="https://img.shields.io/badge/Synapse%20X-AI%20Collaboration-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQTEwIDEwIDAgMSAwIDEyIDIyQTEwIDEwIDAgMCAwIDEyIDJNMTIgNEE4IDggMCAxIDEgMTIgMjBBOCA4IDAgMCAxIDEyIDRNMTEgN1YxM0wxNiAxNS41OEwxNy4wMyAxMy44NEwxMyAxMS44NlY3WiIvPjwvc3ZnPg==&logoColor=white" />

# 🧠 Synapse X

### AI-powered team collaboration platform for developers

*Sync your GitHub and Discord. Detect blockers before they happen. Ship faster, together.*

<br/>

[![Live Demo](https://img.shields.io/badge/🔗%20Live%20Demo-Visit%20Now-6366f1?style=for-the-badge)](https://synapse-x.vercel.app)
[![GitHub Stars](https://img.shields.io/github/stars/ShubhamSharma0803/Synapse_X?style=for-the-badge&color=fbbf24&logo=github)](https://github.com/ShubhamSharma0803/Synapse_X/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/ShubhamSharma0803/Synapse_X?style=for-the-badge&color=34d399&logo=github)](https://github.com/ShubhamSharma0803/Synapse_X/network)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge&logo=githubactions)](CONTRIBUTING.md)

<br/>

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/GPT--4o-412991?style=flat-square&logo=openai&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_API-CC785C?style=flat-square&logo=anthropic&logoColor=white)

</div>

---

## 📌 The Problem

Modern dev teams are drowning in noise:

- 🔕 PRs sit unreviewed for days because nobody noticed
- 📢 Standups are stale the moment they're written
- 🕳️ Blockers go undetected until they derail sprints
- 👻 Contribution is invisible — good work goes unrecognized

**Synapse X eliminates all of it.**

---

## ✨ What is Synapse X?

Synapse X is a real-time, AI-driven collaboration platform that bridges your **GitHub** and **Discord** workflows into a single intelligent system. It doesn't just surface information — it acts on it.

> *"No more manually updating the team. No more missed PRs. No more stale standups."*

---

## 🚀 Core Features

### ⚙️ GitHub + Discord Sync
Real-time OAuth integration that automatically tracks PRs, commits, issues, and team chat — **zero manual input required.** The moment something happens in your repo, your team knows.

### 🔔 Smart Nudges
AI detects stalled PRs and blockers before they cascade. It identifies the **right person** to ping and does it automatically — before the team even realizes there's a problem.

### 📈 Predictive Timeline
An AI-generated **ghost-line** overlays your project timeline showing where the project *will be* based on current velocity — not just where it is today. Spot slippage before it happens.

### 🃏 Developer Trading Card Profiles
Gamified developer profiles with **live GitHub stats**, level badges, XP, and contribution scores. Makes tracking progress fun, visible, and rewarding for every team member.

### 🤖 Orb — AI Assistant
A floating contextual AI that:
- Answers team questions in real-time
- Onboards new members automatically
- **Auto-generates daily standups** every morning so no one has to write them

---

## 🧱 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, TypeScript, Vite, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **AI / LLM** | LangChain, GPT-4o, Claude API |
| **Integrations** | GitHub OAuth, Discord.js, Socket.io |
| **Deployment** | Vercel (Frontend), Railway (Backend) |

---

## 🗂️ Project Structure

```
Synapse_X/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── DeveloperCard/   # Trading card profiles
│   │   │   ├── OrbAssistant/    # Floating AI widget
│   │   │   └── Timeline/        # Predictive timeline view
│   │   ├── pages/           # Route-level pages
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Helper functions
│   └── tailwind.config.ts
│
├── server/                  # Node.js + Express backend
│   ├── routes/              # API endpoints
│   ├── controllers/         # Business logic
│   ├── models/              # MongoDB schemas
│   ├── services/
│   │   ├── github.service.ts    # GitHub OAuth + API
│   │   ├── discord.service.ts   # Discord bot logic
│   │   └── ai.service.ts        # LangChain + GPT-4o + Claude
│   └── socket/              # Socket.io real-time events
│
├── .env.example
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+` or `pnpm`
- MongoDB Atlas account
- GitHub OAuth App ([create one here](https://github.com/settings/developers))
- Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))
- OpenAI API Key + Anthropic API Key

### 1. Clone the Repository

```bash
git clone https://github.com/ShubhamSharma0803/Synapse_X.git
cd Synapse_X
```

### 2. Install Dependencies

```bash
# Install all dependencies (root + client + server)
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
# ─── GitHub OAuth ────────────────────────────────
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ─── Discord Bot ─────────────────────────────────
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_discord_server_id

# ─── Database ────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/synapse

# ─── AI / LLM ────────────────────────────────────
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# ─── App ─────────────────────────────────────────
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Run the Dev Server

```bash
npm run dev
```

The client will be live at `http://localhost:5173` and the server at `http://localhost:5000`.

---

## 🔑 GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Authorization callback URL** to:
   ```
   http://localhost:5000/auth/github/callback
   ```
4. Copy the **Client ID** and **Client Secret** into your `.env`

---

## 🤖 Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a **New Application** → go to **Bot** tab → copy the token
3. Enable **Privileged Gateway Intents**: Message Content, Server Members
4. Invite the bot to your server with appropriate permissions
5. Paste the token in `.env` as `DISCORD_BOT_TOKEN`

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/auth/github` | Initiate GitHub OAuth flow |
| `GET` | `/auth/github/callback` | OAuth callback handler |
| `GET` | `/api/repos` | Fetch connected repositories |
| `GET` | `/api/prs` | Get open pull requests |
| `POST` | `/api/standup` | Trigger AI standup generation |
| `GET` | `/api/profile/:username` | Fetch developer trading card |
| `GET` | `/api/timeline` | Get predictive project timeline |
| `POST` | `/api/orb/ask` | Query the Orb AI assistant |

---

## 🧠 AI Architecture

Synapse X uses a multi-model AI pipeline:

```
User Action / Scheduled Trigger
        │
        ▼
  LangChain Orchestrator
   ├──► GPT-4o         → Standup generation, PR summaries
   ├──► Claude API     → Blocker detection, nuanced reasoning  
   └──► Vector Store   → Context retrieval for Orb assistant
        │
        ▼
   Socket.io → Real-time push to Discord + Frontend
```

- **GPT-4o** handles creative summarization and daily standup generation
- **Claude API** handles nuanced blocker detection and reasoning about team dynamics
- **LangChain** orchestrates multi-step chains and manages context windows

---

## 🗺️ Roadmap

- [x] GitHub OAuth + Discord bot integration
- [x] Real-time PR and commit tracking
- [x] Developer trading card profiles
- [x] Orb AI assistant (basic)
- [x] Auto-generated daily standups
- [ ] 🔄 Predictive timeline (in progress)
- [ ] 📊 Team velocity analytics dashboard
- [ ] 🔔 Smart Nudges (AI blocker detection)
- [ ] 📱 Mobile-responsive UI
- [ ] 🔗 Jira / Linear integration
- [ ] 🎙️ Voice standup via Discord VC

---

## 🤝 Contributing

Contributions are very welcome! Here's how to get involved:

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request** and describe what you've changed

Please open an **issue first** if you plan on making a significant change, so we can discuss the approach.

> We follow [Conventional Commits](https://www.conventionalcommits.org/) — please format your commit messages accordingly.

---

## 👥 Authors

<table>
  <tr>
    <td align="center">
      <b>Sanyam Nandal</b><br/>
      <a href="https://github.com/SanyamNandal">GitHub</a> · <a href="https://linkedin.com/in/sanyamnandal">LinkedIn</a>
    </td>
    <td align="center">
      <b>Shubham Sharma</b><br/>
      <a href="https://github.com/ShubhamSharma0803">GitHub</a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ☕, late nights, and way too many PRs.

⭐ **Star this repo if Synapse X helped you — it keeps us going!** ⭐

</div>