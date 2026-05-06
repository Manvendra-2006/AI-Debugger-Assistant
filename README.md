# 🐛 AI Debugger Assistant

<div align="center">

![AI Debugger](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge&logo=openai)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge&logo=mongodb)
![Grok AI](https://img.shields.io/badge/LLM-Grok%20AI-black?style=for-the-badge&logo=x)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**An intelligent debugging assistant powered by Grok AI that helps developers identify, understand, and fix code errors in real time.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Folder Structure](#-folder-structure) • [Getting Started](#-getting-started) • [API Docs](#-api-endpoints) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Debugging** — Paste your error/code and get instant AI-generated analysis and fixes via Grok AI
- 📖 **Theory Explanation** — Get in-depth explanations of why an error occurred, not just the fix
- 🕓 **Debug History** — All your past debug sessions are saved and accessible anytime
- 🔐 **JWT Authentication** — Secure login/signup with token blacklisting on logout
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

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **Axios** | HTTP client |
| **React Context API** | Global state management |

---

## 📁 Folder Structure

```
AI-Debugger-Assistant/
│
├── 📂 Backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   │
│   ├── controllers/
│   │   ├── authControllers.js     # Register, Login, Logout logic
│   │   └── debugController.js     # AI debug request handler
│   │
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification middleware
│   │
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Debug.js               # Debug session schema
│   │   └── blackList.js           # Token blacklist schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   └── debugRoutes.js         # /api/debug routes
│   │
│   ├── services/
│   │   ├── ai.service.js          # Grok AI integration logic
│   │   └── temp.js                # Temporary/utility helpers
│   │
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
    │   │   │       ├── Login.jsx          # Login page
    │   │   │       └── SignUp.jsx         # Registration page
    │   │   ├── hooks/
    │   │   │   └── useAuth.js             # Auth custom hook
    │   │   ├── services/
    │   │   │   └── auth.api.js            # Auth API calls (login/signup)
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

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or Atlas)
- Grok AI API Key from [x.ai](https://x.ai)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-debugger-assistant.git
cd ai-debugger-assistant
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROK_API_KEY=your_grok_ai_api_key
```

Start the backend server:

```bash
npm run dev
```

> Server runs at `http://localhost:PORT`

---

### 3. Frontend Setup

```bash
cd Frontend/Debugger
npm install
```

> **Note:** Frontend mein koi `.env` file ki zaroorat nahi hai. `axios.js` mein `baseURL: '/api'` already set hai, jo Vite ke proxy ke through backend se connect hota hai.

```js
// axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default axiosInstance;
```

Start the frontend:

```bash
npm run dev
```

> App runs at `http://localhost:5173`

> **Vite Proxy:** `vite.config.js` mein proxy set hona chahiye taaki `/api` calls backend ko forward ho:
> ```js
> server: {
>   proxy: {
>     '/api': 'http://localhost:PORT'
>   }
> }
> ```

---

## 📡 API Endpoints

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and get JWT token | ❌ |
| `POST` | `/logout` | Logout and blacklist token | ✅ |

---

### 🐛 Debug Routes — `/api/debug`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/analyze` | Submit code/error for AI analysis | ✅ |
| `GET` | `/history` | Get all past debug sessions | ✅ |
| `DELETE` | `/history/:id` | Delete a specific debug session | ✅ |

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

## 🔐 Authentication Flow

1. User registers → password hashed with **bcryptjs** → stored in **MongoDB**
2. User logs in → **JWT token** issued
3. Token sent in `Authorization: Bearer <token>` header for protected routes
4. On logout → token stored in **BlackList** collection → rejected on future requests

---

## 🌐 Environment Variables Summary

| Variable | Location | Description |
|----------|----------|-------------|
| `PORT` | Backend `.env` | Express server port |
| `MONGO_URI` | Backend `.env` | MongoDB connection string |
| `JWT_SECRET` | Backend `.env` | Secret key for JWT signing |
| `GROK_API_KEY` | Backend `.env` | xAI Grok API key |

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

Made with ❤️ using **MERN Stack** + **Grok AI**

⭐ Star this repo if you found it helpful!

</div>
