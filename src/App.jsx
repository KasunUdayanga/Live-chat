import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import Profileupdate from './pages/Profileupdate/Profileupdate'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <>
    <ToastContainer/>
      <Routes>
            <Route path='/'element={<Login/>}/>
            <Route path='/chat'element={<Chat/>}/>
            <Route path='/profile'element={<Profileupdate/>}/>
      </Routes>
    </>
  )
}
//2.17
export default App