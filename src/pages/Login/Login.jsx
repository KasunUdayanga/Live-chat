import React, { useState } from 'react'
import './Login.css'
import  assets from '../../assets/assets'
const Login = () => {

  const[currState,setCurrState]=useState("Sign Up");
  return (
    <div className='login'>
        <img src={assets.logo_big} alt="" className='logo' />
        <form className='login-form'>
          <h2>{currState}</h2>
          {currState ==="Sign Up"?<input type="text" placeholder="Username" className='form-input'required/>:null}
          <input type="email" placeholder="Email address" className='form-input'/>
          <input type="password" placeholder=" Password" className='form-input'/>
          <button type='submit'>{currState ==="Sign Up"?"Create account":"Login now"}</button>
          <div className="login-term">
            <input type="checkbox" />
            <p>Agree to the terms of use & privacy policy</p>
          </div>
          <div className="login-forgot">
            <p className="login-toggle">Already have an account <span onClick={()=>setCurrState("Login")}>click here</span></p>
          </div>

        </form>
    </div>
  )
}
//21.34
export default Login