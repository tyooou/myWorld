import React, { useState, useEffect } from 'react';

const LoadingPage = ({onComplete}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [completedSteps, setCompletedSteps] = useState([]);

    const bootSequence = [
        { text: "═══════════════════════════════════════════════════════════════", color: "text-amber-400" },
        { text: "                      MyWorld v1.0 - Starting Up               ", color: "text-white" },
        { text: "═══════════════════════════════════════════════════════════════", color: "text-amber-400" },
        { text: "", color: "text-white" },
        { text: "INITIALIZING MEMORY MAPPING SYSTEM...", color: "text-cyan-400" },
        { text: "GPS Module:      Active ................................. [ OK ]", color: "text-lime-400" },
        { text: "Location Engine: Ready .................................. [ OK ]", color: "text-lime-400" },
        { text: "", color: "text-white" },
        { text: "Loading Core Components:", color: "text-yellow-300" },
        { text: "┌─────────────────────────┬──────────────────────────────────┐", color: "text-gray-300" },
        { text: "│ Module                  │ Status                           │", color: "text-gray-300" },
        { text: "├─────────────────────────┼──────────────────────────────────┤", color: "text-gray-300" },
        { text: "│ Map Renderer            │ OpenStreetMap Loaded      [ OK ] │", color: "text-gray-300" },
        { text: "│ Pin System              │ Ready for Placement      [ OK ] │", color: "text-gray-300" },
        { text: "│ Image Handler           │ Compression Active        [ OK ] │", color: "text-gray-300" },
        { text: "│ Voice Recorder          │ WebRTC Initialized        [ OK ] │", color: "text-gray-300" },
        { text: "│ Text Editor             │ Rich Text Enabled         [ OK ] │", color: "text-gray-300" },
        { text: "│ Memory Database         │ IndexedDB Connected       [ OK ] │", color: "text-gray-300" },
        { text: "└─────────────────────────┴──────────────────────────────────┘", color: "text-gray-300" },
        { text: "", color: "text-white" },
        { text: "Loading Journal Framework...", color: "text-cyan-400" },
        { text: "  → MapEngine.js ............................ Initializing", color: "text-blue-400" },
        { text: "  → PinManager.js ........................... Loading", color: "text-blue-400" },
        { text: "  → MediaHandler.js ......................... Ready", color: "text-blue-400" },
        { text: "  → JournalCore.js .......................... Mounting", color: "text-blue-400" },
        { text: "  → UserInterface.js ........................ Rendering", color: "text-blue-400" },
        { text: "", color: "text-white" },
        { text: "Connecting to Location Services...", color: "text-cyan-400" },
        { text: "User Position: Detected - Precision: High", color: "text-magenta-400" },
        { text: "Map Tiles: Cached - 2.4MB Available", color: "text-magenta-400" },
        { text: "", color: "text-white" },
        { text: "SYSTEM READY - ALL MODULES LOADED", color: "text-lime-300" },
        { text: "Welcome to MyWorld - Your Visual Journey Begins", color: "text-white" },
        { text: "", color: "text-white" },
        { text: "Ready to capture memories...", color: "text-white" }
    ];

    useEffect(() => {
        // Cursor blinking effect
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, []);

    useEffect(() => {
        if (currentStep < bootSequence.length) {
            const timer = setTimeout(() => {
                setCompletedSteps(prev => [...prev, currentStep]);
                setCurrentStep(prev => prev + 1);
            }, bootSequence[currentStep].text === "" ? 50 : Math.random() * 300 + 150);

            return () => clearTimeout(timer);
        }
    }, [currentStep, bootSequence.length]);

    useEffect(() => {
        if (currentStep >= bootSequence.length) {
            // Wait 1s then call onComplete
            const timer = setTimeout(() => {
                onComplete?.();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, bootSequence.length, onComplete]);

    return (
        <>
            <style jsx>{`
                .dithered-text {
                    position: relative;
                }

                .dithered-text::before {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    color: inherit;
                    opacity: 0.3;
                    transform: translate(0.5px, 0.5px);
                    z-index: -1;
                    background:
                            radial-gradient(circle at 10% 20%, transparent 50%, currentColor 50%, currentColor 60%, transparent 60%),
                            radial-gradient(circle at 30% 40%, transparent 50%, currentColor 50%, currentColor 60%, transparent 60%),
                            radial-gradient(circle at 70% 60%, transparent 50%, currentColor 50%, currentColor 60%, transparent 60%),
                            radial-gradient(circle at 90% 80%, transparent 50%, currentColor 50%, currentColor 60%, transparent 60%);
                    background-size: 4px 4px, 6px 6px, 3px 3px, 5px 5px;
                    background-clip: text;
                    -webkit-background-clip: text;
                }

                .pixel-perfect {
                    image-rendering: pixelated;
                    image-rendering: -moz-crisp-edges;
                    image-rendering: crisp-edges;
                }

                .scan-line {
                    position: relative;
                }

                .scan-line::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(
                            0deg,
                            transparent 49%,
                            rgba(0, 200, 255, 0.02) 50%,
                            transparent 51%
                    );
                    background-size: 100% 3px;
                    pointer-events: none;
                    animation: scanlines 0.1s linear infinite;
                }

                @keyframes scanlines {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(3px); }
                }
            `}</style>

            <div className="min-h-screen bg-black font-mono p-4 scan-line pixel-perfect">
                <div className="w-full h-full">
                    {/* Boot sequence - full screen */}
                    <div className="h-screen overflow-y-auto leading-normal text-sm">
                        {completedSteps.map((stepIndex) => (
                            <div
                                key={stepIndex}
                                className={`mb-1 whitespace-pre ${bootSequence[stepIndex].color} dithered-text`}
                                data-text={bootSequence[stepIndex].text}
                            >
                                {bootSequence[stepIndex].text}
                            </div>
                        ))}

                        {currentStep < bootSequence.length && (
                            <div
                                className={`mb-1 whitespace-pre ${bootSequence[currentStep].color} dithered-text`}
                                data-text={bootSequence[currentStep].text}
                            >
                                {bootSequence[currentStep].text}
                                {bootSequence[currentStep].text !== "" && (
                                    <span className={`ml-1 transition-opacity duration-500 ${showCursor ? 'opacity-100' : 'opacity-0'} text-white dithered-text`}>█</span>
                                )}
                            </div>
                        )}

                        {currentStep >= bootSequence.length && (
                            <div>
                                <span className={`transition-opacity duration-500 ${showCursor ? 'opacity-100' : 'opacity-0'} text-white dithered-text`}>█</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoadingPage;