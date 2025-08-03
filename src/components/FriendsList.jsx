import {
  daves_data,
  diddyani_data,
  ibra_data,
  jamals_data,
  tyou_data
} from "../Data/UserData.js";

export default function FriendsList({ onClose, changeMap }) {
  // Hard‐coded friends list (excluding current user)
  const friends = [diddyani_data, jamals_data, daves_data, ibra_data, tyou_data];

  // simple username → marker color map
  const userColorMap = {
    wander_joe: "#E74C3C",
    dave_explorer: "#2ECC71",
    mclovin: "#3498DB",
    sesalover123: "#F1C40F",
    ibrahimovic: "#9B59B6"
  };

  // 1. Define regions and collect all memories in those countries,
  //    *annotating each memory with .friend = username*
  const regions = ["Japan", "South Korea", "New Zealand", "Australia"];
  const regionalMemories = friends.flatMap(user =>
    user.memories
      .filter(mem => regions.includes(mem.country))
      .map(mem => ({ ...mem, friend: user.profile.username }))
  );
  const regionalData = {
    profile: { username: "Nearby Memories" },
    memories: regionalMemories
  };

  // 2. Collect all memories from all users for “All Memories”
  const allMemories = friends.flatMap(user =>
    user.memories.map(mem => ({ ...mem, friend: user.profile.username }))
  );
  const allData = {
    profile: { username: "All Memories" },
    memories: allMemories
  };

  function handleViewProfile(data) {
    changeMap(data);
  }

  return (
    <div className="absolute top-20 left-5 text-gray-800 flex flex-col z-10 text-xs font-pixel-arial p-4">
      <div
        style={{
          background: "#e0e0e0",
          border: "2px outset #e0e0e0",
          fontFamily: "pixel-arial, 'MS Sans Serif', sans-serif",
          fontSize: "11px",
          width: "300px",
          margin: "20px auto"
        }}
      >
        {/* Title bar */}
        <div
          className="flex justify-between items-center px-1"
          style={{
            background: "linear-gradient(90deg, #0080ff 0%, #004080 100%)",
            color: "#fff",
            height: "20px",
            lineHeight: "18px",
            fontWeight: "bold",
            borderBottom: "2px inset #e0e0e0"
          }}
        >
          <span>Friends List</span>
          <button
            style={{
              background: "#e0e0e0",
              border: "1px outset #e0e0e0",
              width: "16px",
              height: "16px",
              padding: 0,
              lineHeight: "14px",
              fontSize: "12px",
              cursor: "pointer"
            }}
            onClick={() => onClose()}
          >
            {"\u2715"}
          </button>
        </div>

        {/* Regional Memories Button */}
        <div className="p-2 flex justify-center">
          <button
            onClick={() => handleViewProfile(regionalData)}
            style={{
              background: "#e0e0e0",
              border: "2px outset #e0e0e0",
              padding: "4px 8px",
              cursor: "pointer"
            }}
          >
            Show Nearby Memories
          </button>
        </div>

        {/* All Memories Button */}
        <div className="p-2 flex justify-center">
          <button
            onClick={() => handleViewProfile(allData)}
            style={{
              background: "#e0e0e0",
              border: "2px outset #e0e0e0",
              padding: "4px 8px",
              cursor: "pointer"
            }}
          >
            Show All Memories
          </button>
        </div>

        {/* Content area */}
        <div
          className="p-2"
          style={{
            background: "#e0e0e0",
            minHeight: "150px"
          }}
        >
          {friends.map((friend, idx) => {
            const color = userColorMap[friend.profile.username] || "#000000";
            return (
              <div
                key={idx}
                className="flex items-center justify-between mb-2 p-1"
                style={{
                  background: "#fff",
                  border: "1px inset #e0e0e0"
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
                      marginRight: "6px"
                    }}
                  />
                  <span style={{ color: "#000" }}>
                    {friend.profile.username} | {friend.profile.age}
                  </span>
                </div>
                <button
                  style={{
                    background: "#e0e0e0",
                    border: "2px outset #e0e0e0",
                    padding: "2px 6px",
                    fontFamily: "inherit",
                    fontSize: "11px",
                    cursor: "pointer",
                    marginLeft: "8px"
                  }}
                  onClick={() => changeMap(friend)}
                >
                  View Profile
                </button>
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        <div
          style={{
            background: "#e0e0e0",
            borderTop: "2px inset #e0e0e0",
            padding: "2px 4px",
            fontSize: "10px",
            color: "#000"
          }}
        >
          {friends.length} friends online
        </div>
      </div>
    </div>
  );
}
