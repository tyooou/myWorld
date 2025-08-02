import React, { useState } from 'react';
import LoadingPage from './LoadingPage';
import LoadingPage2 from './LoadingPage2';

const MainLoader = () => {
    const [step, setStep] = useState(1);

    if (step === 1) return <LoadingPage onComplete={() => setStep(2)} />;
    if (step === 2) return <LoadingPage2 onComplete={() => setStep(3)} />;

    // Final app render (after all loading)
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            🎉 All systems ready. Welcome to MyWorld!
        </div>
    );
};

export default MainLoader;