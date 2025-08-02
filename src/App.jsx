import React, { useState } from "react";
import "./App.css";

import SignUp from "./logins/SignUp.jsx";
import Login from "./logins/Login.jsx";
import Header from "./components/Header.jsx";
import MemoryMap from "./components/MemoryMap.jsx";
import Footer from "./components/Footer.jsx";
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

export default function App() {
  // overlay (profile/friends) state must be declared unconditionally
  const [currentView, setCurrentView] = useState(null);

  // view: 'signup' | 'login' | 'map'
  const [view, setView] = useState("signup");

  const handleSignUp = () => setView("map");
  const handleSwitchToLogin = () => setView("login");
  const handleLogin = () => setView("map");
  const handleSwitchToSignUp = () => setView("signup");

  if (view === "signup") {
    return (
      <SignUp
        onSignUp={handleSignUp}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }
  if (view === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
    );
  }

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
      <Footer />
    </>
  );
}
