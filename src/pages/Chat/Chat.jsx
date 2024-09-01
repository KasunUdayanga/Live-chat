import React from 'react'
import './Chat.css'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import ChatBox from '../../components/ChatBox/ChatBox'
import RightSidebBar from '../../components/RightSidebBar/RightSidebBar'
const Chat = () => {
  return (
    <div className='chat'>
      <div className="chat-container">
         <LeftSidebar/>
         <ChatBox/>
         <RightSidebBar/>
      </div>
    </div>
  )
}

export default Chat