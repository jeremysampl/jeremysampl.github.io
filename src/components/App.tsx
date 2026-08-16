import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import '../styles/global.css';
import Header from './nav/Header';
import Footer from './nav/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import ContactPage from './pages/ContactPage';
import ProjectRoute from './pages/ProjectRoute';
import { GalleryLightboxProvider } from './views/GalleryLightbox';

export default function App() {
	return (
		<BrowserRouter>
			<GalleryLightboxProvider>
				<div className="app-shell">
					<RouteChangeListener />
					<Header />

					<main className="app-shell__content">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/about" element={<AboutPage />} />
							<Route path="/projects" element={<ProjectsPage />} />
							<Route path="/projects/:slug" element={<ProjectRoute />} />
							<Route path="/experience" element={<ExperiencePage />} />
							<Route path="/contact" element={<ContactPage />} />
							<Route path="/*" element={<Redirect />} />
						</Routes>
					</main>
					<Footer />
				</div>
			</GalleryLightboxProvider>
		</BrowserRouter>
	);
}

function Redirect() {
	useEffect(() => {
		if (window.location.pathname !== '/') {
			(window as any).location = '/';
		}
	}, []);
	return null;
}

function RouteChangeListener() {
	const location = useLocation();

	// Reset scroll on page changes. Leave hash targets to HashLink.
	useEffect(() => {
		if (location.hash) return;
		window.scrollTo(0, 0);
	}, [location.pathname, location.hash]);

	return null;
}
