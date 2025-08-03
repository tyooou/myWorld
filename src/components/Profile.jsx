import { React, useState, useRef, useEffect } from "react";
import SystemPanel from "./system/SystemPanel";
import SystemButton from "./system/SystemButton";
import SystemLabel from "./system/SystemLabel";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Mock data since we don't have access to the external file
const jamals_data = {
  profile: {
    username: "JamalCoder",
    age: 25,
    hometown: "San Francisco",
  },
};

export default function Profile({ onClose }) {
  const { username, age, hometown } = jamals_data.profile;

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

  return (
    <SystemPanel
      title="Profile"
      onMouseDown={(e) => handleMouseDown(e)}
      style={{ left: pos.x, top: pos.y, position: "fixed" }}
    >
      <div className="space-y-1 text-gray-800 p-2">
        <div className="flex">
          <SystemLabel text="Username:" />
          <span className="ml-2">{username}</span>
        </div>
        <div className="flex">
          <SystemLabel text="Age:" />
          <span className="ml-2">{age}</span>
        </div>
        <div className="flex">
          <SystemLabel text="Hometown:" />
          <span className="ml-2">{hometown}</span>
        </div>
      </div>
      <div className="flex justify-around py-2 border-t border-t-gray-300">
        <SystemButton text="Log Out" onClick={() => alert("Signing out.")} />
        <SystemButton
          text="Delete Account"
          onClick={() => alert("Deleted account.")}
        />
      </div>
    </SystemPanel>
  );
}
