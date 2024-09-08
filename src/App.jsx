import React, { useContext, useEffect } from 'react'
import { Routes,Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import Profileupdate from './pages/Profileupdate/Profileupdate'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext'

const App = () => {
  const navigate=useNavigate();
  const {loadUserData} =useContext(AppContext)

  useEffect(()=>{
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        navigate('/chat')
        await loadUserData(user.uid) // load user data when user is authenticated  //2.33
        
        toast.success(`Welcome ${user.email}`, {autoClose: 3000})
      }else{
       navigate('/')
      }
     // console.log(user) // for debugging purpose only. Uncomment it when you want to see the user info in console.  //2.17
    })
  },[])





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
export default App