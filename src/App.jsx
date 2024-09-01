import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import Profileupdate from './pages/Profileupdate/Profileupdate'

const App = () => {
  return (
    <>
      <Routes>
            <Route path='/'element={<Login/>}/>
            <Route path='/chat'element={<Chat/>}/>
            <Route path='/profile'element={<Profileupdate/>}/>
      </Routes>
    </>
  )
}
//1.2
export default App