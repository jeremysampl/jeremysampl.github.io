import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '../styles/global.css';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ProjectsPage from './ProjectsPage';
import StockAssistPage from './StockAssistPage';
import TerraExodusPage from './TerraExodusPage';
import TicTacToePage from './TicTacToePage';
import BlackjackPage from './BlackjackPage';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/" element={<HomePage />}/>
          <Route path="/about" element={<AboutPage />}/>
          <Route path="/projects" element={<ProjectsPage />}/>
          <Route path="/projects/StockAssist" element={<StockAssistPage />}/>
          <Route path="/projects/TerraExodus" element={<TerraExodusPage />}/>
          <Route path="/projects/TicTacToe" element={<TicTacToePage />}/>
          <Route path="/projects/Blackjack" element={<BlackjackPage />}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}