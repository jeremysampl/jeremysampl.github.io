import React, { useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import Icon from '../displays/Icon';
import {
	type TechnologyId,
	getTechnology,
	technologyIconSrc,
} from '../../data/technologies';

export type TechnologyChild = {
	id: TechnologyId;
	description?: string;
};

export type TechnologyItem = {
	id: TechnologyId;
	/** If any item is featured, only those show as chips; the rest go under Others. */
	featured?: boolean;
	subtitle?: string;
	description?: string;
	children?: TechnologyChild[];
};

type ResolvedTech = {
	id: TechnologyId;
	name: string;
	iconSrc?: string;
	faIcon?: string;
	subtitle?: string;
	description?: string;
	children: Array<{
		id: TechnologyId;
		name: string;
		iconSrc?: string;
		faIcon?: string;
		description?: string;
	}>;
};

function resolveTech(item: TechnologyItem): ResolvedTech {
	const technology = getTechnology(item.id);
	return {
		id: technology.id,
		name: technology.name,
		iconSrc: technologyIconSrc(technology),
		faIcon: technology.faIcon,
		subtitle: item.subtitle,
		description: item.description,
		children: (item.children ?? []).map((child) => {
			const nested = getTechnology(child.id);
			return {
				id: nested.id,
				name: nested.name,
				iconSrc: technologyIconSrc(nested),
				faIcon: nested.faIcon,
				description: child.description,
			};
		}),
	};
}

function TechIcon({
	iconSrc,
	faIcon,
	size = 18,
}: {
	iconSrc?: string;
	faIcon?: string;
	size?: number;
}) {
	if (iconSrc) {
		return <img src={iconSrc} alt="" />;
	}
	return <Icon name={faIcon ?? 'code'} size={size} color="var(--secondary-color)" />;
}

export default function TechnologyChips({ technologies, label = 'Built with' }: {
	technologies: TechnologyItem[];
	label?: string;
}) {
	const [modalOpen, setModalOpen] = useState(false);
	const titleId = useId();
	const { pathname } = useLocation();

	useEffect(() => {
		setModalOpen(false);
	}, [pathname]);

	const resolved = useMemo(() => technologies.map(resolveTech), [technologies]);
	const hasFeaturedFlags = technologies.some((item) => item.featured);
	const visible = hasFeaturedFlags
		? resolved.filter((_, index) => technologies[index].featured)
		: resolved;
	const hiddenCount = Math.max(
		0,
		resolved.length
			+ (resolved.reduce((sum, item) => sum + item.children.length, 0))
			- visible.length
	);

	if (!resolved.length) return null;

	return (
		<>
			<div className="stack-tech">
				<p className="stack-tech__label">{label}</p>
				<ul className="tech-chips" aria-label="Technologies used">
					{visible.map((technology) => (
						<TechnologyChip key={technology.id} technology={technology} />
					))}
					{hiddenCount > 0 ? (
						<li>
							<button
								type="button"
								className="tech-chip tech-chip--others"
								onClick={() => setModalOpen(true)}
								aria-haspopup="dialog"
							>
								<span className="tech-chip__others-count">+{hiddenCount}</span>
								<span className="tech-chip__name">
									{hiddenCount === 1 ? 'Other' : 'Others'}
								</span>
							</button>
						</li>
					) : null}
				</ul>
			</div>

			{modalOpen ? (
				<TechnologyDetailsModal
					titleId={titleId}
					technologies={resolved}
					onClose={() => setModalOpen(false)}
				/>
			) : null}
		</>
	);
}

function TechnologyChip({ technology }: { technology: ResolvedTech }) {
	const [isHover, setIsHover] = useState(false);

	return (
		<li
			className={`tech-chip${isHover ? ' is-hover' : ''}`}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			title={technology.subtitle ?? technology.name}
		>
			<span className="tech-chip__icon" aria-hidden="true">
				<TechIcon iconSrc={technology.iconSrc} faIcon={technology.faIcon} />
			</span>
			<span className="tech-chip__name">{technology.name}</span>
			{technology.subtitle ? (
				<span className="tech-chip__subtitle">{technology.subtitle}</span>
			) : null}
		</li>
	);
}

function TechnologyDetailsModal({
	titleId,
	technologies,
	onClose,
}: {
	titleId: string;
	technologies: ResolvedTech[];
	onClose: () => void;
}) {
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', onKeyDown);
		document.body.classList.add('nav-lock');
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.body.classList.remove('nav-lock');
		};
	}, [onClose]);

	return createPortal(
		<div className="tech-modal" role="presentation" onClick={onClose}>
			<div
				className="tech-modal__dialog"
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				onClick={(event) => event.stopPropagation()}
			>
				<header className="tech-modal__header">
					<div>
						<p className="tech-modal__eyebrow">Stack details</p>
						<h2 id={titleId} className="tech-modal__title">
							Technologies Used
						</h2>
					</div>
					<button type="button" className="tech-modal__close" aria-label="Close" onClick={onClose}>
						<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
							<path
								d="M6.5 6.5l11 11M17.5 6.5l-11 11"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</header>

				<ul className="tech-modal__list">
					{technologies.map((technology) => (
						<li key={technology.id} className="tech-modal__item">
							<div className="tech-modal__item-main">
								<span className="tech-modal__icon" aria-hidden="true">
									<TechIcon iconSrc={technology.iconSrc} faIcon={technology.faIcon} size={22} />
								</span>
								<div className="tech-modal__copy">
									<div className="tech-modal__name-row">
										<strong>{technology.name}</strong>
										{technology.subtitle ? (
											<span className="tech-modal__subtitle">{technology.subtitle}</span>
										) : null}
									</div>
									{technology.description ? (
										<p className="tech-modal__description">{technology.description}</p>
									) : null}
								</div>
							</div>

							{technology.children.length ? (
								<ul className="tech-modal__children">
									{technology.children.map((child) => (
										<li key={child.id} className="tech-modal__child">
											<span className="tech-modal__child-icon" aria-hidden="true">
												<TechIcon iconSrc={child.iconSrc} faIcon={child.faIcon} size={16} />
											</span>
											<div className="tech-modal__child-copy">
												<strong>{child.name}</strong>
												{child.description ? <p>{child.description}</p> : null}
											</div>
										</li>
									))}
								</ul>
							) : null}
						</li>
					))}
				</ul>
			</div>
		</div>,
		document.body,
	);
}
