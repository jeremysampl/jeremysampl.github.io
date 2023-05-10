import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '../styles/global.css';
import Header from './Nav/Header';
import Footer from './Nav/Footer';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import ProjectsPage from './Pages/ProjectsPage';
import StockAssistPage from './Pages/Projects/StockAssistPage';
import TerraExodusPage from './Pages/Projects/TerraExodusPage';
import TicTacToePage from './Pages/Projects/TicTacToePage';
import BlackjackPage from './Pages/Projects/BlackjackPage';
import ExperiencePage from './Pages/ExperiencePage';
import ContactPage from './Pages/ContactPage';

export default function App() {
	return (
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
				<Route path="/experience" element={<ExperiencePage />}/>
				<Route path="/contact" element={<ContactPage />}/>
				<Route path="/*" element={<Redirect />}/>
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

function Redirect() {
	useEffect (() => {
		if (window.location.pathname !== "/") {
			window.location = "/";
		}
	}, []);
}