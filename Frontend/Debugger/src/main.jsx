import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './Auth/state/auth.context.jsx'
import { DebubgProvider } from './DebugAI/state/debug.context.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FireBaseProvider from './Firebase/FireBaseProvider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FireBaseProvider>
 <AuthProvider>
      <DebubgProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </DebubgProvider>
    </AuthProvider>
    </FireBaseProvider>
   
  </StrictMode>,
)
