import {
	CSSProperties,
	DragEvent,
	MouseEvent,
	PointerEvent,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import Icon from '../displays/Icon';
import useWindowSize from '../../hooks/useWindowSize';
import { scrollToElementWithHeaderOffset } from '../../utils/scroll';
import {
	Skill,
	SkillCategory,
	resolveSkillUsage,
	skillCategories,
	skills,
} from '../../data/skills';
import '../../styles/tech-stack.css';

const AUTO_CYCLE_MS = 3400;
/** Degrees per second for the idle spin (~62s per turn). */
const SPIN_DEG_PER_SEC = 360 / 62;
const DRAG_START_PX_MOUSE = 6;
const DRAG_START_PX_TOUCH = 36;
const DRAG_START_ANGLE_TOUCH = 16;
const INERTIA_FRICTION = 0.925;
const INERTIA_MIN_VELOCITY = 0.02;
/** Delay before mouse hover starts previewing a skill in the ring. */
const PREVIEW_HOVER_MS = 100;
/** Grace period after leaving an icon before preview ends (moving between neighbours). */
const PREVIEW_HOVER_LEAVE_MS = 200;

type Tier = {
	ring: number;
	iconMax: number;
	iconMin: number;
	/** How far the icon centers sit in from the ring edge */
	trackInset: number;
	hubFraction: number;
};

const TIERS: Record<'mobile' | 'tablet' | 'desktop', Tier> = {
	mobile: { ring: 560, iconMax: 56, iconMin: 34, trackInset: 28, hubFraction: 0.7 },
	tablet: { ring: 620, iconMax: 64, iconMin: 42, trackInset: 36, hubFraction: 0.7 },
	desktop: { ring: 950, iconMax: 76, iconMin: 48, trackInset: 42, hubFraction: 0.68 },
};

/** True for mouse/trackpad hover, not coarse touch pointers. */
function useFineHover() {
	const [fineHover, setFineHover] = useState(
		() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
	);

	useEffect(() => {
		const media = window.matchMedia('(hover: hover) and (pointer: fine)');
		const sync = () => setFineHover(media.matches);
		sync();
		media.addEventListener('change', sync);
		return () => media.removeEventListener('change', sync);
	}, []);

	return fineHover;
}

function angleFromCenter(clientX: number, clientY: number, el: HTMLElement) {
	const rect = el.getBoundingClientRect();
	const cx = rect.left + rect.width / 2;
	const cy = rect.top + rect.height / 2;
	return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
}

function shortestAngleDelta(from: number, to: number) {
	let delta = to - from;
	while (delta > 180) delta -= 360;
	while (delta < -180) delta += 360;
	return delta;
}

/**
 * Fixed ring size for a given viewport; icons shrink if the ring gets crowded.
 * Portrait phones crop the sides. Landscape phones use near-full width and scroll vertically.
 */
function useOrbitGeometry(count: number) {
	const { width, height } = useWindowSize();

	return useMemo(() => {
		const tierKey: keyof typeof TIERS = width >= 1100 ? 'desktop' : width >= 700 ? 'tablet' : 'mobile';
		const tier = TIERS[tierKey];
		const n = Math.max(count, 1);
		const isLandscape = width > height;
		const isPortraitPhone = width < 700 && !isLandscape;
		const isLandscapePhone = width < 1100 && isLandscape;

		let ring: number;
		let cropMode: 'sides' | null = null;

		if (isLandscapePhone) {
			// Near full width with a little inset so icons do not widen the page.
			ring = Math.max(400, Math.min(width - 24, width * 0.94));
		} else if (isPortraitPhone) {
			const minCrop = width * 1.28;
			const maxCrop = Math.min(tier.ring, width * 1.48);
			ring = Math.max(300, Math.min(maxCrop, Math.max(minCrop, width * 1.36)));
			cropMode = ring > width + 8 ? 'sides' : null;
		} else {
			const headerPx =
				parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 64;
			const sectionPad = Math.min(40, Math.max(12, width * 0.025));
			const stagePad = 24;
			const labelClearance = 36;
			const availableW = width - (sectionPad + stagePad + labelClearance) * 2;
			if (tierKey === 'desktop') {
				// Slightly below the full tier size; trim only when the viewport is genuinely short.
				const heightCap = height - headerPx - 70;
				ring = Math.max(240, Math.min(tier.ring, availableW, Math.max(heightCap, tier.ring - 36)));
			} else {
				const chromeY = 72 + stagePad * 2 + labelClearance;
				const availableH = height - headerPx - chromeY;
				ring = Math.max(240, Math.min(tier.ring, availableW, availableH));
			}
		}

		const hubCap = cropMode === 'sides'
			? width * 0.78
			: isLandscapePhone
				? width * 0.72
				: ring;
		const hub = Math.min(ring * tier.hubFraction, hubCap);
		const radius = ring / 2 - tier.trackInset;

		const circumference = 2 * Math.PI * radius;
		let icon = Math.min(tier.iconMax, Math.max(tier.iconMin, circumference / n / 1.55));

		const maxIconForGap = Math.max(tier.iconMin, (radius - hub / 2 - 16) * 2);
		icon = Math.min(icon, maxIconForGap);

		return { ring, icon, radius, hub, cropMode, isLandscapePhone };
	}, [width, height, count]);
}

function useUsagesScrollPassThrough(activeKey: string | undefined) {
	const ref = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const sync = () => {
			const scrollable = el.scrollHeight > el.clientHeight + 1;
			el.classList.toggle('is-scrollable', scrollable);
			if (!scrollable) {
				el.scrollTop = 0;
			}
		};

		sync();
		const observer = new ResizeObserver(sync);
		observer.observe(el);
		window.addEventListener('resize', sync);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', sync);
		};
	}, [activeKey]);

	return ref;
}

export default function TechStack() {
	const [category, setCategory] = useState<SkillCategory | 'all'>('all');
	const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
	const [pinnedSkill, setPinnedSkill] = useState<Skill | null>(null);
	const [autoIndex, setAutoIndex] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const dockId = useId();
	const fineHover = useFineHover();

	const ringWrapRef = useRef<HTMLDivElement>(null);
	const rotationRef = useRef(0);
	const dragPointerId = useRef<number | null>(null);
	const dragLastAngle = useRef(0);
	const dragOrigin = useRef({ x: 0, y: 0 });
	const dragMoved = useRef(false);
	const suppressClick = useRef(false);
	const velocityRef = useRef(0);
	const lastMoveStamp = useRef(0);
	const inertiaFrame = useRef<number | null>(null);
	const spinFrame = useRef<number | null>(null);
	const previewEnterTimerRef = useRef<number | null>(null);
	const previewLeaveTimerRef = useRef<number | null>(null);
	const hoveredSkillRef = useRef<Skill | null>(null);

	function clearPreviewEnterTimer() {
		if (previewEnterTimerRef.current != null) {
			window.clearTimeout(previewEnterTimerRef.current);
			previewEnterTimerRef.current = null;
		}
	}

	function clearPreviewLeaveTimer() {
		if (previewLeaveTimerRef.current != null) {
			window.clearTimeout(previewLeaveTimerRef.current);
			previewLeaveTimerRef.current = null;
		}
	}

	function clearPreviewHoverTimers() {
		clearPreviewEnterTimer();
		clearPreviewLeaveTimer();
	}

	function scheduleHoverPreview(skill: Skill) {
		clearPreviewLeaveTimer();
		clearPreviewEnterTimer();

		if (hoveredSkillRef.current) {
			setHoveredSkill(skill);
			return;
		}

		previewEnterTimerRef.current = window.setTimeout(() => {
			previewEnterTimerRef.current = null;
			setHoveredSkill(skill);
		}, PREVIEW_HOVER_MS);
	}

	function scheduleHoverLeave() {
		clearPreviewEnterTimer();
		clearPreviewLeaveTimer();
		previewLeaveTimerRef.current = window.setTimeout(() => {
			previewLeaveTimerRef.current = null;
			setHoveredSkill(null);
		}, PREVIEW_HOVER_LEAVE_MS);
	}

	function cancelHoverPreview() {
		clearPreviewHoverTimers();
		setHoveredSkill(null);
	}

	function applyRotation(next: number) {
		rotationRef.current = next;
		const wrap = ringWrapRef.current;
		if (wrap) {
			wrap.style.setProperty('--orbit-rotation', `${next}deg`);
		}
	}

	const visibleSkills = useMemo(
		() => skills.filter((skill) => category === 'all' || skill.category === category),
		[category]
	);
	const visibleNames = useMemo(() => new Set(visibleSkills.map((skill) => skill.name)), [visibleSkills]);
	const geometry = useOrbitGeometry(visibleSkills.length);

	useEffect(() => {
		hoveredSkillRef.current = hoveredSkill;
	}, [hoveredSkill]);

	useEffect(() => {
		clearPreviewHoverTimers();
		setHoveredSkill(null);
		setPinnedSkill(null);
		setAutoIndex(0);
	}, [category]);

	const previewSkill = fineHover ? hoveredSkill : null;
	const isFrozen = Boolean(previewSkill || pinnedSkill);
	const isAutoCycling = !isFrozen && !isDragging && visibleSkills.length > 0;

	// Idle spin (paused while frozen or dragging; inertia handles release).
	useEffect(() => {
		if (isFrozen || isDragging) {
			if (spinFrame.current != null) {
				cancelAnimationFrame(spinFrame.current);
				spinFrame.current = null;
			}
			return;
		}

		let last = performance.now();

		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			applyRotation(rotationRef.current + SPIN_DEG_PER_SEC * dt);
			spinFrame.current = requestAnimationFrame(tick);
		};

		spinFrame.current = requestAnimationFrame(tick);
		return () => {
			if (spinFrame.current != null) {
				cancelAnimationFrame(spinFrame.current);
				spinFrame.current = null;
			}
		};
	}, [isFrozen, isDragging]);

	useEffect(() => {
		return () => {
			clearPreviewHoverTimers();
			if (inertiaFrame.current != null) {
				cancelAnimationFrame(inertiaFrame.current);
			}
			if (spinFrame.current != null) {
				cancelAnimationFrame(spinFrame.current);
			}
		};
	}, []);

	useEffect(() => {
		const endOrphanPointer = (event: globalThis.PointerEvent) => {
			if (dragPointerId.current == null || dragPointerId.current !== event.pointerId) {
				return;
			}
			if (dragMoved.current) {
				return;
			}
			dragPointerId.current = null;
		};

		window.addEventListener('pointerup', endOrphanPointer);
		window.addEventListener('pointercancel', endOrphanPointer);
		return () => {
			window.removeEventListener('pointerup', endOrphanPointer);
			window.removeEventListener('pointercancel', endOrphanPointer);
		};
	}, []);

	function stopInertia() {
		if (inertiaFrame.current != null) {
			cancelAnimationFrame(inertiaFrame.current);
			inertiaFrame.current = null;
		}
		velocityRef.current = 0;
	}

	function startInertia() {
		stopInertia();
		let last = performance.now();

		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			velocityRef.current *= Math.pow(INERTIA_FRICTION, dt * 60);

			if (Math.abs(velocityRef.current) < INERTIA_MIN_VELOCITY) {
				inertiaFrame.current = null;
				velocityRef.current = 0;
				setIsDragging(false);
				return;
			}

			applyRotation(rotationRef.current + velocityRef.current * dt * 60);
			inertiaFrame.current = requestAnimationFrame(tick);
		};

		inertiaFrame.current = requestAnimationFrame(tick);
	}

	function onRingPointerDown(event: PointerEvent<HTMLDivElement>) {
		if (event.button !== 0 && event.pointerType === 'mouse') {
			return;
		}
		const target = event.target as HTMLElement | null;
		if (target?.closest('.orbit__hub')) {
			return;
		}

		const wrap = ringWrapRef.current;
		if (!wrap) return;

		// Don't capture yet so clicks and vertical page scroll still work.
		stopInertia();
		dragPointerId.current = event.pointerId;
		dragLastAngle.current = angleFromCenter(event.clientX, event.clientY, wrap);
		dragOrigin.current = { x: event.clientX, y: event.clientY };
		dragMoved.current = false;
		suppressClick.current = false;
		velocityRef.current = 0;
		lastMoveStamp.current = performance.now();
	}

	function onRingPointerMove(event: PointerEvent<HTMLDivElement>) {
		if (dragPointerId.current !== event.pointerId) return;
		const wrap = ringWrapRef.current;
		if (!wrap) return;

		const dx = event.clientX - dragOrigin.current.x;
		const dy = event.clientY - dragOrigin.current.y;
		const distance = Math.hypot(dx, dy);
		const angle = angleFromCenter(event.clientX, event.clientY, wrap);
		const angleDelta = Math.abs(shortestAngleDelta(dragLastAngle.current, angle));
		const isTouch = event.pointerType === 'touch' || event.pointerType === 'pen';

		if (!dragMoved.current) {
			if (isTouch) {
				// Prefer vertical page scroll until the gesture is clearly along the ring.
				const mostlyVertical = Math.abs(dy) > Math.abs(dx) * 1.15;
				if (mostlyVertical && angleDelta < DRAG_START_ANGLE_TOUCH + 6) {
					return;
				}
				if (distance < DRAG_START_PX_TOUCH && angleDelta < DRAG_START_ANGLE_TOUCH) {
					return;
				}
				if (angleDelta < DRAG_START_ANGLE_TOUCH * 0.65 && distance < DRAG_START_PX_TOUCH * 1.35) {
					return;
				}
			} else if (distance < DRAG_START_PX_MOUSE) {
				return;
			}

			dragMoved.current = true;
			suppressClick.current = true;
			setIsDragging(true);
			dragLastAngle.current = angle;
			lastMoveStamp.current = performance.now();
			wrap.setPointerCapture(event.pointerId);
			event.preventDefault();
			return;
		}

		const delta = shortestAngleDelta(dragLastAngle.current, angle);
		const now = performance.now();
		const dt = Math.max(1, now - lastMoveStamp.current);

		dragLastAngle.current = angle;
		lastMoveStamp.current = now;
		velocityRef.current = delta / (dt / 16.67);
		applyRotation(rotationRef.current + delta);
		event.preventDefault();
	}

	function onRingPointerUp(event: PointerEvent<HTMLDivElement>) {
		if (dragPointerId.current !== event.pointerId) return;
		dragPointerId.current = null;

		const wrap = ringWrapRef.current;
		if (wrap?.hasPointerCapture(event.pointerId)) {
			wrap.releasePointerCapture(event.pointerId);
		}

		if (!dragMoved.current) {
			return;
		}

		if (Math.abs(velocityRef.current) > INERTIA_MIN_VELOCITY * 4) {
			startInertia();
		} else {
			velocityRef.current = 0;
			setIsDragging(false);
		}
	}

	function onRingDragStart(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
	}

	const autoSkill = visibleSkills.length ? visibleSkills[autoIndex % visibleSkills.length] : null;
	const activeSkill = previewSkill ?? pinnedSkill ?? autoSkill;
	const mode: 'pinned' | 'preview' | 'auto' = pinnedSkill ? 'pinned' : previewSkill ? 'preview' : 'auto';
	const angleStep = visibleSkills.length ? 360 / visibleSkills.length : 0;
	const usagesRef = useUsagesScrollPassThrough(activeSkill?.name);

	function toggleSkill(skill: Skill, event?: MouseEvent<HTMLElement>) {
		if (event && suppressClick.current) {
			suppressClick.current = false;
			event.preventDefault();
			return;
		}

		const unpinning = pinnedSkill?.name === skill.name;
		clearPreviewHoverTimers();
		setHoveredSkill(null);

		if (unpinning) {
			const resumeIndex = visibleSkills.findIndex((entry) => entry.name === skill.name);
			if (resumeIndex >= 0) {
				setAutoIndex(resumeIndex);
			}
			setPinnedSkill(null);
			event?.currentTarget.blur();
			return;
		}

		setPinnedSkill(skill);
	}

	const ringStyle: CSSProperties = {
		width: geometry.ring,
		height: geometry.ring,
		'--icon-size': `${geometry.icon}px`,
		'--radius': `${geometry.radius}px`,
		'--orbit-rotation': `${rotationRef.current}deg`,
	} as CSSProperties;

	const hubStyle: CSSProperties = { width: geometry.hub, height: geometry.hub };
	const hubCyclePad = Math.max(8, Math.round(geometry.hub * 0.022));
	const hubCycleStyle: CSSProperties = {
		width: geometry.hub + hubCyclePad * 2,
		height: geometry.hub + hubCyclePad * 2,
	};
	const cropClass = geometry.cropMode === 'sides' ? ' orbit--edge-crop orbit--edge-crop-x' : '';
	const landscapeClass = geometry.isLandscapePhone ? ' orbit--landscape' : '';
	const dragClass = isDragging ? ' is-dragging' : '';

	return (
		<div className={`orbit${isFrozen ? ' is-frozen' : ''}${cropClass}${landscapeClass}${dragClass}`}>
			<div className="orbit__tabs" role="tablist" aria-label="Skill categories">
				{skillCategories.map((option) => {
					const selected = category === option.id;
					return (
						<button
							key={option.id}
							type="button"
							role="tab"
							aria-selected={selected}
							className={`orbit__tab${selected ? ' is-active' : ''}`}
							onClick={() => setCategory(option.id)}
						>
							{option.label}
						</button>
					);
				})}
			</div>

			<div className="orbit__stage">
				<div
					className="orbit__ring-wrap"
					ref={ringWrapRef}
					style={ringStyle}
					onPointerDown={onRingPointerDown}
					onPointerMove={onRingPointerMove}
					onPointerUp={onRingPointerUp}
					onPointerCancel={onRingPointerUp}
					onDragStart={onRingDragStart}
				>
					<span className="orbit__guide" aria-hidden="true" />

					<div className="orbit__ring" role="group" aria-label="Skills">
						{skills.map((skill) => {
							const isVisible = visibleNames.has(skill.name);
							const visibleIndex = isVisible
								? visibleSkills.findIndex((entry) => entry.name === skill.name)
								: -1;
							const isActive = isVisible && activeSkill?.name === skill.name;
							const angle = isVisible ? visibleIndex * angleStep : 0;

							return (
								<div
									key={skill.technologyId}
									className={`orbit__item${isVisible ? '' : ' is-hidden'}${isActive ? ' is-active' : ''}`}
									aria-hidden={!isVisible}
									style={
										{
											'--angle': `${angle}deg`,
											zIndex: isActive ? 30 : isVisible ? 1 : 0,
										} as CSSProperties
									}
								>
									<div className="orbit__item-offset">
										<div className="orbit__spin-cancel">
											<div className={`orbit__node${isActive ? ' is-active' : ''}`}>
												<button
													type="button"
													className="orbit__icon-btn"
													aria-pressed={pinnedSkill?.name === skill.name}
													aria-controls={dockId}
													aria-hidden={!isVisible}
													tabIndex={isVisible ? 0 : -1}
													onMouseEnter={() => fineHover && isVisible && scheduleHoverPreview(skill)}
													onMouseLeave={() => fineHover && scheduleHoverLeave()}
													onFocus={() => {
														clearPreviewHoverTimers();
														fineHover && isVisible && setHoveredSkill(skill);
													}}
													onBlur={() => cancelHoverPreview()}
													onClick={(event) => isVisible && toggleSkill(skill, event)}
												>
													<span className="orbit__icon" aria-hidden="true">
														{skill.iconSrc ? (
															<img src={skill.iconSrc} alt="" draggable={false} />
														) : (
															<Icon name={skill.faIcon ?? 'code'} color="var(--secondary-color)" />
														)}
													</span>
												</button>
												<span className="orbit__name">{skill.name}</span>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{isAutoCycling ? (
						<div className="orbit__hub-cycle" style={hubCycleStyle} aria-hidden="true">
							<svg className="orbit__hub-cycle-svg" viewBox="0 0 100 100">
								<circle className="orbit__hub-cycle-track" cx="50" cy="50" r="48.5" />
								{/* Rotated so the stroke grows clockwise from 12 o'clock */}
								<g transform="rotate(-90 50 50)">
									<circle
										key={autoIndex}
										className="orbit__hub-cycle-bar"
										cx="50"
										cy="50"
										r="48.5"
										pathLength={1}
										style={{ animationDuration: `${AUTO_CYCLE_MS}ms` }}
										onAnimationEnd={(event) => {
											if (event.animationName !== 'orbit-hub-cycle') return;
											setAutoIndex((index) => (index + 1) % visibleSkills.length);
										}}
									/>
								</g>
							</svg>
						</div>
					) : null}

					<div id={dockId} className="orbit__hub" style={hubStyle} aria-live="polite">
						{activeSkill ? (
							<>
								<div className="orbit__hub-status">
									<span className={`orbit__hub-dot orbit__hub-dot--${mode}`} aria-hidden="true" />
									<span>
										{mode === 'pinned' ? 'Pinned (tap to unpin)' : mode === 'preview' ? 'Previewing' : 'Auto-cycling'}
									</span>
								</div>

								<button
									type="button"
									className="orbit__hub-heading"
									aria-pressed={pinnedSkill?.name === activeSkill.name}
									aria-label={
										pinnedSkill?.name === activeSkill.name
											? `Unpin ${activeSkill.name}`
											: `Pin ${activeSkill.name}`
									}
									onClick={() => toggleSkill(activeSkill)}
								>
									<span className="orbit__hub-icon" aria-hidden="true">
										{activeSkill.iconSrc ? (
											<img src={activeSkill.iconSrc} alt="" draggable={false} />
										) : (
											<Icon name={activeSkill.faIcon ?? 'code'} color="var(--secondary-color)" />
										)}
									</span>
									<strong>{activeSkill.name}</strong>
								</button>

								<p className="orbit__hub-label">Used in</p>
								<ul ref={usagesRef} className="orbit__usages">
									{activeSkill.usages.map((usage, index) => {
										const resolved = resolveSkillUsage(usage);
										const className = `orbit__usage orbit__usage--${resolved.kind}${resolved.href ? ' orbit__usage--link' : ''}`;
										const body = (
											<>
												<span className="orbit__usage-icon" aria-hidden="true">
													{resolved.thumbnail ? (
														<img src={resolved.thumbnail} alt="" loading="lazy" draggable={false} />
													) : (
														<Icon
															name={
																resolved.kind === 'experience'
																	? 'briefcase'
																	: resolved.kind === 'site'
																	? 'globe'
																	: 'lightbulb-o'
															}
															color={resolved.kind === 'general' ? '#777' : 'var(--secondary-color)'}
														/>
													)}
												</span>
												<span className="orbit__usage-text">
													<span className="orbit__usage-label">{resolved.label}</span>
													{resolved.sublabel ? (
														<span className="orbit__usage-sublabel">{resolved.sublabel}</span>
													) : null}
												</span>
												{resolved.href ? (
													<span className="orbit__usage-arrow" aria-hidden="true">
														<Icon name="arrow-right" />
													</span>
												) : null}
											</>
										);

										return (
											<li key={`${activeSkill.name}-${resolved.key}-${index}`}>
												{resolved.href && resolved.kind === 'experience' ? (
													<HashLink
														className={className}
														smooth
														to={resolved.href}
														scroll={scrollToElementWithHeaderOffset}
													>
														{body}
													</HashLink>
												) : resolved.href ? (
													<Link className={className} to={resolved.href}>
														{body}
													</Link>
												) : (
													<div className={className}>{body}</div>
												)}
											</li>
										);
									})}
								</ul>
							</>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
