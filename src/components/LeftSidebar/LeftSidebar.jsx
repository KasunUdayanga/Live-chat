import React, { useContext, useState } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData,chatsData } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
  
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          const searchedUser = querySnap.docs[0].data();
          let userExist = chatsData?.some(user => user.rId === searchedUser.id);
          
          if (!userExist) {
            setUser(searchedUser);
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  
  const addChat = async () => {
    if (!user || !user.id || !userData || !userData.id) {
      console.error("User or UserData is undefined.");
      return;
    }
  
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
  
    try {
      const newMessageRef = doc(messagesRef);
  
      // Create a new message document
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
  
      const currentTime = new Date();
  
      // Update chats for both users
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: currentTime,
          messageSeen: true,
        }),
      });
  
      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: currentTime,
          messageSeen: true,
        }),
      });
    } catch (error) {
      toast.error(error.message);
      console.error("Error updating chats:", error);
    }
  };
  
  

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="imag log" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="menu icon" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="searchicon" />
          <input onChange={inputHandler} type="text" placeholder="Search here.." />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          Array(12)
            .fill("")
            .map((item, index) => (
              <div key={index} className="friends">
                <img src={assets.profile_img} alt="" />
                <div>
                  <p>Kasun Udayanga</p>
                  <span>Hello,How are you?</span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
