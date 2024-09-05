import React, { useEffect, useState } from 'react';
import './Profileupdate.css';
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const Profileupdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const {setUserData} = useState(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload profile picture");
        return;
      }
      const docRef= doc(db, 'users', uid);
      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
           avatar: imgUrl,
           bio:bio,
           name:name
          })
      }else{
        await updateDoc(docRef, {
          bio:bio,
          name:name
         })
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat')
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
      console.error("Profile update error: ", error);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name) setName(data.name);
          if (data.bio) setBio(data.bio);
          if (data.avatar) setPrevImage(data.avatar);
        }
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden />
            <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="avatar_icon" />
            Upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your name' required />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write profile bio' required />
          <button type='submit'>Save</button>
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) :prevImage ?prevImage : assets.picon} alt="" />
      </div>
    </div>
  )
}

export default Profileupdate;
