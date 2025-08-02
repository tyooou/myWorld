import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import MemoryMap from "./components/MemoryMap";
import MainLoader from "./LoadingScreens/MainLoader.jsx";

function App() {
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center bg-white p-[0.125rem]">
        <div className="w-full h-full border border-gray-500 box-border p-2 relative overflow-hidden">
          <Header />
          <div className="flex-1 relative overflow-hidden">
            <MemoryMap />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
