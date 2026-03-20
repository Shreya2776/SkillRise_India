

##  Architecture

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
