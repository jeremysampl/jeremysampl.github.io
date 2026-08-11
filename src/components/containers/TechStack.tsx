import { CSSProperties, useEffect, useId, useMemo, useState } from 'react';
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

type Tier = {
	ring: number;
	iconMax: number;
	iconMin: number;
	/** Distance from ring edge to the icon-center track */
	trackInset: number;
	hubFraction: number;
};

const TIERS: Record<'mobile' | 'tablet' | 'desktop', Tier> = {
	mobile: { ring: 340, iconMax: 50, iconMin: 34, trackInset: 30, hubFraction: 0.68 },
	tablet: { ring: 620, iconMax: 64, iconMin: 42, trackInset: 36, hubFraction: 0.7 },
	desktop: { ring: 980, iconMax: 76, iconMin: 48, trackInset: 42, hubFraction: 0.72 },
};

/**
 * Ring + hub size are independent of how many skills are visible.
 * Only icon size reacts to count (so they don't overlap each other).
 */
function useOrbitGeometry(count: number) {
	const { width, height } = useWindowSize();

	return useMemo(() => {
		const tierKey: keyof typeof TIERS = width >= 1100 ? 'desktop' : width >= 700 ? 'tablet' : 'mobile';
		const tier = TIERS[tierKey];
		const n = Math.max(count, 1);

		const headerPx = height * 0.07;
		const sectionPad = Math.min(40, Math.max(12, width * 0.025));
		const stagePad = width >= 700 ? 24 : 12;
		const labelClearance = 36;
		const chromeY = 72;

		const availableW = width - (sectionPad + stagePad + labelClearance) * 2;
		const availableH = height - headerPx - chromeY - stagePad * 2 - labelClearance;
		// Prefer filling the viewport; soft-cap only to avoid absurd sizes on ultrawide.
		const ring = Math.max(240, Math.min(tier.ring, availableW, availableH));

		// Fixed hub & track — do not change with filter count.
		const hub = ring * tier.hubFraction;
		const radius = ring / 2 - tier.trackInset;

		const circumference = 2 * Math.PI * radius;
		let icon = Math.min(tier.iconMax, Math.max(tier.iconMin, circumference / n / 1.55));

		// Keep a clear gap between hub edge and icon edge.
		const maxIconForGap = Math.max(tier.iconMin, (radius - hub / 2 - 16) * 2);
		icon = Math.min(icon, maxIconForGap);

		return { ring, icon, radius, hub };
	}, [width, height, count]);
}

export default function TechStack() {
	const [category, setCategory] = useState<SkillCategory | 'all'>('all');
	const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
	const [pinnedSkill, setPinnedSkill] = useState<Skill | null>(null);
	const [autoIndex, setAutoIndex] = useState(0);
	const dockId = useId();

	const visibleSkills = useMemo(
		() => skills.filter((skill) => category === 'all' || skill.category === category),
		[category]
	);
	const visibleNames = useMemo(() => new Set(visibleSkills.map((skill) => skill.name)), [visibleSkills]);
	const geometry = useOrbitGeometry(visibleSkills.length);

	useEffect(() => {
		setHoveredSkill(null);
		setPinnedSkill(null);
		setAutoIndex(0);
	}, [category]);

	useEffect(() => {
		if (pinnedSkill || hoveredSkill || visibleSkills.length === 0) {
			return;
		}

		const timer = window.setInterval(() => {
			setAutoIndex((index) => (index + 1) % visibleSkills.length);
		}, AUTO_CYCLE_MS);

		return () => window.clearInterval(timer);
	}, [pinnedSkill, hoveredSkill, visibleSkills.length]);

	const autoSkill = visibleSkills.length ? visibleSkills[autoIndex % visibleSkills.length] : null;
	const activeSkill = hoveredSkill ?? pinnedSkill ?? autoSkill;
	const mode: 'pinned' | 'preview' | 'auto' = pinnedSkill ? 'pinned' : hoveredSkill ? 'preview' : 'auto';
	const isFrozen = Boolean(hoveredSkill || pinnedSkill);
	const angleStep = visibleSkills.length ? 360 / visibleSkills.length : 0;

	function toggleSkill(skill: Skill) {
		setPinnedSkill((current) => (current?.name === skill.name ? null : skill));
	}

	const ringStyle: CSSProperties = {
		width: geometry.ring,
		height: geometry.ring,
		'--icon-size': `${geometry.icon}px`,
		'--radius': `${geometry.radius}px`,
	} as CSSProperties;

	const hubStyle: CSSProperties = { width: geometry.hub, height: geometry.hub };

	return (
		<div className={`orbit${isFrozen ? ' is-frozen' : ''}`}>
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
				<div className="orbit__ring-wrap" style={ringStyle}>
					<span className="orbit__guide" aria-hidden="true" />

					<div className="orbit__ring" role="group" aria-label="Orbiting skills — hover, focus, or tap one">
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
													aria-pressed={isActive}
													aria-controls={dockId}
													aria-hidden={!isVisible}
													tabIndex={isVisible ? 0 : -1}
													onMouseEnter={() => isVisible && setHoveredSkill(skill)}
													onMouseLeave={() => setHoveredSkill(null)}
													onFocus={() => isVisible && setHoveredSkill(skill)}
													onBlur={() => setHoveredSkill(null)}
													onClick={() => isVisible && toggleSkill(skill)}
												>
													<span className="orbit__icon" aria-hidden="true">
														{skill.iconSrc ? (
															<img src={skill.iconSrc} alt="" />
														) : (
															<Icon name={skill.faIcon ?? 'code'} size={22} color="var(--secondary-color)" />
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

					<div id={dockId} className="orbit__hub" style={hubStyle} aria-live="polite">
						{activeSkill ? (
							<>
								<div className="orbit__hub-status">
									<span className={`orbit__hub-dot orbit__hub-dot--${mode}`} aria-hidden="true" />
									<span>
										{mode === 'pinned' ? 'Pinned — tap to release' : mode === 'preview' ? 'Previewing' : 'Auto-cycling'}
									</span>
								</div>

								<div className="orbit__hub-heading">
									<span className="orbit__hub-icon" aria-hidden="true">
										{activeSkill.iconSrc ? (
											<img src={activeSkill.iconSrc} alt="" />
										) : (
											<Icon name={activeSkill.faIcon ?? 'code'} size={32} color="var(--secondary-color)" />
										)}
									</span>
									<strong>{activeSkill.name}</strong>
								</div>

								<p className="orbit__hub-label">Used in</p>
								<ul className="orbit__usages">
									{activeSkill.usages.map((usage, index) => {
										const resolved = resolveSkillUsage(usage);

										return (
											<li
												key={`${activeSkill.name}-${resolved.key}-${index}`}
												className={`orbit__usage orbit__usage--${resolved.kind}`}
											>
												<span className="orbit__usage-icon" aria-hidden="true">
													{resolved.thumbnail ? (
														<img src={resolved.thumbnail} alt="" loading="lazy" />
													) : (
														<Icon
															name={
																resolved.kind === 'experience'
																	? 'briefcase'
																	: resolved.kind === 'site'
																	? 'globe'
																	: 'lightbulb-o'
															}
															size={18}
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
													resolved.kind === 'experience' ? (
														<HashLink
															className="orbit__usage-link"
															smooth
															to={resolved.href}
															scroll={scrollToElementWithHeaderOffset}
															aria-label={`Go to ${resolved.label}`}
														>
															<Icon name="arrow-right" size={14} />
														</HashLink>
													) : (
														<Link
															className="orbit__usage-link"
															to={resolved.href}
															aria-label={`Go to ${resolved.label}`}
														>
															<Icon name="arrow-right" size={14} />
														</Link>
													)
												) : null}
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
