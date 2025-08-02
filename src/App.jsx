import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MemoryMap from './components/MemoryMap'
import LoadingPage from "./LoadingScreens/LoadingPage.jsx";
import LoadingPage2 from "./LoadingScreens/LoadingPage2.jsx";
import MainLoader from "./LoadingScreens/MainLoader.jsx";
function App() {

  return (
    <>
      <MainLoader/>
      {/*<MemoryMap />*/}
    </>
  )
}

export default App
