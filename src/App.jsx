import React, { useState, useEffect } from 'react';
import { jamals_data, daves_data, diddyani_data } from './Data/UserData.js';
import SignUp from './logins/SignUp.jsx';
import Login from './logins/Login.jsx';
import Header from './components/Header.jsx';
import MemoryMap from './components/MemoryMap.jsx';
import Footer from './components/Footer.jsx';
import FriendsList from './components/FriendsList.jsx';
import Profile from './components/Profile.jsx';






const ProfileOverlay = ({ onClose }) => (
 <Profile onClose={onClose}/>
);








const FriendsOverlay = ({ onClose, changeMap }) => (
 <FriendsList onClose={onClose} changeMap={changeMap} />
);


export default function App() {
 // 1. All hooks must be unconditionally at top
 const [view, setView] = useState('signup');                // 'signup' | 'login' | 'map'
 const [currentView, setCurrentView] = useState(null);      // for Profile/Friends overlays
 const [currentUser, setCurrentUser] = useState(daves_data); // 'jamals' | 'daves' | 'diddyani'
 const [perms,setPerms] = useState(true)




 useEffect(() => {
  
   localStorage.setItem("wander_joe", JSON.stringify({
    jamals_data
   }))


   localStorage.setItem("diddyani_artsy", JSON.stringify({
     diddyani_data
   }))


   localStorage.setItem("dave_explorer", JSON.stringify({
     daves_data
   }))


  //  localStorage.setItem("oshan", JSON.stringify({
  //    oshan: oshan_data,
  //  }))
  
  }, []);


 // 2. Handlers to swap between views
 const handleSignUp = () => setView('login');
 const handleSwitchToLogin = () => setView('login');
 const handleLogin = () => setView('map');
 const handleSwitchToSignUp = () => setView('signup');


 // 3. Early returns for 'signup' & 'login'
 if (view === 'signup') {
   return (
     <SignUp
       onSignUp={handleSignUp}
       onSwitchToLogin={handleSwitchToLogin}
     />
   );
 }
 if (view === 'login') {
   return (
     <Login
       onLogin={handleLogin}
       onSwitchToSignUp={handleSwitchToSignUp}
     />
   );
 }


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

















