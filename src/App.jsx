import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MemoryMap from "./components/MemoryMap";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div className="w-screen h-screen bg-white p-[0.125rem] box-border">
        <div className="w-full h-full border-2 border-gray-300 bg-white relative">
          <Header />
          <MemoryMap />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
