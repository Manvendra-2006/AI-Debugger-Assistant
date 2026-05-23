# 🐛 AI Debugger Assistant

<div align="center">

![AI Debugger](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge&logo=openai)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge&logo=mongodb)
![Groq AI](https://img.shields.io/badge/LLM-Groq%20AI-black?style=for-the-badge)
![MCP](https://img.shields.io/badge/Protocol-MCP-blue?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange?style=for-the-badge&logo=firebase)
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
│   │   └── agent.js               # Autonomous AI agent loop (Groq + MCP tools)
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   ├── authControllers.js     # Register, Login, Google Auth, Logout logic
│   │   └── fileController.js      # ZIP upload, extraction, agent trigger
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── blackList.js           # Token blacklist schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   └── fileRoutes.js          # /api/files routes
│   ├── utils/
│   │   └── unzipProject.js        # AdmZip extraction utility
│   ├── extracted-projects/        # Temp folder for extracted ZIPs
│   ├── uploads/                   # Temp folder for uploaded ZIPs
│   ├── nodemon.json               # Nodemon ignore config
│   ├── server.js                  # Server entry point
│   └── package.json
│
├── 📂 MCP Server/
│   ├── tools/
│   │   ├── listfiles.js           # List all files in a directory
│   │   ├── readFile.js            # Read file content
│   │   ├── searchCodebase.js      # Search keyword across project files
│   │   ├── runCommand.js          # Run terminal commands in project
│   │   ├── analyzeLogs.js         # Analyze runtime logs and errors
│   │   └── writeFile.js           # Write or update project files
│   ├── index.js                   # MCP Server entry (SSE transport)
│   └── package.json
│
└── 📂 Frontend/Debugger/
    ├── src/
    │   ├── Auth/
    │   │   ├── UI/pages/
    │   │   │   ├── Login.jsx
    │   │   │   └── SignUp.jsx
    │   │   ├── hooks/useAuth.js
    │   │   ├── services/
    │   │   │   ├── auth.api.js
    │   │   │   └── firebase.js
    │   │   └── state/auth.context.jsx
    │   ├── DebugAI/
    │   │   ├── UI/
    │   │   │   ├── DebugUI.jsx
    │   │   │   └── Header/Header.jsx
    │   │   ├── hooks/useDebug.js
    │   │   ├── services/ai.api.js
    │   │   └── state/debug.context.jsx
    │   ├── App.jsx
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

### How it works

```
Backend (MCP Client)  ←──SSE──→  MCP Server (Tools)
        │
        ▼
  AI Agent calls tool
        │
        ▼
  MCP Server executes tool on extracted project
        │
        ▼
  Result returned to AI Agent
        │
        ▼
  AI decides next action (or returns final answer)
```

### Available Tools

| Tool | Description |
|---|---|
| `listFiles` | List all files and folders in a directory |
| `readFile` | Read the content of any project file |
| `searchCodebase` | Search for a keyword across all project files |
| `runCommand` | Execute terminal commands inside the project (e.g. `npm install`, `node index.js`) |
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

### MCP Transport

The MCP Server uses **SSE (Server-Sent Events)** transport:

- `GET /sse` — Backend connects here to establish SSE session
- `POST /messages?sessionId=...` — AI tool calls are sent here

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
| `POST` | `/register` | Register new user | ❌ |
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
- Groq API Key from [console.groq.com](https://console.groq.com)
- Firebase Project — [Firebase Console](https://console.firebase.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-debugger-assistant.git
cd ai-debugger-assistant
```

### 2. MCP Server Setup

```bash
cd "MCP Server"
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
| `MCP_SERVER_URL` | MCP Server URL (local or production) |

### Frontend `.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_FIREBASE_API_KEY` | Firebase Web SDK API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## 🚢 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | Set `VITE_API_URL` to backend Render URL |
| Backend | Render | Set all `.env` variables in dashboard |
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

---

<div align="center">

Made with ❤️ using **MERN Stack** + **Groq AI** + **MCP** + **Firebase**

⭐ Star this repo if you found it helpful!

</div>
