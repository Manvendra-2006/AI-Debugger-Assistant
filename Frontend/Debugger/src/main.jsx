import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './Auth/state/auth.context.jsx'
import { DebubgProvider } from './DebugAI/state/debug.context.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DebubgProvider>
        <App />
      </DebubgProvider>
    </AuthProvider>
  </StrictMode>,
)
