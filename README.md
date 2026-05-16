# 🐛 AI Debugger Assistant

<div align="center">

![AI Debugger](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge&logo=openai)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge&logo=mongodb)
![Grok AI](https://img.shields.io/badge/LLM-Grok%20AI-black?style=for-the-badge&logo=x)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange?style=for-the-badge&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**An intelligent debugging assistant powered by Grok AI that helps developers identify, understand, and fix code errors in real time.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Folder Structure](#-folder-structure) • [Getting Started](#-getting-started) • [API Docs](#-api-endpoints)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Debugging** — Paste your error/code and get instant AI-generated analysis and fixes via Grok AI
- 📖 **Theory Explanation** — Get in-depth explanations of why an error occurred, not just the fix
- 🕓 **Debug History** — All your past debug sessions are saved and accessible anytime
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
| **Grok AI (xAI)** | AI inference for debugging |
| **JWT** | Authentication & authorization |
| **bcryptjs** | Password hashing |
| **firebase-admin** | Server-side Firebase ID token verification |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **Axios** | HTTP client |
| **React Context API** | Global state management |
| **Firebase Auth** | Google OAuth 2.0 — signInWithPopup + GoogleAuthProvider |

---

## 📁 Folder Structure

```
AI-Debugger-Assistant/
│
├── 📂 Backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   ├── authControllers.js     # Register, Login, Google Auth, Logout logic
│   │   └── debugController.js     # AI debug request handler
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password, googleId)
│   │   ├── Debug.js               # Debug session schema
│   │   └── blackList.js           # Token blacklist schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   └── debugRoutes.js         # /api/debug routes
│   ├── services/
│   │   ├── ai.service.js          # Grok AI integration logic
│   │   └── temp.js                # Temporary/utility helpers
│   ├── app.js                     # Express app setup & middleware
│   ├── server.js                  # Server entry point
│   └── package.json
│
└── 📂 Frontend/Debugger/
    ├── src/
    │   ├── Auth/
    │   │   ├── UI/
    │   │   │   ├── components/
    │   │   │   │   ├── LoadingPage.jsx    # Global loading spinner
    │   │   │   │   └── Protected.jsx      # Auth route guard
    │   │   │   └── pages/
    │   │   │       ├── Login.jsx          # Login page (Email + Google button)
    │   │   │       └── SignUp.jsx         # Registration page (Email + Google button)
    │   │   ├── hooks/
    │   │   │   └── useAuth.js             # Auth custom hook
    │   │   ├── services/
    │   │   │   ├── auth.api.js            # Auth API calls (login/signup/google)
    │   │   │   └── firebase.js            # Firebase app init + GoogleAuthProvider
    │   │   └── state/
    │   │       └── auth.context.jsx       # Auth global state (Context)
    │   │
    │   ├── DebugAI/
    │   │   ├── UI/
    │   │   │   ├── Header/
    │   │   │   │   └── Header.jsx         # Top navigation bar
    │   │   │   ├── History/
    │   │   │   │   ├── HistoryPage.jsx    # Full history view page
    │   │   │   │   └── HistorySection.jsx # History sidebar/section
    │   │   │   ├── DebugUI.jsx            # Main debugger interface
    │   │   │   └── TheoryExplanation.jsx  # AI explanation display
    │   │   ├── hooks/
    │   │   │   └── useDebug.js            # Debug custom hook
    │   │   ├── services/
    │   │   │   └── ai.api.js              # Debug API calls
    │   │   └── state/
    │   │       └── debug.context.jsx      # Debug global state (Context)
    │   │
    │   ├── App.jsx                        # Root component & routing
    │   └── main.jsx                       # React DOM entry point
    │
    ├── axios.js                           # Axios instance with base URL
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .gitignore
```

---

## 🔐 Authentication Flow

This app supports **two login methods** — both result in the same JWT session.

---

### 1️⃣ Email / Password Auth

```
REGISTER
────────
User submits name, email, password
        │
        ▼
bcryptjs.hash(password, 10) → saved to MongoDB
        │
        ▼
Redirect to Login

LOGIN
─────
User submits email + password
        │
        ▼
User.findOne({ email }) → bcryptjs.compare(password, hash)
        │
        ▼
jwt.sign({ userId }, JWT_SECRET, { expiresIn })
        │
        ▼
JWT returned in response → auth.context.jsx updated
```

---

### 2️⃣ Google Sign-In (Firebase)

```
User clicks "Sign in with Google"
        │
        ▼
Firebase SDK → signInWithPopup(auth, new GoogleAuthProvider())
        │
        ▼
Google OAuth popup → user selects account & consents
        │
        ▼
Firebase returns → user.accessToken  (Firebase ID Token)
        │
        ▼
Frontend sends → POST /api/auth/google
  { idToken: "Firebase ID token" }
        │
        ▼
Backend → firebase-admin.auth().verifyIdToken(idToken)
        │
        ▼
User.findOrCreate({ email }) in MongoDB
  ├── Existing user → skip creation
  └── New Google user → save { name, email, googleId } (no password)
        │
        ▼
jwt.sign({ userId }, JWT_SECRET, { expiresIn })
        │
        ▼
JWT returned → same session flow as email/password
```

---

### 🔒 Protected Request (Both Methods)

```
Client hits any protected route
        │
        ▼
auth.middleware.js
  ├── Extract JWT from Authorization header
  ├── jwt.verify(token, JWT_SECRET) → valid & not expired?
  ├── blackList.findOne({ token }) → not revoked?
  └── req.user = decoded payload → call next()
```

---

### 🚪 Logout (Both Methods)

```
Token extracted from Authorization header
        │
        ▼
Token saved to blackList collection (MongoDB)
        │
        ▼
Firebase: auth.signOut() called on client (Google users)
        │
        ▼
All future requests with this token → 401 Unauthorized
```

---

## 🔄 Application Flow

```
User Inputs Code/Error
        ↓
  Frontend (DebugUI)
        ↓
  Axios → POST /api/debug/analyze
        ↓
  auth.middleware (JWT Verify)
        ↓
  debugController → ai.service.js
        ↓
  Grok AI API (xAI)
        ↓
  Response: Fix + Theory Explanation
        ↓
  Saved to MongoDB (Debug model)
        ↓
  Displayed in TheoryExplanation.jsx
```

---

## 📡 API Endpoints

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/register` | Register a new user (email/password) | ❌ |
| `POST` | `/login` | Login and get JWT token | ❌ |
| `POST` | `/google` | Verify Firebase ID token → issue JWT | ❌ |
| `POST` | `/logout` | Logout and blacklist token | ✅ |

**POST `/api/auth/google` — Request** (`application/json`):

```json
{
  "idToken": "Firebase ID token returned from signInWithPopup"
}
```

---

### 🐛 Debug Routes — `/api/debug`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/analyze` | Submit code/error for AI analysis | ✅ |
| `GET` | `/history` | Get all past debug sessions | ✅ |
| `DELETE` | `/history/:id` | Delete a specific debug session | ✅ |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or Atlas)
- Grok AI API Key from [x.ai](https://x.ai)
- Firebase Project — [Firebase Console](https://console.firebase.google.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-debugger-assistant.git
cd ai-debugger-assistant
```

---

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → Create or select a project
2. **Authentication** → Sign-in method → Enable **Google**
3. **Project Settings → General** → Add a Web App → copy the Firebase config (for frontend `.env`)
4. **Project Settings → Service Accounts** → Generate new private key → download JSON (for backend `.env`)

---

### 3. Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROK_API_KEY=your_grok_ai_api_key

# Firebase Admin SDK (from downloaded service account JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

```bash
npm run dev
```

> Server runs at `http://localhost:5000`

---

### 4. Frontend Setup

```bash
cd Frontend/Debugger
npm install
```

Create `Frontend/Debugger/.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
npm run dev
```

> App runs at `http://localhost:5173`

Make sure `vite.config.js` has the proxy configured:

```js
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 🌐 Environment Variables Summary

| Variable | Location | Description |
|----------|----------|-------------|
| `PORT` | Backend `.env` | Express server port |
| `MONGO_URI` | Backend `.env` | MongoDB connection string |
| `JWT_SECRET` | Backend `.env` | Secret key for JWT signing |
| `GROK_API_KEY` | Backend `.env` | xAI Grok API key |
| `FIREBASE_PROJECT_ID` | Backend `.env` | Firebase Admin — project ID |
| `FIREBASE_CLIENT_EMAIL` | Backend `.env` | Firebase Admin — client email |
| `FIREBASE_PRIVATE_KEY` | Backend `.env` | Firebase Admin — private key |
| `VITE_FIREBASE_API_KEY` | Frontend `.env` | Firebase Web SDK — API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Frontend `.env` | Firebase Web SDK — auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Frontend `.env` | Firebase Web SDK — project ID |
| `VITE_FIREBASE_APP_ID` | Frontend `.env` | Firebase Web SDK — app ID |

---

## 📦 NPM Packages

### Backend

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken firebase-admin
```

### Frontend

```bash
npm install axios react-router-dom firebase
```

---

## 🔒 Security Summary

| Practice | Implementation |
|---|---|
| Password hashing | `bcryptjs` — salt rounds: 10 |
| Email/password tokens | `jsonwebtoken` — returned on login |
| Google auth | Firebase `signInWithPopup` → ID token verified by `firebase-admin` on backend |
| Unified session | Both auth methods issue the same JWT |
| Secure logout | Token saved to `blackList` (MongoDB) + Firebase `auth.signOut()` on client |
| Route protection | `auth.middleware.js` on backend + `Protected.jsx` on frontend |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ using **MERN Stack** + **Grok AI** + **Firebase**

⭐ Star this repo if you found it helpful!

</div>
