# ACE – Academic & Career Engine

> **Your Academic & Career Journey, One Platform.**

ACE is a full-stack student academic and career management platform that helps students MANAGE → TRACK → IMPROVE → SHOWCASE → GROW.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + JavaScript |
| Styling | Tailwind CSS + Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| HTTP | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Files | Cloudinary |

---

## 📁 Project Structure

```
ACE/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

#### Server (`server/.env`)
Copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ace_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary (optional – for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Email (optional – for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ACE
```

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:
- Default reward rules (XP + Token amounts per activity)
- Default badge definitions
- Admin user: `admin@ace.dev` / `Admin@123`
- Sample store products

### 4. Run Development

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔐 Authentication

- JWT-based authentication
- Token stored in localStorage
- Protected routes via middleware
- Role-based access (student / admin)

---

## 🎮 Gamification System

| Feature | Description |
|---|---|
| XP | Earned by completing activities |
| Levels | 20 levels from Beginner to Pro Learner |
| Streaks | Daily activity streak with milestones |
| Badges | Unlocked by reaching milestones |
| ACE Tokens | Internal currency redeemable in ACE Store |

### Streak Milestones
- 7 days → Week Warrior badge
- 30 days → Monthly Master badge
- 50 days → 50-Day Champion badge + 200 tokens
- 100 days → 100-Day Champion badge + 500 tokens
- 200 days → 200-Day Champion badge + 1200 tokens
- 400 days → 400-Day Champion badge + 3000 tokens

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Auth Endpoints
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me
POST   /auth/change-password
POST   /auth/forgot-password
```

### Student Modules
```
/projects          – CRUD for projects
/certificates      – CRUD for certificates
/achievements      – CRUD for achievements
/skills            – CRUD for skills
/coding            – CRUD for coding profiles
/goals             – CRUD for goals + complete action
/internships       – CRUD for internships
/placements        – CRUD for placements
/notes             – CRUD for notes
/resume            – Get/update resume data
```

### Gamification
```
GET    /streak              – Streak data + activity log
POST   /streak/activity     – Record qualifying activity
GET    /gamification/summary
GET    /gamification/badges
GET    /gamification/transactions
GET    /gamification/xp-history
```

### Store
```
GET    /store/products
GET    /store/products/:id
POST   /store/redeem
GET    /store/orders
```

### Social/Public
```
GET    /leaderboard?type=xp|streak|projects&period=week|month|all
GET    /notifications
PUT    /notifications/:id/read
PUT    /notifications/read-all
GET    /public/users/:username   – Public profile (no auth)
```

### Admin (requires admin role)
```
GET    /admin/overview
GET    /admin/users
PUT    /admin/users/:id
GET    /admin/store/products
POST   /admin/store/products
PUT    /admin/store/products/:id
DELETE /admin/store/products/:id
GET    /admin/orders
GET    /admin/reward-rules
PUT    /admin/reward-rules/:id
```

---

## 🌐 Deployment

### Backend (Render / Railway)
1. Set environment variables in dashboard
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add MongoDB Atlas URI

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 📱 Supported Screens

- 1920×1080, 1440×900, 1366×768
- 1024×768 (tablet landscape)
- 768×1024 (tablet portrait)
- 390×844, 375×812, 320×568 (mobile)

---

## 🏗️ Core Modules

| Module | Description |
|---|---|
| Dashboard | Overview of all activities |
| Projects | Portfolio project management |
| Certificates | Certificate storage & display |
| Achievements | Hackathons, awards, milestones |
| Coding Tracker | LeetCode, GFG, etc. stats |
| Resume Builder | Multi-template resume + export |
| Public Portfolio | Shareable profile at /u/:username |
| Internships | Internship management |
| Placement | Job application tracker |
| Goals & Tasks | Personal goal management |
| Notes | Private academic notes |
| Streak & Rewards | Gamification center |
| ACE Store | Token redemption store |
| Leaderboard | Student rankings |
| Admin Panel | Platform management |

---

## 👥 Project Info

- **Project Name:** ACE – Academic & Career Engine
- **Group ID:** 52
- **Research Area:** Full Stack Application Development
- **Related SDGs:** SDG 4, SDG 8, SDG 9

---

*Built with ❤️ for students, by students.*

