import { daves_data, diddyani_data, jamals_data } from "../Data/UserData.js";
import MemoryMap from "./MemoryMap.jsx";
import React, { useState, useRef, useEffect } from "react";
import SystemButton from "./system/SystemButton.jsx";
import SystemPanel from "./system/SystemPanel.jsx";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export default function FriendsList({ onClose, changeMap }) {
  const friends = [diddyani_data, jamals_data, daves_data];

  const [pos, setPos] = useState({ x: 60, y: 60 });
  const dragData = useRef({
    dragging: false,
    originX: 0,
    originY: 0,
    startX: 0,
    startY: 0,
  });

  const handleMouseDown = (e) => {
    dragData.current = {
      dragging: true,
      originX: e.clientX,
      originY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragData.current.dragging) return;
    const dx = e.clientX - dragData.current.originX;
    const dy = e.clientY - dragData.current.originY;
    const rawX = dragData.current.startX + dx;
    const rawY = dragData.current.startY + dy;
    const x = clamp(rawX, 0, window.innerWidth);
    const y = clamp(rawY, 0, window.innerHeight);
    setPos({ x, y });
  };

  const handleMouseUp = () => {
    dragData.current.dragging = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  function handleViewProfile(friend) {
    changeMap(friend);
  }

  return (
    <div className="absolute top-20 left-5text-gray-800 flex flex-col z-10 text-xs font-pixel-arial p-4">
      <SystemPanel
        title="Friends"
        onMouseDown={(e) => handleMouseDown(e)}
        style={{ left: pos.x, top: pos.y, position: "fixed" }}
      >
        {friends.map((friend, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between mb-2 mt-2 p-[0.125rem]"
            style={{
              background: "#fff",
              border: "1px inset #e0e0e0",
            }}
          >
            <div className="flex-1">
              <span className="ml-2 mr-2">
                {friend.profile.username} | {friend.profile.age} years old
              </span>
            </div>
            <SystemButton
              text="View"
              onClick={() => handleViewProfile(friend)}
            />
          </div>
        ))}

        {/* Status bar */}
        <div className="pl-2 pb-2">🟢 {friends.length} friends online</div>
      </SystemPanel>
    </div>
  );
}
