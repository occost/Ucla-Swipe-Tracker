// pages/index.js (Home page)
'use client'; 

import { useState } from 'react';
import Navbar from "./components/navbar";
import Home from "./components/Home";
import FullMenu from "./components/FullMenu";
import Profile from "./components/Profile";
import Calendar from "./components/Calendar";

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState('Home');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Navbar onPageChange={handlePageChange} />
      {currentPage === 'Home' && <Home />}
      {currentPage === 'FullMenu' && <FullMenu />}
      {currentPage === 'Profile' && <Profile />}
      {currentPage === 'Calendar' && <Calendar />}
    </>
  );
};

export default HomePage;
