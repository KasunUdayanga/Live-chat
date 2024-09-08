import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword, getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, setDoc,doc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";


const firebaseConfig = {
  apiKey: "AIzaSyBqJzS8NuPd5uhE7-YFnNgO-74k14kJPIY",
  authDomain: "live-chat-14023.firebaseapp.com",
  projectId: "live-chat-14023",
  storageBucket: "live-chat-14023.appspot.com",
  messagingSenderId: "31941533532",
  appId: "1:31941533532:web:7b9bd0dcf6a10377faab99"
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

const signup=async (username,email,password)=>{
    try {
        const res=await createUserWithEmailAndPassword(auth,email,password);
        const user=res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey, There i am using live chat",
            lastSeen:Date.now()
           
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatsData:[]
        })
    } catch (error) {
        console.error(error)
        toast.error(error.code)
    }
}

const login=async (email,password)=>{
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error(error)
        toast.error(error.code.spilt('/')[1].spilt('-').join(" "));
    }
}

const logout=async ()=>{
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error)
        toast.error(error.code.spilt('/')[1].spilt('-').join(" "));
    }
   
}

const resetPass =async(email)=>{
    if (!email) {
        toast.error('Please enter a email');
        return null;
    }
    try {
        const useRef =collection(db,'users');
        const q =query(useRef,where('email',"==",email))
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth,email);
            toast.success('Reset email sent successfully');
        }else{
            toast.error("Not send email".error)
        }
    } catch (error) {
        console.error(error);
        toast.error("An error occurred while sending reset email");
    }
}



export{signup,login,logout,auth,db,resetPass}