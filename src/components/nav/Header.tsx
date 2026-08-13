import React, { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/header.css';

const NAV_ITEMS = [
	{ to: '/', label: 'Home' },
	{ to: '/about', label: 'About' },
	{ to: '/projects', label: 'Projects' },
	{ to: '/experience', label: 'Experience' },
	{ to: '/contact', label: 'Contact' },
] as const;

const MOBILE_NAV_MQ = '(max-width: 800px)';
const HIDE_AFTER_Y = 64;
const REVEAL_UNLOCK_PX = 28;

function headerHeightPx() {
	return (
		parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 64
	);
}

export default function Header() {
	const location = useLocation();
	const menuId = useId();
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const slideRef = useRef<HTMLDivElement>(null);
	const lastScrollY = useRef(0);
	/** 0 = fully visible, headerHeight = fully hidden. Tracks scroll 1:1. */
	const hideOffset = useRef(0);
	const lockedHidden = useRef(false);
	const revealUnlock = useRef(0);

	useEffect(() => {
		const applyOffset = (offset: number, height: number) => {
			const slide = slideRef.current;
			if (!slide) return;
			slide.style.transform = offset > 0.5 ? `translate3d(0, ${-offset}px, 0)` : '';
			slide.style.pointerEvents = offset >= height - 0.5 ? 'none' : '';
		};

		const resetHide = () => {
			hideOffset.current = 0;
			lockedHidden.current = false;
			revealUnlock.current = 0;
			applyOffset(0, headerHeightPx());
		};

		const onScroll = () => {
			const y = Math.max(0, window.scrollY);
			const delta = y - lastScrollY.current;
			const height = headerHeightPx();
			const isMobileNav = window.matchMedia(MOBILE_NAV_MQ).matches;

			setScrolled(y > 8);

			if (!isMobileNav || menuOpen || y < HIDE_AFTER_Y) {
				resetHide();
				lastScrollY.current = y;
				return;
			}

			if (lockedHidden.current) {
				if (delta < 0) {
					revealUnlock.current += -delta;
					if (revealUnlock.current >= REVEAL_UNLOCK_PX) {
						lockedHidden.current = false;
						revealUnlock.current = 0;
						hideOffset.current = Math.min(height, Math.max(0, hideOffset.current + delta));
					}
				} else {
					revealUnlock.current = 0;
				}
			} else {
				hideOffset.current = Math.min(height, Math.max(0, hideOffset.current + delta));
				if (hideOffset.current >= height - 0.5) {
					hideOffset.current = height;
					lockedHidden.current = true;
					revealUnlock.current = 0;
				}
			}

			applyOffset(hideOffset.current, height);
			lastScrollY.current = y;
		};

		lastScrollY.current = window.scrollY;
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, [menuOpen]);

	useEffect(() => {
		setMenuOpen(false);
		hideOffset.current = 0;
		lockedHidden.current = false;
		revealUnlock.current = 0;
		if (slideRef.current) {
			slideRef.current.style.transform = '';
			slideRef.current.style.pointerEvents = '';
		}
	}, [location.pathname]);

	useEffect(() => {
		if (!menuOpen) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMenuOpen(false);
		};

		document.addEventListener('keydown', onKeyDown);
		document.body.classList.add('nav-lock');
		hideOffset.current = 0;
		lockedHidden.current = false;
		revealUnlock.current = 0;
		if (slideRef.current) {
			slideRef.current.style.transform = '';
			slideRef.current.style.pointerEvents = '';
		}

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
			{/* Slide layer for hide-on-scroll; panel stays outside so fixed positioning still works. */}
			<div className="header__slide" ref={slideRef}>
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
				</nav>
			</div>

			<div
				className={`nav__backdrop${menuOpen ? ' is-open' : ''}`}
				onClick={() => setMenuOpen(false)}
				aria-hidden="true"
			/>

			<div id={menuId} className={`nav__panel${menuOpen ? ' is-open' : ''}`}>
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
		</header>
	);
}
