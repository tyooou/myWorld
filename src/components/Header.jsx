import React, { useState } from "react";
import SystemTabs from "./system/SystemTabs";
import SystemButton from "./system/SystemButton";

function Header({ onShowProfile, onShowFriends}) {
  const options = ["Profile", "Friends"];
  const [activeTab, setActiveTab] = useState("");

  // Handle tab changes: update activeTab and call the corresponding callback
  function handleSetActive(tab) {
    setActiveTab(tab);
    if (tab === "Profile") {
      onShowProfile();
    } else if (tab === "Friends") {
      onShowFriends();
    }
  }
  
  return (
    <div className="absolute top-0 left-0 w-full bg-gray-200 text-gray-800 flex flex-col z-10 text-[9px] ">
      <div className="bg-gradient-to-r from-blue-900 to-green-500 text-white p-1 font-[pixel]">
        <span className="ml-1">myWorld</span>
      </div>
      <div className="font-[pixel]">
        <SystemTabs
          options={options}
          activeTab={activeTab}
          setActive={handleSetActive}
        />
      </div>
      <div className="flex space-x-2 p-1 font-[pixel]">
        <button onClick={onShowProfile}>Profile</button>
        <button onClick={onShowFriends}>Friends</button>
        

      </div>

    </div>
  );
}

export default Header;

