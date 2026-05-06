import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Auth/UI/pages/Login'
import SignUp from './Auth/UI/pages/SignUp'
import Protected from './Auth/UI/components/Protected'
import DebugUI from './DebugAI/UI/DebugUI'
import HistoryPage from './DebugAI/UI/History/HistoryPage'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Protected><DebugUI/></Protected>} />
          <Route path="/history" element={<Protected><HistoryPage/></Protected>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App