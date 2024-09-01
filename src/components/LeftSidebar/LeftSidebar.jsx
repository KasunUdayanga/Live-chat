import React from 'react'
import "./LeftSidebar.css"
import assets from '../../assets/assets'
const LeftSidebar = () => {
  return (
    <div className='ls'>
        <div className="is-top">
            <div className="ls-nav">
                <img src={assets.logo} alt="imag log"className='logo' />
                <div className="menu">
                    <img src={assets.menu_icon} alt="menu icon" />
                </div>
            </div>
            <div className="ls-search">
                <img src={assets.search_icon} alt="searchicon" />
                <input type="text" placeholder='Search here..' />
            </div>
        </div>
        <div className="ls-list">
            <div className="friends">
                <img src={assets.profile_img} alt="" />
                <p>Kasun Udayanga</p>
                <span>Hello,How are you?  </span>
            </div>
        </div>
    </div>
  )
}

export default LeftSidebar