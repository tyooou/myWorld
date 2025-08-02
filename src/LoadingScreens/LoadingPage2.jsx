import React, { useState, useEffect } from 'react';

// CONFIGURATION - Change these values as needed
const LOADING_DURATION = 10000; // Loading duration in milliseconds (10 seconds)
const IMAGE_PATH = '/g1.png'; // PUT YOUR IMAGE FILE PATH HERE

const LoadingPage2 = ({onComplete}) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / LOADING_DURATION) * 100, 100);

            setProgress(newProgress);

            if (newProgress >= 100) {
                setIsComplete(true);
            } else {
                requestAnimationFrame(updateProgress);
            }
        };

        updateProgress();
    }, []);


    useEffect(() => {
        const startTime = Date.now();
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / LOADING_DURATION) * 100, 100);

            setProgress(newProgress);

            if (newProgress >= 100) {
                onComplete?.(); // ✅ Call onComplete
            } else {
                requestAnimationFrame(updateProgress);
            }
        };

        updateProgress();
    }, [onComplete]);



    if (isComplete) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white font-mono text-xl">Loading Complete!</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
            {/* Wavy Image */}
            <div className="mb-12 relative">
                <img
                    src={IMAGE_PATH}
                    alt="Loading"
                    className="w-32 h-32 object-contain"
                    style={{
                        filter: 'contrast(100%) brightness(100%)',
                        imageRendering: 'pixelated',
                        transform: `translateY(${Math.sin(Date.now() * 0.003) * 8}px)`,
                        animation: 'wave 2s ease-in-out infinite'
                    }}
                />
            </div>

            {/* Bitmap Loading Bar */}
            <div className="w-64 mb-4">
                <div className="bg-white p-1">
                    <div className="bg-black h-4 relative overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-100 ease-linear"
                            style={{
                                width: `${progress}%`,
                                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 1px,
                  rgba(255,255,255,0.1) 1px,
                  rgba(255,255,255,0.1) 2px
                )`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Progress Text */}
            <div className="font-mono text-white text-sm tracking-wider">
                {Math.floor(progress)}%
            </div>

            {/* Dither pattern overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0V0zm2 2h1v1H2V2z' fill='%23fff'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat'
                }}
            />

            <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(1deg); }
          50% { transform: translateY(-4px) rotate(0deg); }
          75% { transform: translateY(-12px) rotate(-1deg); }
        }
      `}</style>
        </div>
    );
};

export default LoadingPage2;