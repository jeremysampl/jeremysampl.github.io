import React, { useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/header.css';

const NAV_ITEMS = [
	{ to: '/', label: 'Home' },
	{ to: '/about', label: 'About' },
	{ to: '/projects', label: 'Projects' },
	{ to: '/experience', label: 'Experience' },
	{ to: '/contact', label: 'Contact' },
] as const;

export default function Header() {
	const location = useLocation();
	const menuId = useId();
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		setMenuOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		if (!menuOpen) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMenuOpen(false);
		};

		document.addEventListener('keydown', onKeyDown);
		document.body.classList.add('nav-lock');

		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.body.classList.remove('nav-lock');
		};
	}, [menuOpen]);

	const isHome = location.pathname === '/';

	return (
		<header
			className={[
				'header',
				isHome ? 'header--home' : '',
				scrolled ? 'header--scrolled' : '',
				menuOpen ? 'header--menu-open' : '',
			].filter(Boolean).join(' ')}
		>
			<nav className="nav" aria-label="Primary">
				<Link to="/" className="nav__brand" onClick={() => setMenuOpen(false)}>
					<img
						src="/images/misc/js-logo.svg"
						alt=""
						className="nav__logo"
						width={36}
						height={36}
					/>
					<span className="nav__name">Jeremy Sampl</span>
				</Link>

				<button
					type="button"
					className="nav__toggle"
					aria-expanded={menuOpen}
					aria-controls={menuId}
					aria-label={menuOpen ? 'Close menu' : 'Open menu'}
					onClick={() => setMenuOpen((open) => !open)}
				>
					<span className="nav__toggle-bar" />
					<span className="nav__toggle-bar" />
					<span className="nav__toggle-bar" />
				</button>

				<div
					className={`nav__backdrop${menuOpen ? ' is-open' : ''}`}
					onClick={() => setMenuOpen(false)}
					aria-hidden="true"
				/>

				<div
					id={menuId}
					className={`nav__panel${menuOpen ? ' is-open' : ''}`}
				>
					<ul className="nav__list">
						{NAV_ITEMS.map((item) => {
							const active =
								item.to === '/'
									? location.pathname === '/'
									: location.pathname.startsWith(item.to);

							return (
								<li key={item.to}>
									<Link
										to={item.to}
										className={`nav__link${active ? ' is-active' : ''}`}
										onClick={() => setMenuOpen(false)}
									>
										{item.label}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</nav>
		</header>
	);
}
