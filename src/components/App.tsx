import React, { useEffect } from 'react';
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import '../styles/global.css';
import Header from './nav/Header';
import Footer from './nav/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import StockAssistPage from './pages/projects/StockAssistPage';
import TerraExodusPage from './pages/projects/TerraExodusPage';
import TicTacToePage from './pages/projects/TicTacToePage';
import BlackjackPage from './pages/projects/BlackjackPage';
import ExperiencePage from './pages/ExperiencePage';
import ContactPage from './pages/ContactPage';
import RCTankPage from "./pages/projects/RCTankPage";

export default function App() {
	return (
		<BrowserRouter>
			<div className="app-shell">
				<RouteChangeListener/>
				<Header/>

				<main className="app-shell__content">
					<Routes>
						<Route path="/" element={<HomePage/>}/>
						<Route path="/about" element={<AboutPage/>}/>
						<Route path="/projects" element={<ProjectsPage/>}/>
						<Route path="/projects/StockAssist" element={<StockAssistPage/>}/>
						<Route path="/projects/TerraExodus" element={<TerraExodusPage/>}/>
						<Route path="/projects/TicTacToe" element={<TicTacToePage/>}/>
						<Route path="/projects/Blackjack" element={<BlackjackPage/>}/>
						<Route path="/projects/RC-Tank" element={<RCTankPage/>}/>
						<Route path="/experience" element={<ExperiencePage/>}/>
						<Route path="/contact" element={<ContactPage/>}/>
						<Route path="/*" element={<Redirect/>}/>
					</Routes>
				</main>
				<Footer/>
			</div>
		</BrowserRouter>
	);
}

function Redirect() {
	useEffect (() => {
		if (window.location.pathname !== "/") {
			(window as any).location = "/";
		}
	}, []);
	return null;
}

function RouteChangeListener() {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return null;
}
