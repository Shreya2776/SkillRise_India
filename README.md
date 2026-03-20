# 🎯 InterviewAI — MERN Stack

A full-stack AI-powered interview preparation platform built with **MongoDB, Express, React, and Node.js**. Converted from the original Next.js + Firebase architecture to a clean MERN stack with JWT authentication.

---

## 🏗️ Architecture

```
interview-prep-mern/
├── server/                     # Express + MongoDB backend
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile
│   │   ├── interviewController.js  # CRUD + AI feedback
│   │   └── vapiController.js   # Voice AI + question gen
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── error.js            # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt)
│   │   └── Interview.js        # Interview + feedback schema
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── interviews.js       # /api/interviews/*
│   │   └── vapi.js             # /api/vapi/*
│   └── index.js                # Express app entry
│
└── client/                     # Vite + React frontend
    └── src/
        ├── api/index.js        # Axios client + API methods
        ├── components/
        │   ├── layout/         # Navbar, ProtectedLayout
        │   ├── ui/             # Button, Input, Card, Toast, Badge, ScoreRing
        │   ├── InterviewCard.jsx
        │   └── VoiceAgent.jsx  # VAPI voice interview UI
        ├── context/
        │   └── AuthContext.jsx # JWT auth state
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── NewInterviewPage.jsx   # 5-step wizard
        │   ├── InterviewDetailPage.jsx
        │   ├── FeedbackPage.jsx       # AI feedback report
        │   ├── InterviewsPage.jsx
        │   └── ProfilePage.jsx
        └── utils/
            ├── constants.js    # Tech stacks, types, colors
            └── helpers.js      # cn, formatDate, scoreLabel
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd interview-prep-mern
npm run install:all
```

### 2. Configure environment

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview_prep
JWT_SECRET=your_super_secret_key_change_me
JWT_EXPIRE=7d
VAPI_PRIVATE_KEY=your_vapi_private_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
```

### 3. Run development servers

```bash
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

---

## 🔌 API Reference

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login → JWT |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Interviews
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/interviews` | List (paginated, filterable) |
| POST | `/api/interviews` | Create session |
| GET | `/api/interviews/stats` | User analytics |
| GET | `/api/interviews/:id` | Get single |
| PUT | `/api/interviews/:id` | Update transcript/status |
| DELETE | `/api/interviews/:id` | Delete |
| POST | `/api/interviews/:id/generate-feedback` | AI feedback via Google Gemini |

### VAPI Voice
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/vapi/token` | Get VAPI web call token |
| POST | `/api/vapi/generate-questions` | Generate AI interview questions |

---

## ✨ Features

- **JWT Authentication** — secure register/login, token stored in localStorage, auto-refresh on page load
- **5-step Interview Wizard** — Role → Type & Level → Tech Stack → AI Questions → Review
- **AI Question Generation** — Google Gemini generates role-specific questions
- **Voice Interviews** — VAPI real-time voice AI (demo mode if key not set)
- **AI Feedback** — Google Gemini scores 5 categories, identifies strengths & improvements
- **Dashboard** — stats, recent interviews, performance trends
- **Filtering & Pagination** — filter by status/type, paginated list
- **Toast notifications** — non-intrusive feedback throughout
- **Responsive dark UI** — Tailwind CSS with glass-morphism design

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS, custom CSS variables |
| State | React Context (Auth), local state |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Voice AI | VAPI Web SDK |
| AI Feedback | Google Gemini 1.5 Flash |
| Validation | express-validator |
| Security | Rate limiting, CORS, bcrypt |

---

## 🎭 Demo Mode

If VAPI keys are not configured, the app runs in **demo mode**:
- Voice interviews are simulated locally
- A mock transcript is generated
- AI feedback still works (if Google AI key is set)
- Falls back to sensible mock feedback if no AI key

---

## 📦 Deployment

### Backend (Railway / Render)
```bash
cd server
npm start
```
Set all environment variables in your platform's dashboard.

### Frontend (Vercel / Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```
Set `VITE_API_URL` to your deployed backend URL.

---

