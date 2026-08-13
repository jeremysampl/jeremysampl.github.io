import React, {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import '../../styles/project.css';
import ProjectMediaGrid, {
	ProjectFilmstrip,
	ProjectGalleryRef,
	type GalleryItem,
} from '../containers/ProjectMediaGrid';
import type { InfoCardItem } from '../containers/InfoCardGrid';
import TechnologyChips from '../containers/TechnologyChips';
import ProjectLinks from '../containers/ProjectLinks';
import Icon from '../displays/Icon';
import type { LanguageDisplayItem } from '../containers/LanguageDisplay';
import { ProjectId, getProject, projectThumbnailSrc, resolveProjectTechnologies } from '../../data/projects';
import { useGalleryLightbox } from '../views/GalleryLightbox';
import { galleryItemUrl, isGalleryVideo } from '../../types/gallery';

export type { GalleryItem };
export { ProjectFilmstrip, ProjectGalleryRef };

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 48;

type ProjectDetails = {
	name: string;
	title: string;
	/** Rich description shown under the whole card (text, bullets, filmstrips, image refs). */
	description?: ReactNode;
	/** Optional short lead-in when using `points` instead of a full `description`. */
	intro?: string;
	points?: ReactNode[];
};

type ProjectOverview = {
	boxes: InfoCardItem[];
};

function galleryItemsForPage(thumbnail: string | undefined, name: string, title: string, gallery: GalleryItem[]) {
	if (!thumbnail || gallery.some((item) => item.path === thumbnail)) {
		return gallery;
	}

	return [
		{
			title: name,
			path: thumbnail,
			description: title,
		},
		...gallery,
	];
}

export default function ProjectPage({
	projectId,
	project,
	overview,
	languages,
	gallery,
	github,
	website,
}: {
	projectId?: ProjectId;
	project: ProjectDetails;
	overview: ProjectOverview;
	languages?: LanguageDisplayItem[];
	gallery: GalleryItem[];
	github?: string;
	website?: string;
}) {
	const { openLightbox } = useGalleryLightbox();
	const listed = projectId ? getProject(projectId) : null;
	const resolvedLanguages =
		languages ??
		(listed
			? resolveProjectTechnologies(listed).map((technology) => ({
					name: technology.name,
					iconSrc: technology.iconSrc,
					faIcon: technology.faIcon,
					iconPadding: technology.iconPadding,
					subtitle: technology.subtitle,
				}))
			: []);

	const thumbnailPath = listed?.thumbnail;
	const lightboxItems = useMemo(
		() => galleryItemsForPage(thumbnailPath, project.name, project.title, gallery),
		[gallery, project.name, project.title, thumbnailPath],
	);

	const initialIndex = useMemo(() => {
		if (!lightboxItems.length) return 0;
		if (!thumbnailPath) return 0;
		const match = lightboxItems.findIndex((item) => item.path === thumbnailPath);
		return match >= 0 ? match : 0;
	}, [lightboxItems, thumbnailPath]);

	const [activeIndex, setActiveIndex] = useState(initialIndex);
	const [autoplay, setAutoplay] = useState(true);
	const [frameAspect, setFrameAspect] = useState<number | null>(null);
	const touchStartRef = useRef<{ x: number; y: number } | null>(null);
	const didSwipeRef = useRef(false);

	useEffect(() => {
		setActiveIndex(initialIndex);
	}, [initialIndex]);

	useEffect(() => {
		const probeSrc = listed
			? projectThumbnailSrc(listed.id)
			: lightboxItems[0]
				? galleryItemUrl(lightboxItems[0])
				: null;
		if (!probeSrc) {
			setFrameAspect(null);
			return;
		}

		let cancelled = false;
		const image = new Image();
		image.onload = () => {
			if (cancelled || !image.naturalWidth || !image.naturalHeight) return;
			setFrameAspect(image.naturalWidth / image.naturalHeight);
		};
		image.onerror = () => {
			if (!cancelled) setFrameAspect(null);
		};
		image.src = probeSrc;

		return () => {
			cancelled = true;
		};
	}, [listed, lightboxItems]);

	const canNavigate = lightboxItems.length > 1;
	const safeIndex = lightboxItems.length
		? ((activeIndex % lightboxItems.length) + lightboxItems.length) % lightboxItems.length
		: 0;
	const heroItem = lightboxItems[safeIndex];
	const heroPath = heroItem?.path;
	const heroSrc = heroItem ? galleryItemUrl(heroItem) : null;
	const heroIsVideo = heroItem ? isGalleryVideo(heroItem) : false;

	const goTo = useCallback(
		(index: number) => {
			if (!lightboxItems.length) return;
			const next = ((index % lightboxItems.length) + lightboxItems.length) % lightboxItems.length;
			setActiveIndex(next);
		},
		[lightboxItems.length],
	);

	const goPrev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);
	const goNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);

	useEffect(() => {
		if (!autoplay || !canNavigate) return;
		const timer = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % lightboxItems.length);
		}, AUTOPLAY_MS);
		return () => window.clearInterval(timer);
	}, [autoplay, canNavigate, lightboxItems.length, safeIndex]);

	const openHeroLightbox = (origin: HTMLElement) => {
		if (!lightboxItems.length) return;
		openLightbox(lightboxItems, safeIndex, origin);
	};

	const mediaStyle = {
		['--project-hero-aspect' as string]: frameAspect ? String(frameAspect) : '16 / 10',
	} as CSSProperties;

	const story =
		project.description ??
		(project.intro || project.points?.length ? (
			<>
				{project.intro ? <p className="project-card__intro">{project.intro}</p> : null}
				{project.points?.length ? (
					<ul className="project-card__points">
						{project.points.map((point, index) => (
							<li key={index}>{point}</li>
						))}
					</ul>
				) : null}
			</>
		) : null);

	return (
		<section className="section project-page">
			<article className="project-card">
				<div className="project-card__panel">
					<div className="project-card__hero">
						<div className="project-card__visual">
							{heroSrc && heroItem ? (
								<div
									className="project-card__media"
									style={mediaStyle}
									role="button"
									tabIndex={0}
									aria-label={`Open ${heroItem.title} in gallery`}
									onClick={(event) => {
										if (didSwipeRef.current) {
											didSwipeRef.current = false;
											return;
										}
										const target = event.target as HTMLElement;
										if (target.closest('.project-card__nav, .project-card__autoplay')) return;
										const origin =
											event.currentTarget.querySelector<HTMLElement>('.project-card__image') ??
											event.currentTarget;
										openHeroLightbox(origin);
									}}
									onKeyDown={(event) => {
										if (event.key === 'Enter' || event.key === ' ') {
											event.preventDefault();
											const origin =
												event.currentTarget.querySelector<HTMLElement>('.project-card__image') ??
												event.currentTarget;
											openHeroLightbox(origin);
										}
										if (event.key === 'ArrowLeft' && canNavigate) {
											event.preventDefault();
											goPrev();
										}
										if (event.key === 'ArrowRight' && canNavigate) {
											event.preventDefault();
											goNext();
										}
									}}
									onTouchStart={(event) => {
										if (!canNavigate || event.touches.length !== 1) return;
										const touch = event.touches[0];
										touchStartRef.current = { x: touch.clientX, y: touch.clientY };
										didSwipeRef.current = false;
									}}
									onTouchEnd={(event) => {
										const start = touchStartRef.current;
										touchStartRef.current = null;
										if (!canNavigate || !start || event.changedTouches.length !== 1) return;
										const touch = event.changedTouches[0];
										const dx = touch.clientX - start.x;
										const dy = touch.clientY - start.y;
										if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.2) return;
										didSwipeRef.current = true;
										if (dx < 0) goNext();
										else goPrev();
									}}
								>
									<HeroMedia
										key={heroPath}
										src={heroSrc}
										path={heroPath}
										title={heroItem.title}
										isVideo={heroIsVideo}
									/>

									{heroIsVideo ? (
										<span className="project-card__video-badge" aria-hidden="true">
											<svg
												className="project-card__video-badge-icon"
												viewBox="0 0 24 24"
												focusable="false"
											>
												<path d="M9 7.2v9.6l8.4-4.8L9 7.2z" fill="currentColor" />
											</svg>
											Video
										</span>
									) : null}

									{canNavigate ? (
										<>
											<button
												type="button"
												className="project-card__nav project-card__nav--prev"
												aria-label="Previous gallery image"
												onClick={(event) => {
													event.stopPropagation();
													goPrev();
												}}
											>
												<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
													<path
														d="M14.5 5.5L8 12l6.5 6.5"
														fill="none"
														stroke="currentColor"
														strokeWidth="2.2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</button>
											<button
												type="button"
												className="project-card__nav project-card__nav--next"
												aria-label="Next gallery image"
												onClick={(event) => {
													event.stopPropagation();
													goNext();
												}}
											>
												<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
													<path
														d="M9.5 5.5L16 12l-6.5 6.5"
														fill="none"
														stroke="currentColor"
														strokeWidth="2.2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</button>
										</>
									) : null}

									<div className="project-card__media-controls">
										<span className="project-card__media-cue">
											<Icon name={heroIsVideo ? 'play' : 'clone'} size={13} color="#fff" />
											View gallery
											{lightboxItems.length > 1 ? ` · ${safeIndex + 1}/${lightboxItems.length}` : ''}
										</span>
										{canNavigate ? (
											<button
												type="button"
												className={`project-card__autoplay${autoplay ? ' is-on' : ''}`}
												aria-pressed={autoplay}
												aria-label={autoplay ? 'Pause automatic slideshow' : 'Play automatic slideshow'}
												title={autoplay ? 'Pause slideshow' : 'Play slideshow'}
												onClick={(event) => {
													event.stopPropagation();
													setAutoplay((value) => !value);
												}}
											>
												<Icon name={autoplay ? 'pause' : 'play'} size={12} color="#fff" />
											</button>
										) : null}
									</div>

									{autoplay && canNavigate ? (
										<div
											key={`progress-${safeIndex}`}
											className="project-card__progress"
											aria-hidden="true"
										>
											<span
												className="project-card__progress-bar"
												style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
											/>
										</div>
									) : null}
								</div>
							) : null}

							{lightboxItems.length ? (
								<ProjectMediaGrid
									media={lightboxItems}
									variant="filmstrip"
									activePath={heroPath}
									onSelect={(index) => goTo(index)}
								/>
							) : null}
						</div>

						<div className="project-card__body">
							<header className="project-card__header">
								<h1 className="project-card__name">{project.name}</h1>
								<p className="project-card__tagline">{project.title}</p>
								<div className="project-card__meta">
									{resolvedLanguages.length ? (
										<TechnologyChips technologies={resolvedLanguages} />
									) : null}
									<ProjectLinks github={github ?? listed?.github} website={website ?? listed?.website} />
								</div>
							</header>

							{overview.boxes.length ? (
								<ul className="project-card__highlights">
									{overview.boxes.map((item) => (
										<li key={item.title} className="project-card__highlight">
											{item.icon ? (
												<span className="project-card__highlight-icon" aria-hidden="true">
													<Icon name={item.icon} size={16} color="var(--secondary-color)" />
												</span>
											) : null}
											<div className="project-card__highlight-copy">
												<strong>{item.title}</strong>
												<span>{item.description}</span>
											</div>
										</li>
									))}
								</ul>
							) : null}
						</div>
					</div>

					{story ? <div className="project-card__story">{story}</div> : null}
				</div>
			</article>
		</section>
	);
}

function HeroMedia({
	src,
	path,
	title,
	isVideo,
}: {
	src: string;
	path?: string;
	title: string;
	isVideo: boolean;
}) {
	if (isVideo) {
		return (
			<video
				className="project-card__image media-card__thumb"
				src={src}
				data-gallery-path={path}
				muted
				playsInline
				preload="metadata"
				aria-hidden="true"
			/>
		);
	}

	return (
		<img
			className="project-card__image media-card__thumb"
			src={src}
			data-gallery-path={path}
			alt={title}
		/>
	);
}
