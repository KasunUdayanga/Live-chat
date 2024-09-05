import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const navigate = useNavigate();

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (!userData) {
        console.error('No user data found');
        return;
      }

      setUserData(userData);

      // Navigate based on avatar and name availability
      if (userData.avatar && userData.name) {
        navigate('/chat');
      } else {
        navigate('/profile');
      }

      // Update lastSeen timestamp
      await updateDoc(userRef, { lastSeen: Date.now() });

      // Set interval to update lastSeen every minute
      const intervalId = setInterval(async () => {
        if (auth.currentUser) { // Ensure correct reference to the authenticated user
          await updateDoc(userRef, { lastSeen: Date.now() });
        }
      }, 60000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);

      const unSub = onSnapshot(chatRef, async (res) => {
        const chatData = res.data()?.chatsData || []; // Ensure res.data() exists
        const tempData = [];

        for (const item of chatData) {
          const userRef = doc(db, "users", item.rId); // Changed 'rid' to 'rId'
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          
          if (userData) { // Ensure userData exists before pushing
            tempData.push({ ...item, userData });
          }
        }

        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => {
        unSub(); // Clean up the onSnapshot listener
      };
    }
  }, [userData]);

  const value = {
    userData, setUserData,
    chatData, setChatData,
    loadUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
