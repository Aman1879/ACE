# ACE – Academic & Career Engine

> **Your Academic & Career Journey, One Unified Platform.**
> Real-Time Telemetry • Verified Platform Integrations • MongoDB Atlas Persistence • Gamified Growth

ACE is a full-stack academic and career intelligence platform designed for engineering and computer science students to **MANAGE → TRACK → IMPROVE → SHOWCASE → GROW**.

---

## 🌟 Key Highlights & Modern Capabilities

- 🍃 **MongoDB Atlas Cloud Database:** Persistent cloud-hosted database cluster storing student profiles, projects, certificates, goals, streak activity, store orders, and coding telemetry.
- ⚡ **Real-Time Live Coding Telemetry:** Direct integration with official APIs:
  - **LeetCode:** Live GraphQL queries extracting verified solved count (Easy / Medium / Hard), contest ratings, and global percentiles.
  - **GitHub:** Public REST API & commit telemetry extracting yearly contributions, repositories, and open-source milestones.
  - **Codeforces:** Official API extracting competitive contest ratings, max rating, and rank titles (*Legendary Grandmaster, Candidate Master, Specialist*).
  - *No fake data — all metrics are verified in real time directly from platform accounts.*
- 🛡️ **Post-Registration Verification & Login Flow:**
  - Registration saves student credentials and initializes the Genesis Kit (+100 XP, 50 $ACE).
  - Redirects students to `/login` with pre-filled email and verification banner, requiring explicit authentication to initiate Day 1 streak.
- 🔥 **Dynamic Streak Engine:**
  - New students start at **Day 1**.
  - Daily logins and verified problem solves increment the streak.
  - If a day is missed, the streak automatically restarts from Day 1 on the next active login.
- 🏅 **Earned Badges & Verified Honors:**
  - Automatic milestone evaluation (`checkBadgeUnlocks`) for streaks, projects, coding solves, and certifications.
  - Real-time display of earned badges across **Dashboard Overview**, **Student Profile**, and **Public Recruiter Portfolio (`/u/:username`)**.
- 💼 **Cryptographic Dossier Export:** Download verified JSON/PDF telemetry dossiers stamped with student identity and audit proof.
- 🛍️ **ACE Store:** Redeem earned $ACE tokens for merchandise, course vouchers, and profile perks against live Atlas inventory.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, JavaScript (ES6+ / JSX) |
| **Styling** | Tailwind CSS v3, Framer Motion |
| **Icons & Charts** | Lucide React, Recharts |
| **Networking** | Axios (with JWT Interceptors & Bearer Auth) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas Cloud Cluster + Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs password hashing |
| **Validation & Security** | express-validator, helmet, mongo-sanitize, rate-limit |

---

## 📁 Project Structure

```
ACE/
├── client/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI widgets & modals
│   │   ├── context/            # AuthContext & global state
│   │   ├── pages/              # Dashboard, Coding, Profile, Store, Auth
│   │   ├── services/           # Axios API services
│   │   └── utils/              # Formatters & constants
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                     # Node.js + Express Backend
│   ├── config/                 # MongoDB Atlas connection (db.js)
│   ├── controllers/            # Coding, Profile, Gamification, Auth, etc.
│   ├── middleware/             # JWT auth & error handlers
│   ├── models/                 # Mongoose schemas (User, Streak, Badge, etc.)
│   ├── routes/                 # REST API routes
│   ├── services/               # Platform scraper (LeetCode, GitHub, CF)
│   ├── utils/                  # Streak engine, reward engine, seed scripts
│   ├── server.js
│   └── package.json
├── README.md
└── .gitignore
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js v18+ (tested on Node.js v20+)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/Aman1879/ACE.git
cd ACE

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ieacybu.mongodb.net/ace_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ACE
```

### 3. Run Development Servers

```bash
# Terminal 1: Backend Server (Port 5000)
cd server
node server.js

# Terminal 2: Frontend Dev Server (Port 5173)
cd client
npm run dev
```

- **Frontend Application:** `http://localhost:5173`
- **Backend API Base:** `http://localhost:5000/api`

---

## 🔐 Authentication & Onboarding Workflow

1. **Student Registration (`/register`):**
   - Collects Name, Email, Password, College, Degree, Branch, and Graduation Year.
   - Hashes password with `bcryptjs` (salt 10) and creates student records in MongoDB Atlas.
   - Initializes Genesis Welcome Kit (+100 XP, 50 $ACE).
   - Redirects to `/login?registered=true&email=<encodedEmail>`.
2. **Post-Registration Sign-In (`/login`):**
   - Automatically pre-fills student email and renders a green completion banner.
   - Student enters password to generate JWT session token and trigger Day 1 streak activation.
3. **Onboarding & Dashboard Access:**
   - Navigates authenticated student directly to their interactive dashboard with Day 1 streak live.

---

## 💻 Coding Tracker & Real-Time API Extraction

The Unified Coding Intelligence Tracker integrates with official competitive programming and developer APIs:

- **Interactive Verification Modal (`+ Add Platform Account`):**
  - Select platform (**LeetCode**, **GitHub**, **Codeforces**, **GeeksforGeeks**, **HackerRank**, **CodeChef**).
  - Enter username/handle and click **"Fetch Live Stats"**.
  - Polls live endpoints and auto-fills verified metrics:
    - *LeetCode:* Total solved, Easy / Medium / Hard, contest rating, and rank.
    - *GitHub:* Total yearly commits, repository count, and open-source contributions.
    - *Codeforces:* Active contest rating, max rating, and rank title.
  - Commits verified data into MongoDB Atlas `codingprofiles` collection.
- **Sync Now (`Auto-Poll`):**
  - Re-polls official APIs for all connected student profiles, updates metrics in Atlas, and credits **+15 XP**.
- **Log Problem Solve (`+ Log Problem Solve`):**
  - Allows students to log verified algorithmic problem solves, updating their daily streak and audit ledger in MongoDB Atlas.
- **Export Cryptographic Telemetry Dossier (`Export PDF/JSON`):**
  - Generates verifiable JSON telemetry dossier (`ace-coding-dossier-<username>.json`).

---

## 🏅 Badges & Gamification Architecture

| Component | Description |
|---|---|
| **XP & 20 Levels** | Earned through coding syncs, project additions, certifications, and streaks. |
| **$ACE Tokens** | Internal currency awarded for problem solves and milestones, redeemable in the ACE Store. |
| **Milestone Badges** | Unlocked automatically via `checkBadgeUnlocks`: |
| 👣 *First Step* | Welcome Genesis Kit unlock (+10 XP, +5 $ACE) |
| 💻 *Coding Pioneer* | Linked verified LeetCode or GitHub profile (+30 XP, +15 $ACE) |
| ⚡ *Algorithm Ace* | Solved 25+ verified competitive problems (+60 XP, +30 $ACE) |
| 🚀 *Project Starter* | Published first engineering project (+20 XP, +10 $ACE) |
| 📜 *Certified* | Verified first certification credential (+20 XP, +10 $ACE) |
| 🔥 *3-Day & 7-Day Streak* | Maintained daily streak consistency |
| 🌟 *Explorer* | Reached Level 5 milestone |

### Where Badges Appear:
1. **Dashboard Overview:** Dedicated *Earned Badges & Verified Honors* grid displaying unlocked badges with rarity badges (*Common, Rare, Epic, Legendary*).
2. **Student Profile (`/dashboard/profile`):** Comprehensive credential showcase.
3. **Public Portfolio (`/u/:username`):** Public recruiter-facing badge showcase for verified student achievements.

---

## 📡 API Reference Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Register new student (saves to Atlas, returns without auto-login)
- `POST /api/auth/login` – Authenticate with email & password, starts/syncs streak
- `POST /api/auth/logout` – Clear session cookie
- `GET  /api/auth/me` – Current authenticated user state

### Coding Tracker (`/api/coding`)
- `GET  /api/coding` – Get connected platform profiles
- `POST /api/coding` – Connect new platform with live API extraction
- `POST /api/coding/extract` – Preview live telemetry from LeetCode / GitHub / Codeforces
- `POST /api/coding/sync` – Re-poll live platform APIs and update Atlas
- `DELETE /api/coding/:id` – Remove connected platform profile

### Gamification & Badges (`/api/gamification`)
- `GET /api/gamification/summary` – User XP, level, token balance, and stats
- `GET /api/gamification/badges` – All badges with `isUnlocked` status
- `GET /api/gamification/my-badges` – Only unlocked student badges
- `GET /api/gamification/transactions` – Token & XP audit ledger

### Streaks (`/api/streak`)
- `GET  /api/streak` – Active streak status and 365-day activity heatmap
- `POST /api/streak/activity` – Record qualifying streak action

### Student Portfolio & Modules
- `/api/profile/me` – Student profile with earned badges
- `/api/projects` – CRUD portfolio projects
- `/api/certificates` – CRUD verified credentials
- `/api/achievements` – CRUD awards & hackathons
- `/api/goals` – Daily sprint tasks & completions
- `/api/internships` – Experience tracking
- `/api/store` – Product catalog & token redemption
- `/api/public/users/:username` – Public portfolio view with badges & telemetry

---

## 👥 Authors & Academic Credit

- **Project:** ACE – Academic & Career Engine
- **GitHub Repository:** [https://github.com/Aman1879/ACE](https://github.com/Aman1879/ACE)
- **Target SDGs:** SDG 4 (Quality Education), SDG 8 (Decent Work & Economic Growth), SDG 9 (Industry, Innovation & Infrastructure)

---

*Built with ❤️ for student engineers.*
