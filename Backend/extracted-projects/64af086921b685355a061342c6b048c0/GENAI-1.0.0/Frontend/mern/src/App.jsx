import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './Auth/pages/Login'
import SignUp from './Auth/pages/SignUp'
import Protected from './Auth/components/Protected'
import Home from './interview/pages/Home'
import Interview from './interview/pages/Interview'
import AllReports from './interview/pages/AllReports'

const App = () => {
  return (
    <div>      
      <BrowserRouter>
      <Routes>
        <Route element={<Protected><Home/></Protected> }path="/"/>
        <Route element={<Login/>} path='/login'/>
        <Route element={<SignUp/>} path='/signup'/>
        <Route element={<Protected><Interview/></Protected>} path="/interview/:interview"/>
        <Route element={<Protected><AllReports/></Protected>} path="/reports"/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App