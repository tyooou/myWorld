import React, { useEffect } from 'react';
import { jamals_data, daves_data, diddyani_data } from './Data/UserData.js';
import { useState } from "react";
import "./App.css";


import Header from "./components/Header";
import MemoryMap from './components/MemoryMap';
import Footer from "./components/Footer";
import MainLoader from "./LoadingScreens/MainLoader.jsx";
import FriendsList from "./components/FriendsList.jsx";
import Profile from "./components/Profile.jsx";




const ProfileOverlay = ({ onClose }) => (
<div className="absolute top-20 left-5 bg-gray-200 text-gray-800 flex flex-col z-10 text-xs font-pixel-arial p-4">
  <button onClick={onClose} className="mb-2 px-2 py-1 bg-red-400 text-white rounded">
    Close Profile
  </button>
  <Profile onClose={onClose}/>
</div>
);




const FriendsOverlay = ({ onClose, changeMap }) => (
<div className="absolute top-20 left-5 bg-gray-200 text-gray-800 flex flex-col z-10 text-xs font-pixel-arial p-4">
  <button onClick={onClose} className="mb-2 px-2 py-1 bg-red-400 text-white rounded">
    Close Friends
  </button>
  <FriendsList onClose={onClose} changeMap={changeMap} />
</div>
);


function App() {
 // On first load, seed localStorage with our fake users
 useEffect(() => {
   const LS_KEY = 'myworld_users';
   if (!localStorage.getItem(LS_KEY)) {
     localStorage.setItem(
       LS_KEY,
       JSON.stringify({
         jamals: jamals_data,
         daves: daves_data,
         diddyani: diddyani_data
       })
     );
   }
 }, []);


const [currentView, setCurrentView] = useState(null); // 'profile' | 'friends' | null
const [currentUser, setCurrentUser] = useState(daves_data); // 'jamals' | 'daves' | 'diddyani'
const [perms,setPerms] = useState(true)


 const changeMap = (friend) => {
   setCurrentUser(friend);
   setPerms(false); // Set permission to false when changing map
 }


 const onBack = () => {
   setCurrentUser(daves_data); // Reset to default user
   setPerms(true); // Reset permission to true
 };


const renderOverlay = () => {
  if (currentView === "profile") {
    return <ProfileOverlay onClose={() => setCurrentView(null)} />;
  }
  if (currentView === "friends") {
    return <FriendsOverlay onClose={() => setCurrentView(null)} changeMap={changeMap} />;
  }
  return null;
};




return (
  <>
      <Header
      onShowProfile={() => setCurrentView("profile")}
      onShowFriends={() => setCurrentView("friends")}
    />
    {renderOverlay()}
     <MemoryMap name={currentUser} permission={perms} onBack={onBack}/>
     <Footer />
  </>
);
}




export default App;


