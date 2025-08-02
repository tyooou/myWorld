import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import MemoryMap from './components/MemoryMap'
import MainLoader from "./LoadingScreens/MainLoader.jsx";


function App() {
  return (
    <>
    <Header />
     <MemoryMap />
    {/* <MainLoader /> */}
      <Footer />
    </>
  );
}

export default App;
