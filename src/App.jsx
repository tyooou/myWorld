import React, { useEffect } from 'react';
import { jamals_data, daves_data, diddyani_data } from './Data/UserData.js';
import Header from "./components/Header";
import MemoryMap from './components/MemoryMap';
import Footer from "./components/Footer";

function App() {
  // On first load, seed localStorage with our fake users
  useEffect(() => {
    const LS_KEY = 'myworld_users';
    if (!localStorage.getItem(LS_KEY)) {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          jamals: jamals_data,
          daves: daves_data,
          diddyani: diddyani_data
        })
      );
    }
  }, []);

  return (
    <>
      <Header />
      <MemoryMap />
      <Footer />
    </>
  );
}

export default App;
