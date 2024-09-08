import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages,chatVisible,setChatVisible } =
    useContext(AppContext);
  const [input, setInput] = useState("");

  const sendMsg = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          })
        });
        const userIds = [chatUser.rId, userData.id];

        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
    setInput("");
  };

  const sedImg =async (e)=>{
    try {
      const  fileUrl =await upload(e.target.files[0]);
      if (fileUrl &&  messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          })
        })
        const userIds = [chatUser.rId, userData.id];

        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = "Photo";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });



      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const conveteTime = (timestamp)=>{
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour>12) {
      return hour - 12 + ":"+ minute +"PM";
    }else{
      return hour + ":"+ minute +"AM";
    }
  }

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        const messageData = res.data();
        if (messageData && messageData.messages) {
          setMessages(messageData.messages.reverse());
        }
      });
      
      // Clean up the subscription when the component unmounts or messagesId changes
      return () => unSub();
    }
  }, [messagesId]);
  
  return chatUser ? (
    <div className={`chat-box ${chatVisible?"":"hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}{" "}
          {Date.now()-chatUser.userData.lastSeen <= 7000 ? <img className="dot" src={assets.green_dot} alt="" />: null}
        </p>
        <img src={assets.help_icon} className="help" alt="" />
        <img onClick={()=>{setChatVisible(false)}} src={assets.arrow_icon}className="arrow"  alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg["image"] ?<img src={msg.image} className="msg-img" alt="" />:<p className="msg">{msg.text}</p> }
            
            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt=""
              />
              <p className="time">{conveteTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send message"
        />
        <input onChange={sedImg} id='image'type="file" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMsg} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.chatboxx} alt="" />
      <p>Live With People</p>
    </div>
  );
};

export default ChatBox;
