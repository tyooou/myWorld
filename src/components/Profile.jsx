import React from 'react';

// Mock data since we don't have access to the external file
const jamals_data = {
    profile: {
        username: "JamalCoder",
        age: 25,
        hometown: "San Francisco"
    }
};

export default function Profile({ onClose }) {
    const { username, age, hometown } = jamals_data.profile;

    return (
        <div
            className="absolute top-20 left-5 z-10"
            style={{
                background: "#e0e0e0",
                border: "2px outset #e0e0e0",
                fontFamily: "pixel-arial, 'MS Sans Serif', sans-serif",
                fontSize: "11px",
                width: "200px",
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
                <span>User Profile</span>
                <button
                    onClick={onClose}
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
                >
                    {"\u2715"}
                </button>
            </div>

            {/* Content area */}
            <div
                className="px-2 py-1"
                style={{
                    background: "#e0e0e0",
                    borderBottom: "2px inset #e0e0e0",
                }}
            >
                <div className="space-y-1 text-gray-800">
                    <div>
                        <strong>Username:</strong> {username}
                    </div>
                    <div>
                        <strong>Age:</strong> {age}
                    </div>
                    <div>
                        <strong>Hometown:</strong> {hometown}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div
                className="flex justify-around py-2"
                style={{
                    background: "#e0e0e0",
                    borderTop: "2px inset #e0e0e0",
                }}
            >
                <button
                    style={{
                        background: "#e0e0e0",
                        border: "2px outset #e0e0e0",
                        padding: "2px 6px",
                        fontFamily: "inherit",
                        fontSize: "11px",
                        cursor: "pointer",
                    }}
                    onClick={() => alert("Signing out...")}
                >
                    Sign Out
                </button>

                <button
                    style={{
                        background: "#e0e0e0",
                        border: "2px outset #e0e0e0",
                        padding: "2px 6px",
                        fontFamily: "inherit",
                        fontSize: "11px",
                        cursor: "pointer",
                    }}
                    onClick={() => alert("Deleting account...")}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}