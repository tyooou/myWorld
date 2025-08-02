import React, { useState } from "react";
import LoadingPage from "./LoadingPage";
import LoadingPage2 from "./LoadingPage2";
import MemoryMap from "../components/MemoryMap";

const MainLoader = () => {
  const [step, setStep] = useState(2);

  if (step === 2) return <LoadingPage2 onComplete={() => setStep(3)} />;

  // Final app render (after all loading)
  return <MemoryMap />;
};

export default MainLoader;
