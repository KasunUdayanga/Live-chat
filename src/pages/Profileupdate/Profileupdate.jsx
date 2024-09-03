import React, { useState } from 'react'
import './Profileupdate.css'
import assets from '../../assets/assets'
const Profileupdate = () => {
  const[image,setImage]=useState(false);
  return (
    <div className='profile'>
      <div className="profile-container">
        <form>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" name="" id="avatar" accept='.png, .jpg, .jpeg' hidden />
            <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="avater_icon" />
            upload profile image
          </label>
          <input type="text" placeholder='Your name' required />
          <textarea name=""placeholder='Write profile bio' required id=""></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className='profile-pic' src={image? URL.createObjectURL(image) :assets.picon} alt="" />
      </div>
    </div>
  )
}

export default Profileupdate