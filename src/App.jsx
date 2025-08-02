import { useState } from "react";
import "./App.css";


import Header from "./components/Header";
import Footer from "./components/Footer";
import MemoryMap from "./components/MemoryMap";
import MainLoader from "./LoadingScreens/MainLoader.jsx";
import FriendsList from "./components/FriendsList.jsx";
import Profile from "./components/Profile.jsx";


const ProfileOverlay = ({ onClose }) => (
 <div className="absolute top-20 left-5 bg-gray-200 text-gray-800 flex flex-col z-10 text-xs font-pixel-arial p-4">
   <button onClick={onClose} className="mb-2 px-2 py-1 bg-red-400 text-white rounded">
     Close Profile
   </button>
   <Profile />
 </div>
);


const FriendsOverlay = ({ onClose }) => (
 <div className="absolute top-20 left-5 bg-gray-200 text-gray-800 flex flex-col z-10 text-xs font-pixel-arial p-4">
   <button onClick={onClose} className="mb-2 px-2 py-1 bg-red-400 text-white rounded">
     Close Friends
   </button>
   <FriendsList />
 </div>
);


function App() {
 const [currentView, setCurrentView] = useState(null); // 'profile' | 'friends' | null


 const renderOverlay = () => {
   if (currentView === "profile") {
     return <ProfileOverlay onClose={() => setCurrentView(null)} />;
   }
   if (currentView === "friends") {
     return <FriendsOverlay onClose={() => setCurrentView(null)} />;
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
     <MemoryMap />
     {/* <MainLoader /> */}
     <Footer />
   </>
 );
}


export default App;
