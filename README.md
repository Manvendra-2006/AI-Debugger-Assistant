# 🐛 AI Debugger Assistant

<div align="center">

![AI Debugger](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge&logo=openai)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge&logo=mongodb)
![Groq AI](https://img.shields.io/badge/LLM-Groq%20AI-black?style=for-the-badge)
![MCP](https://img.shields.io/badge/Protocol-MCP-blue?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange?style=for-the-badge&logo=firebase)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-green?style=for-the-badge&logo=gmail)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**An intelligent debugging assistant powered by Groq AI that autonomously inspects, analyzes, and fixes code errors using MCP (Model Context Protocol) tools.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [MCP Server](#-mcp-server) • [Getting Started](#-getting-started) • [API Docs](#-api-endpoints)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Debugging** — Upload your project as a ZIP and get autonomous AI debugging via Groq AI
- 🔧 **MCP Tool Integration** — AI agent uses real tools to list files, read code, run commands, and fix bugs
- 🧠 **Autonomous Agent Loop** — AI debugs step-by-step without manual intervention
- 🕓 **Debug History** — All past debug sessions saved and accessible anytime
- 🔐 **JWT Authentication** — Secure login/signup with token blacklisting on logout
- 🔵 **Google Sign-In** — One-click authentication via Firebase Google OAuth 2.0
- 📧 **Welcome Email** — Sends a welcome email on signup via Nodemailer using Google API (OAuth2)
- 🛡️ **Protected Routes** — Both frontend and backend route guards
- ⚡ **Fast & Responsive UI** — Built with React + Vite for blazing fast performance

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **Groq AI** | LLM inference for autonomous debugging |
| **MCP SDK** | Model Context Protocol client for tool calling |
| **Multer + AdmZip** | ZIP file upload and extraction |
| **JWT** | Authentication & authorization |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Sending welcome email on signup via Gmail OAuth2 |
| **firebase-admin** | Server-side Firebase ID token verification |

### MCP Server
| Technology | Purpose |
|---|---|
| **Node.js + Express** | MCP Server host |
| **MCP SDK (SSE)** | Server-Sent Events transport for AI tool calls |
| **Zod** | Tool input schema validation |
| **Custom Tools** | listFiles, readFile, searchCodebase, runCommand, analyzeLogs, writeFile |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **Axios** | HTTP client |
| **React Context API** | Global state management |
| **Firebase Auth** | Google OAuth 2.0 — signInWithPopup + GoogleAuthProvider |
| **react-markdown** | Render AI markdown responses |

---

## 📁 Folder Structure

```
AI-Debugger-Assistant/
│
├── 📂 Backend/
│   ├── agent/
│   │   └── agent.js                  # Autonomous AI agent loop (Groq + MCP tools)
│   ├── config/
│   │   └── db.js                     # MongoDB connection setup
│   ├── controllers/
│   │   ├── authControllers.js        # Register, Login, Google Auth, Logout logic
│   │   ├── debugController.js        # Debug session logic
│   │   └── fileController.js         # ZIP upload, extraction, agent trigger
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT verification middleware
│   │   └── file.middleware.js        # File upload middleware
│   ├── models/
│   │   ├── Debug.js                  # Debug session schema
│   │   ├── User.js                   # User schema
│   │   └── blackList.js              # Token blacklist schema
│   ├── routes/
│   │   ├── authRoutes.js             # /api/auth routes
│   │   ├── debugRoutes.js            # /api/debug routes
│   │   └── fileroutes.js             # /api/files routes
│   ├── services/
│   │   ├── ai.service.js             # Groq AI + MCP agent service
│   │   ├── email.service.js          # Nodemailer welcome email (Gmail OAuth2)
│   │   └── temp.js                   # Temporary utility
│   ├── utils/
│   │   └── unzipProject.js           # AdmZip extraction utility
│   ├── app.js                        # Express app setup
│   ├── server.js                     # Server entry point
│   ├── nodemon.json                  # Nodemon ignore config
│   └── package.json
│
├── 📂 MCP-Server/
│   ├── tools/
│   │   ├── listfiles.js              # List all files in a directory
│   │   ├── readFile.js               # Read file content
│   │   ├── searchCodebase.js         # Search keyword across project files
│   │   ├── runCommand.js             # Run terminal commands in project
│   │   ├── analyzeLogs.js            # Analyze runtime logs and errors
│   │   └── writeFile.js              # Write or update project files
│   ├── index.js                      # MCP Server entry (SSE transport)
│   └── package.json
│
└── 📂 Frontend/Debugger/
    ├── src/
    │   ├── Auth/
    │   │   ├── UI/
    │   │   │   ├── components/
    │   │   │   └── pages/
    │   │   │       ├── Login.jsx
    │   │   │       └── SignUp.jsx
    │   │   ├── hooks/
    │   │   │   └── useAuth.js
    │   │   ├── services/
    │   │   │   └── auth.api.js
    │   │   └── state/
    │   │       └── auth.context.jsx
    │   ├── DebugAI/
    │   │   ├── UI/
    │   │   │   ├── Header/
    │   │   │   │   └── Header.jsx
    │   │   │   ├── History/
    │   │   │   │   ├── HistoryPage.jsx
    │   │   │   │   └── HistorySection.jsx
    │   │   │   ├── DebugUI.jsx
    │   │   │   └── TheoryExplanation.jsx
    │   │   ├── hooks/
    │   │   │   └── useDebug.js
    │   │   ├── services/
    │   │   │   └── ai.api.js
    │   │   └── state/
    │   │       └── debug.context.jsx
    │   ├── Firebase/
    │   │   ├── FireBaseProvider.jsx
    │   │   └── Firebase.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── axios.js
    ├── vercel.json
    ├── vite.config.js
    └── package.json
```

---

## 🏗 Architecture

```
User uploads ZIP + Prompt
        ↓
  Frontend (React)
        ↓
  POST /api/files/upload (Multer)
        ↓
  AdmZip extracts project
        ↓
  Agent Loop starts (Groq AI)
        ↓
  AI calls MCP Tools via SSE
        ↓
┌─────────────────────────┐
│       MCP Server        │
│  ┌─────────────────┐    │
│  │   listFiles     │    │
│  │   readFile      │    │
│  │ searchCodebase  │    │
│  │   runCommand    │    │
│  │  analyzeLogs    │    │
│  │   writeFile     │    │
│  └─────────────────┘    │
└─────────────────────────┘
        ↓
  AI analyzes results → fixes bugs
        ↓
  Final response returned to Frontend
        ↓
  Rendered as Markdown (react-markdown)
```

---

## 🔧 MCP Server

The MCP (Model Context Protocol) Server exposes a set of tools that the AI agent uses to autonomously debug projects. It communicates with the Backend via **SSE (Server-Sent Events)**.

### Available Tools

| Tool | Description |
|---|---|
| `listFiles` | List all files and folders in a directory |
| `readFile` | Read the content of any project file |
| `searchCodebase` | Search for a keyword across all project files |
| `runCommand` | Execute terminal commands inside the project |
| `analyzeLogs` | Analyze runtime error logs and identify root causes |
| `writeFile` | Write or update a file to apply a fix |

### Debugging Workflow (Agent Loop)

```
1. listFiles       → Understand project structure
2. searchCodebase  → Find relevant code
3. readFile        → Read important files
4. runCommand      → Run the project / reproduce the error
5. analyzeLogs     → Analyze runtime output
6. writeFile       → Apply the fix
7. Return          → Final explanation to user
```

> The agent loop runs up to **20 tool calls** before returning a final answer.

---

## 📧 Email Feature (Nodemailer + Gmail OAuth2)

A welcome email is sent on signup using **Nodemailer** with **Google API OAuth2** credentials — no plain password stored.

### How it works

```
User signs up
        ↓
authControllers.js calls email.service.js
        ↓
Nodemailer creates Gmail OAuth2 transporter
        ↓
Access token fetched via Google OAuth2 Client
        ↓
Email sent via Gmail SMTP
        ↓
User receives Welcome email
```

### `services/email.service.js`

```js
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const sendEmail = async ({ to, subject, html }) => {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  await transporter.sendMail({
    from: `"AI Debugger" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
```

### Usage in `authControllers.js`

```js
const sendEmail = require("../services/email.service");

// Register ke baad:
await sendEmail({
  to: user.email,
  subject: "Welcome to AI Debugger! 🐛",
  html: `<h2>Hello ${user.name}!</h2><p>Your account has been created successfully.</p>`,
});
```

---

## 🔐 Authentication Flow

### 1️⃣ Email / Password Auth

```
User submits email + password
        ↓
bcryptjs.compare(password, hash)
        ↓
jwt.sign({ userId }, JWT_SECRET)
        ↓
JWT returned → auth.context.jsx updated
        ↓
Welcome email sent via email.service.js
```

### 2️⃣ Google Sign-In (Firebase)

```
Firebase signInWithPopup → Google OAuth
        ↓
Firebase ID Token returned
        ↓
POST /api/auth/google { idToken }
        ↓
firebase-admin.verifyIdToken(idToken)
        ↓
User.findOrCreate in MongoDB
        ↓
JWT returned → same session flow
```

### 🚪 Logout

```
Token saved to blackList (MongoDB)
        ↓
Firebase auth.signOut() on client
        ↓
All future requests → 401 Unauthorized
```

---

## 📡 API Endpoints

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/register` | Register new user + send welcome email | ❌ |
| `POST` | `/login` | Login and get JWT | ❌ |
| `POST` | `/google` | Firebase Google auth | ❌ |
| `POST` | `/logout` | Logout and blacklist token | ✅ |

### 📁 File Routes — `/api/files`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/upload` | Upload ZIP + prompt → AI debug | ✅ |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or Atlas)
- Groq API Key — [console.groq.com](https://console.groq.com)
- Firebase Project — [Firebase Console](https://console.firebase.google.com/)
- Google API Console credentials for Gmail OAuth2 — [console.cloud.google.com](https://console.cloud.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-debugger-assistant.git
cd ai-debugger-assistant
```

### 2. MCP Server Setup

```bash
cd MCP-Server
npm install
npm run dev
```

> MCP Server runs at `http://localhost:4000`

### 3. Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_TOKEN=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
MCP_SERVER_URL=http://localhost:4000
FRONTEND_URL=http://localhost:5173

# Gmail OAuth2 (from Google API Console)
GMAIL_USER=your_gmail@gmail.com
GMAIL_CLIENT_ID=your_google_client_id
GMAIL_CLIENT_SECRET=your_google_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
```

```bash
npm run dev
```

> Backend runs at `http://localhost:3000`

### 4. Frontend Setup

```bash
cd Frontend/Debugger
npm install
```

Create `Frontend/Debugger/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
npm run dev
```

> Frontend runs at `http://localhost:5173`

---

## 🌐 Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `PORT` | Express server port |
| `MONGO_URL` | MongoDB connection string |
| `JWT_TOKEN` | Secret key for JWT signing |
| `GROQ_API_KEY` | Groq AI API key |
| `MCP_SERVER_URL` | MCP Server URL |
| `FRONTEND_URL` | Frontend URL for email links |
| `GMAIL_USER` | Gmail address used as sender |
| `GMAIL_CLIENT_ID` | Google API Console OAuth2 Client ID |
| `GMAIL_CLIENT_SECRET` | Google API Console OAuth2 Client Secret |
| `GMAIL_REFRESH_TOKEN` | OAuth2 Refresh Token from OAuth Playground |

### Frontend `.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_FIREBASE_API_KEY` | Firebase Web SDK API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## 🔑 Gmail OAuth2 Setup (Google API Console)

1. Go to [Google API Console](https://console.cloud.google.com/)
2. Create a new project → Enable **Gmail API**
3. Go to **Credentials** → Create **OAuth 2.0 Client ID** (Desktop app)
4. Copy `Client ID` and `Client Secret` to `.env`
5. Go to [OAuth Playground](https://developers.google.com/oauthplayground/)
   - Settings → Check **"Use your own OAuth credentials"** → Enter your Client ID & Secret
   - Authorize `https://mail.google.com/`
   - Exchange for tokens → Copy **Refresh Token** to `.env`

---

## 🚢 Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Set `VITE_API_URL` to backend Render URL |
| Backend | Render | Set all `.env` variables including Gmail OAuth2 |
| MCP Server | Render | No env variables needed |

> **Important:** Add your Vercel domain to Firebase Console → Authentication → Authorized Domains.

---

## 🔒 Security Summary

| Practice | Implementation |
|---|---|
| Password hashing | `bcryptjs` — salt rounds: 10 |
| JWT tokens | `jsonwebtoken` — returned on login |
| Google auth | Firebase `signInWithPopup` → verified by `firebase-admin` |
| Secure logout | Token blacklisted in MongoDB + Firebase `signOut()` |
| Route protection | `auth.middleware.js` on backend + `Protected.jsx` on frontend |
| Email credentials | Gmail OAuth2 — no plain password stored |

---

<div align="center">

Made with ❤️ using **MERN Stack** + **Groq AI** + **MCP** + **Firebase** + **Nodemailer**

⭐ Star this repo if you found it helpful!

</div>
