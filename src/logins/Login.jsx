import React from "react";
import SystemPanel from "../components/system/SystemPanel";
import SystemTextInput from "../components/system/SystemTextInput";
import SystemButton from "../components/system/SystemButton";
import SystemLabel from "../components/system/SystemLabel";

export default function Login({ onLogin, onSwitchToSignUp }) {
  return (
    <>
      {/* Faded black background overlay */}
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[999] pointer-events-auto" />

      {/* Centered panel above the overlay */}
      <SystemPanel
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex items-center justify-center">
          <div className="px-6 py-4">
            <h2 className="text-lg font-bold mb-6 text-center">Log In</h2>
            <div className="space-y-4 text-[9px]">
              {[
                { label: "Email", name: "email", type: "email" },
                { label: "Password", name: "password", type: "password" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <SystemLabel text={label} />
                  <SystemTextInput
                    value={""}
                    placeholder={`Enter ${label.toLowerCase()} here.`}
                  />
                </div>
              ))}
              <SystemButton text="Log In" onClick={onLogin} />
            </div>
            {onSwitchToSignUp && (
              <p className="mt-4 text-center text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignUp}
                  className="text-blue-600 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </SystemPanel>
    </>
  );
}
