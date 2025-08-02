import React, {useEffect} from 'react';
import {jamals_data, daves_data, diddyani_data} from './Data/UserData.js';
import {useState} from "react";
import "./App.css";

import SignUp from "./logins/SignUp.jsx";
import Login from "./logins/Login.jsx";
import Header from "./components/Header.jsx";
import MemoryMap from "./components/MemoryMap.jsx";
import Footer from "./components/Footer.jsx";
import FriendsList from "./components/FriendsList.jsx";
import Profile from "./components/Profile.jsx";

const ProfileOverlay = ({onClose}) => (
    <Profile onClose={onClose}/>
);

const FriendsOverlay = ({onClose, setUserData}) => (
    <FriendsList onClose={onClose} setUserData={setUserData}/>
);


function App() {

    const [userData, setUserData] = useState(jamals_data);


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


    const renderOverlay = () => {
    if (currentView === "profile") {
        return <ProfileOverlay onClose={() => setCurrentView(null)} />;
    }
    if (currentView === "friends") {
        return <FriendsOverlay
            onClose={() => setCurrentView(null)}
            setUserData={setUserData}
        />;
    }
        return null;
    };


return (
    <>
        <Header
            onShowProfile={() => (setCurrentView("profile"))}
            onShowFriends={() => setCurrentView("friends")}
        />
        {renderOverlay()}
        <MemoryMap userData={userData}/>
        <Footer/>
    </>
);
}
