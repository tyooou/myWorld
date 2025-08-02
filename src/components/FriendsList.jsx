
import {daves_data, diddyani_data, jamals_data} from "../data/UserData.js";
import MemoryMap from "./MemoryMap.jsx";


export default function FriendsList({onClose, setUserData}) {
    const friends = [diddyani_data, jamals_data, daves_data];

    function handleViewProfile(friend) {
        setUserData(friend)
    }

    return (
        <div className="absolute top-20 left-5text-gray-800 flex flex-col z-10 text-xs font-pixel-arial p-4">
            <div
                style={{
                    background: "#e0e0e0",
                    border: "2px outset #e0e0e0",
                    fontFamily: "pixel-arial, 'MS Sans Serif', sans-serif",
                    fontSize: "11px",
                    width: "300px",
                    margin: "20px auto",
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
                        borderBottom: "2px inset #e0e0e0",
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
                            cursor: "pointer",
                        }}
                        onClick={() => onClose()}
                    >
                        {"\u2715"}
                    </button>
                </div>

                {/* Content area */}
                <div
                    className="p-2"
                    style={{
                        background: "#e0e0e0",
                        minHeight: "150px",
                    }}
                >
                    {friends.map((friend, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between mb-2 p-1"
                            style={{
                                background: "#fff",
                                border: "1px inset #e0e0e0",
                            }}
                        >
                            <div className="flex-1">
                                <span style={{ color: "#000", fontWeight: "normal" }}>
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
                                    marginLeft: "8px",
                                }}
                                onClick={() => handleViewProfile(friend)}
                            >
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>

                {/* Status bar */}
                <div
                    style={{
                        background: "#e0e0e0",
                        borderTop: "2px inset #e0e0e0",
                        padding: "2px 4px",
                        fontSize: "10px",
                        color: "#000",
                    }}
                >
                    {friends.length} friends online
                </div>
            </div>

        </div>
    );
}