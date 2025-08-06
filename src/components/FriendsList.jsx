import {
  daves_data,
  diddyani_data,
  ibra_data,
  jamals_data,
  tyou_data,
} from "../Data/UserData.js";
import MemoryMap from "./MemoryMap.jsx";
import React, { useState, useRef, useEffect } from "react";
import SystemButton from "./system/SystemButton.jsx";
import SystemPanel from "./system/SystemPanel.jsx";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export default function FriendsList({ onClose, changeMap }) {
  const friends = [
    diddyani_data,
    jamals_data,
    daves_data,
    ibra_data,
    tyou_data,
  ]; // simple username → marker color map
  const userColorMap = {
    wander_joe: "#E74C3C", // Jamal – red
    dave_explorer: "#FF69B4", // Dave – pink
    mclovin: "#3498DB", // Diddyani – blue
    sesalover123: "#F1C40F", // Tyou – yellow
    ibrahimovic: "#9B59B6", // Ibra – purple
  };

  // 1. Define regions and collect all memories in those countries,
  //    *annotating each memory with .friend = username*
  const regions = ["Japan", "South Korea", "New Zealand", "Australia"];
  const regionalMemories = friends.flatMap((user) =>
    user.memories
      .filter((mem) => regions.includes(mem.country))
      .map((mem) => ({ ...mem, friend: user.profile.username }))
  );
  const regionalData = {
    profile: { username: "Nearby Memories" },
    memories: regionalMemories,
  };

  // 2. Collect all memories from all users for “All Memories”
  const allMemories = friends.flatMap((user) =>
    user.memories.map((mem) => ({ ...mem, friend: user.profile.username }))
  );
  const allData = {
    profile: { username: "All Memories" },
    memories: allMemories,
  };

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
        {friends.map((friend, idx) => {
          const color = userColorMap[friend.profile.username] || "#000000";
          return (
            <div
              key={idx}
              className="flex items-center justify-between mb-2 p-1"
              style={{
                background: "#fff",
                border: "1px inset #e0e0e0",
              }}
            >
              <div className="flex items-center">
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    marginRight: "6px",
                  }}
                />
                <span style={{ color: "#000" }}>
                  {friend.profile.username} | {friend.profile.age}
                </span>
              </div>

              <SystemButton
                text="View map."
                onClick={() => changeMap(friend)}
              />
            </div>
          );
        })}

        {/* Status bar */}
        <div className="pb-2">
          <SystemButton
            text="View Nearby."
            onClick={() => handleViewProfile(regionalData)}
          />
        </div>
        <div className="pb-2">
          <SystemButton
            text="View All Memories."
            onClick={() => handleViewProfile(allData)}
          />
        </div>
        <div className="pl-2 pb-2">🟢 {friends.length} friends online</div>
      </SystemPanel>
    </div>
  );
}
