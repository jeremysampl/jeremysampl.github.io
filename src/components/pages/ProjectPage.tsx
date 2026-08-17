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
import StackMeta from '../containers/StackMeta';
import type { TechnologyItem } from '../containers/TechnologyChips';
import Icon from '../displays/Icon';
import InlineLink from '../displays/InlineLink';
import { ProjectId, getProject, projectThumbnailSrc, resolveProjectTechnologies } from '../../data/projects';
import { useGalleryLightbox } from '../views/GalleryLightbox';
import { galleryItemUrl, isGalleryVideo } from '../../types/gallery';

export type { GalleryItem };
export { ProjectFilmstrip, ProjectGalleryRef };
export type { TechnologyItem } from '../containers/TechnologyChips';

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 48;
const CHROME_AUTO_HIDE_MS = 3200;
const CHROME_ARM_MS = 350;

type ProjectDetails = {
	name: string;
	title: string;
	description?: ReactNode;
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
	technologies,
	gallery,
	github,
	website,
	siteIconSrc,
	siteIconAlt,
}: {
	projectId?: ProjectId;
	project: ProjectDetails;
	overview: ProjectOverview;
	technologies?: TechnologyItem[];
	gallery: GalleryItem[];
	github?: string;
	website?: string;
	siteIconSrc?: string;
	siteIconAlt?: string;
}) {
	const { openLightbox, isOpen, isVideoPlaying, takeVideoReturn, mediaAudio, setMediaAudio } =
		useGalleryLightbox();
	const listed = projectId ? getProject(projectId) : null;
	const displayTechnologies = useMemo<TechnologyItem[]>(() => {
		if (technologies?.length) return technologies;
		if (!listed) return [];
		return resolveProjectTechnologies(listed).map((technology) => ({
			id: technology.id,
			subtitle: technology.subtitle,
		}));
	}, [listed, technologies]);

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
	const [slideDurationMs, setSlideDurationMs] = useState<number | null>(AUTOPLAY_MS);
	const [videoProgress, setVideoProgress] = useState(0);
	const [chromeVisible, setChromeVisible] = useState(false);
	const [chromeInteractive, setChromeInteractive] = useState(false);
	const [resumeTime, setResumeTime] = useState<number | null>(null);
	const [volumeOpen, setVolumeOpen] = useState(false);
	const [touchChrome, setTouchChrome] = useState(() =>
		typeof window !== 'undefined'
			? !window.matchMedia('(hover: hover) and (pointer: fine)').matches
			: false,
	);
	const pointerStartRef = useRef<{ x: number; y: number; id: number } | null>(null);
	const didSwipeRef = useRef(false);
	const ignoreClickRef = useRef(false);
	const advancedForSlideRef = useRef(false);
	const heroVideoRef = useRef<HTMLVideoElement | null>(null);
	const chromeHideTimerRef = useRef<number | null>(null);
	const chromeArmTimerRef = useRef<number | null>(null);
	const volumeHideTimerRef = useRef<number | null>(null);
	const autoplayRef = useRef(autoplay);
	autoplayRef.current = autoplay;
	const chromeVisibleRef = useRef(chromeVisible);
	chromeVisibleRef.current = chromeVisible;

	const { volume, muted } = mediaAudio;
	const effectiveMuted = muted || isVideoPlaying;

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

	const advanceSlide = useCallback(() => {
		if (!autoplayRef.current || !canNavigate || advancedForSlideRef.current) return;
		advancedForSlideRef.current = true;
		setActiveIndex((current) => (current + 1) % lightboxItems.length);
	}, [canNavigate, lightboxItems.length]);

	useEffect(() => {
		advancedForSlideRef.current = false;
		setSlideDurationMs(heroIsVideo ? null : AUTOPLAY_MS);
		setVideoProgress(0);
	}, [safeIndex, heroIsVideo]);

	useEffect(() => {
		if (!autoplay || !canNavigate || heroIsVideo || isOpen) return;
		const timer = window.setTimeout(advanceSlide, AUTOPLAY_MS);
		return () => window.clearTimeout(timer);
	}, [advanceSlide, autoplay, canNavigate, heroIsVideo, isOpen, safeIndex]);

	const handleHeroVideoDuration = useCallback((durationMs: number) => {
		if (durationMs > 0 && Number.isFinite(durationMs)) {
			setSlideDurationMs(durationMs);
		}
	}, []);

	const handleHeroVideoEnded = useCallback(() => {
		advanceSlide();
	}, [advanceSlide]);

	const handleHeroVideoProgress = useCallback((progress: number) => {
		setVideoProgress(Math.min(1, Math.max(0, progress)));
	}, []);

	const handleMuteRequired = useCallback(() => {
		setMediaAudio({ muted: true });
	}, [setMediaAudio]);

	const wasLightboxOpenRef = useRef(false);
	useEffect(() => {
		if (isOpen) {
			wasLightboxOpenRef.current = true;
			return;
		}
		if (!wasLightboxOpenRef.current) return;
		wasLightboxOpenRef.current = false;

		const returned = takeVideoReturn();
		if (!returned) return;
		const matchIndex = lightboxItems.findIndex((item) => item.path === returned.path);
		if (matchIndex >= 0) {
			setActiveIndex(matchIndex);
		}
		setResumeTime(returned.currentTime);
		setMediaAudio({
			muted: returned.muted,
			...(typeof returned.volume === 'number' ? { volume: returned.volume } : {}),
		});
	}, [isOpen, lightboxItems, setMediaAudio, takeVideoReturn]);

	useEffect(() => {
		const media = window.matchMedia('(hover: hover) and (pointer: fine)');
		const sync = () => setTouchChrome(!media.matches);
		sync();
		media.addEventListener('change', sync);
		return () => media.removeEventListener('change', sync);
	}, []);

	const showPlaybackToggle = canNavigate || heroIsVideo;

	const clearChromeHideTimer = useCallback(() => {
		if (chromeHideTimerRef.current !== null) {
			window.clearTimeout(chromeHideTimerRef.current);
			chromeHideTimerRef.current = null;
		}
	}, []);

	const clearChromeArmTimer = useCallback(() => {
		if (chromeArmTimerRef.current !== null) {
			window.clearTimeout(chromeArmTimerRef.current);
			chromeArmTimerRef.current = null;
		}
	}, []);

	const clearVolumeHideTimer = useCallback(() => {
		if (volumeHideTimerRef.current !== null) {
			window.clearTimeout(volumeHideTimerRef.current);
			volumeHideTimerRef.current = null;
		}
	}, []);

	const scheduleChromeAutoHide = useCallback(() => {
		clearChromeHideTimer();
		chromeHideTimerRef.current = window.setTimeout(() => {
			setChromeVisible(false);
			chromeHideTimerRef.current = null;
		}, CHROME_AUTO_HIDE_MS);
	}, [clearChromeHideTimer]);

	const bumpChromeAutoHide = useCallback(() => {
		if (!touchChrome || !autoplayRef.current || !chromeVisibleRef.current) return;
		scheduleChromeAutoHide();
	}, [scheduleChromeAutoHide, touchChrome]);

	const scheduleVolumeAutoHide = useCallback(() => {
		clearVolumeHideTimer();
		volumeHideTimerRef.current = window.setTimeout(() => {
			setVolumeOpen(false);
			volumeHideTimerRef.current = null;
		}, 1200);
	}, [clearVolumeHideTimer]);

	const applyAudioToHero = useCallback((next: { volume?: number; muted?: boolean }) => {
		const video = heroVideoRef.current;
		if (!video) return;
		if (typeof next.volume === 'number') video.volume = next.volume;
		if (typeof next.muted === 'boolean') video.muted = next.muted || isVideoPlaying;
	}, [isVideoPlaying]);

	const handleVolumeChange = useCallback(
		(nextVolume: number) => {
			const clamped = Math.min(1, Math.max(0, nextVolume));
			if (clamped <= 0.001) {
				setMediaAudio({ muted: true });
				applyAudioToHero({ muted: true });
			} else {
				setMediaAudio({ volume: clamped, muted: false });
				applyAudioToHero({ volume: clamped, muted: isVideoPlaying });
			}
			bumpChromeAutoHide();
			if (touchChrome) scheduleVolumeAutoHide();
		},
		[
			applyAudioToHero,
			bumpChromeAutoHide,
			isVideoPlaying,
			scheduleVolumeAutoHide,
			setMediaAudio,
			touchChrome,
		],
	);

	const handleVolumeToggle = useCallback(() => {
		if (touchChrome && !volumeOpen) {
			setVolumeOpen(true);
			scheduleVolumeAutoHide();
			return;
		}
		const nextMuted = !muted;
		setMediaAudio({ muted: nextMuted });
		applyAudioToHero({ muted: nextMuted || isVideoPlaying });
		if (touchChrome) scheduleVolumeAutoHide();
	}, [
		applyAudioToHero,
		isVideoPlaying,
		muted,
		scheduleVolumeAutoHide,
		setMediaAudio,
		touchChrome,
		volumeOpen,
	]);

	const handleMediaTap = useCallback(() => {
		if (!touchChrome) return;
		setChromeVisible((visible) => {
			if (visible) {
				clearChromeHideTimer();
				return false;
			}
			if (autoplayRef.current) scheduleChromeAutoHide();
			return true;
		});
	}, [clearChromeHideTimer, scheduleChromeAutoHide, touchChrome]);

	const controlTouchedRef = useRef(false);
	const onControlPointerUp = useCallback(
		(event: React.PointerEvent, action: () => void) => {
			if (event.pointerType !== 'touch') return;
			event.stopPropagation();
			controlTouchedRef.current = true;
			if (!chromeInteractive) return;
			bumpChromeAutoHide();
			action();
		},
		[bumpChromeAutoHide, chromeInteractive],
	);
	const onControlClick = useCallback(
		(event: React.MouseEvent, action: () => void) => {
			event.stopPropagation();
			if (controlTouchedRef.current) {
				controlTouchedRef.current = false;
				return;
			}
			if (touchChrome && !chromeInteractive) return;
			bumpChromeAutoHide();
			action();
		},
		[bumpChromeAutoHide, chromeInteractive, touchChrome],
	);

	useEffect(() => () => {
		clearChromeHideTimer();
		clearChromeArmTimer();
		clearVolumeHideTimer();
	}, [clearChromeArmTimer, clearChromeHideTimer, clearVolumeHideTimer]);

	useEffect(() => {
		clearChromeArmTimer();
		if (!touchChrome || !chromeVisible) {
			setChromeInteractive(false);
			return;
		}
		chromeArmTimerRef.current = window.setTimeout(() => {
			setChromeInteractive(true);
			chromeArmTimerRef.current = null;
		}, CHROME_ARM_MS);
		return clearChromeArmTimer;
	}, [chromeVisible, clearChromeArmTimer, touchChrome]);

	useEffect(() => {
		if (!touchChrome || !autoplay || !chromeVisible) {
			if (!autoplay) clearChromeHideTimer();
			return;
		}
		scheduleChromeAutoHide();
	}, [autoplay, chromeVisible, clearChromeHideTimer, scheduleChromeAutoHide, touchChrome]);

	useEffect(() => {
		if (chromeVisible) return;
		setVolumeOpen(false);
		clearVolumeHideTimer();
	}, [chromeVisible, clearVolumeHideTimer]);

	useEffect(() => {
		const video = heroVideoRef.current;
		if (!video) return;
		video.volume = volume;
		video.muted = effectiveMuted;
	}, [effectiveMuted, volume, heroPath]);

	const openHeroLightbox = (origin: HTMLElement) => {
		if (!lightboxItems.length) return;
		const video = heroIsVideo ? heroVideoRef.current : null;
		openLightbox(
			lightboxItems,
			safeIndex,
			origin,
			video && heroPath
				? {
						video: {
							currentTime: video.currentTime,
							muted: muted,
							play: !video.paused,
						},
						galleryVideo: {
							path: heroPath,
							currentTime: video.currentTime,
							muted,
							volume,
						},
					}
				: undefined,
		);
	};

	const mediaStyle = {
		['--project-hero-aspect' as string]: frameAspect ? String(frameAspect) : '16 / 10',
	} as CSSProperties;

	const story =
		project.description ??
		(project.intro || project.points?.length ? (
			<>
				{project.intro ? <p>{project.intro}</p> : null}
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
									className={`project-card__media${touchChrome && chromeVisible ? ' is-chrome-visible' : ''}${touchChrome && chromeInteractive ? ' is-chrome-interactive' : ''}`}
									style={mediaStyle}
									onPointerDown={(event) => {
										if (event.pointerType !== 'touch' || event.button !== 0) return;
										const target = event.target as HTMLElement;
										if (
											target.closest(
												'.project-card__volume, .project-card__nav, .project-card__open-gallery, .project-card__autoplay',
											)
										) {
											pointerStartRef.current = null;
											return;
										}
										pointerStartRef.current = {
											x: event.clientX,
											y: event.clientY,
											id: event.pointerId,
										};
										didSwipeRef.current = false;
									}}
									onPointerUp={(event) => {
										if (event.pointerType !== 'touch') return;

										const start = pointerStartRef.current;
										pointerStartRef.current = null;
										if (!start || start.id !== event.pointerId) return;

										const dx = event.clientX - start.x;
										const dy = event.clientY - start.y;
										const isSwipe =
											canNavigate &&
											Math.abs(dx) >= SWIPE_THRESHOLD &&
											Math.abs(dx) >= Math.abs(dy) * 1.2;

										ignoreClickRef.current = true;

										if (isSwipe) {
											didSwipeRef.current = true;
											bumpChromeAutoHide();
											if (dx < 0) goNext();
											else goPrev();
											return;
										}

										const target = event.target as HTMLElement;
										if (
											target.closest(
												'.project-card__volume, .project-card__nav, .project-card__open-gallery, .project-card__autoplay',
											)
										) {
											return;
										}
										handleMediaTap();
									}}
									onPointerCancel={() => {
										pointerStartRef.current = null;
									}}
									onClick={(event) => {
										if (ignoreClickRef.current) {
											ignoreClickRef.current = false;
											return;
										}
										if (didSwipeRef.current) {
											didSwipeRef.current = false;
											return;
										}
										if (touchChrome) return;
										const target = event.target as HTMLElement;
										if (
											target.closest(
												'.project-card__volume, .project-card__nav, .project-card__open-gallery, .project-card__autoplay',
											)
										) {
											return;
										}
										handleMediaTap();
									}}
									onKeyDown={(event) => {
										if (event.key === 'ArrowLeft' && canNavigate) {
											event.preventDefault();
											bumpChromeAutoHide();
											goPrev();
										}
										if (event.key === 'ArrowRight' && canNavigate) {
											event.preventDefault();
											bumpChromeAutoHide();
											goNext();
										}
									}}
								>
									<HeroMedia
										key={heroPath}
										src={heroSrc}
										path={heroPath}
										title={heroItem.title}
										isVideo={heroIsVideo}
										muted={effectiveMuted}
										volume={volume}
										shouldPlay={autoplay && !isOpen}
										resumeTime={resumeTime}
										videoRef={heroVideoRef}
										onVideoDuration={handleHeroVideoDuration}
										onVideoEnded={handleHeroVideoEnded}
										onVideoProgress={handleHeroVideoProgress}
										onMuteRequired={handleMuteRequired}
										onResumeApplied={() => setResumeTime(null)}
									/>

									<div className="project-card__chrome">
										{heroIsVideo ? (
											<div
												className={`project-card__volume${muted ? ' is-muted' : ''}${volumeOpen ? ' is-open' : ''}`}
												onPointerDown={(event) => event.stopPropagation()}
												onTouchStart={(event) => event.stopPropagation()}
												onTouchEnd={(event) => event.stopPropagation()}
												onClick={(event) => event.stopPropagation()}
											>
												<label className="project-card__volume-slider">
													<input
														className="project-card__volume-range"
														type="range"
														min={0}
														max={1}
														step={0.01}
														value={muted ? 0 : volume}
														aria-label="Volume"
														onChange={(event) => {
															handleVolumeChange(Number(event.target.value));
														}}
														onPointerDown={(event) => event.stopPropagation()}
														onTouchStart={(event) => event.stopPropagation()}
													/>
												</label>
												<button
													type="button"
													className="project-card__volume-toggle"
													aria-pressed={muted}
													aria-label={muted ? 'Unmute videos' : 'Mute videos'}
													title={muted ? 'Unmute' : 'Mute'}
													onPointerUp={(event) => onControlPointerUp(event, handleVolumeToggle)}
													onClick={(event) => onControlClick(event, handleVolumeToggle)}
												>
													<Icon
														name={muted || volume < 0.01 ? 'volume-off' : volume < 0.5 ? 'volume-down' : 'volume-up'}
														size={13}
														color="#fff"
													/>
												</button>
											</div>
										) : null}

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
													onPointerUp={(event) => onControlPointerUp(event, goPrev)}
													onClick={(event) => onControlClick(event, goPrev)}
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
													onPointerUp={(event) => onControlPointerUp(event, goNext)}
													onClick={(event) => onControlClick(event, goNext)}
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
											<button
												type="button"
												className="project-card__open-gallery"
												aria-label={`Open gallery${lightboxItems.length > 1 ? ` · ${safeIndex + 1} of ${lightboxItems.length}` : ''}`}
												onPointerUp={(event) =>
													onControlPointerUp(event, () => {
														const origin =
															event.currentTarget
																.closest('.project-card__media')
																?.querySelector<HTMLElement>('.project-card__image') ??
															event.currentTarget;
														openHeroLightbox(origin);
													})
												}
												onClick={(event) =>
													onControlClick(event, () => {
														const origin =
															event.currentTarget
																.closest('.project-card__media')
																?.querySelector<HTMLElement>('.project-card__image') ??
															event.currentTarget;
														openHeroLightbox(origin);
													})
												}
											>
												<Icon name="expand" size={14} color="#fff" />
												<span className="project-card__open-gallery-label">Open gallery</span>
												{lightboxItems.length > 1 ? (
													<span className="project-card__open-gallery-count">
														{safeIndex + 1}/{lightboxItems.length}
													</span>
												) : null}
											</button>
											{showPlaybackToggle ? (
												<button
													type="button"
													className={`project-card__autoplay${autoplay ? ' is-on' : ''}`}
													aria-pressed={autoplay}
													aria-label={
														autoplay
															? heroIsVideo
																? 'Pause video and slideshow'
																: 'Pause automatic slideshow'
															: heroIsVideo
																? 'Play video and slideshow'
																: 'Play automatic slideshow'
													}
													title={autoplay ? 'Pause' : 'Play'}
													onPointerUp={(event) =>
														onControlPointerUp(event, () => {
															setAutoplay((value) => {
																const next = !value;
																const video = heroVideoRef.current;
																if (video) {
																	if (next) {
																		void video.play().catch(() => setMediaAudio({ muted: true }));
																	} else {
																		video.pause();
																	}
																}
																return next;
															});
															if (touchChrome) {
																(event.currentTarget as HTMLButtonElement).blur();
															}
														})
													}
													onClick={(event) =>
														onControlClick(event, () => {
															setAutoplay((value) => {
																const next = !value;
																const video = heroVideoRef.current;
																if (video) {
																	if (next) {
																		void video.play().catch(() => setMediaAudio({ muted: true }));
																	} else {
																		video.pause();
																	}
																}
																return next;
															});
															if (touchChrome) {
																(event.currentTarget as HTMLButtonElement).blur();
															}
														})
													}
												>
													<Icon name={autoplay ? 'pause' : 'play'} size={12} color="#fff" />
												</button>
											) : null}
										</div>
									</div>

									{heroIsVideo ? (
										<div className="project-card__progress" aria-hidden="true">
											<span
												className="project-card__progress-bar project-card__progress-bar--video"
												style={{ transform: `scaleX(${videoProgress})` }}
											/>
										</div>
									) : autoplay && canNavigate && !isOpen && slideDurationMs != null ? (
										<div
											key={`progress-${safeIndex}-${slideDurationMs}`}
											className="project-card__progress"
											aria-hidden="true"
										>
											<span
												className="project-card__progress-bar"
												style={{ animationDuration: `${slideDurationMs}ms` }}
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
								<StackMeta
									links={{
										github: github ?? listed?.github,
										website: website ?? listed?.website,
										siteIconSrc,
										siteIconAlt,
									}}
									technologies={displayTechnologies}
								/>
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

			<aside className="project-more" aria-label="More projects">
				<p className="project-more__text">
					Want to see more?{' '}
					<InlineLink to="/projects">View all projects</InlineLink>
				</p>
			</aside>
		</section>
	);
}

function HeroMedia({
	src,
	path,
	title,
	isVideo,
	muted,
	volume = 1,
	shouldPlay,
	resumeTime,
	videoRef: videoRefProp,
	onVideoDuration,
	onVideoEnded,
	onVideoProgress,
	onMuteRequired,
	onResumeApplied,
}: {
	src: string;
	path?: string;
	title: string;
	isVideo: boolean;
	muted: boolean;
	volume?: number;
	shouldPlay: boolean;
	resumeTime?: number | null;
	videoRef?: React.RefObject<HTMLVideoElement | null>;
	onVideoDuration?: (durationMs: number) => void;
	onVideoEnded?: () => void;
	onVideoProgress?: (progress: number) => void;
	onMuteRequired?: () => void;
	onResumeApplied?: () => void;
}) {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const shouldPlayRef = useRef(shouldPlay);
	const mutedRef = useRef(muted);
	const onMuteRequiredRef = useRef(onMuteRequired);
	shouldPlayRef.current = shouldPlay;
	mutedRef.current = muted;
	onMuteRequiredRef.current = onMuteRequired;

	const setVideoNode = useCallback(
		(node: HTMLVideoElement | null) => {
			localVideoRef.current = node;
			if (videoRefProp) videoRefProp.current = node;
			if (node) {
				node.volume = volume;
				node.muted = muted;
			}
		},
		[muted, videoRefProp, volume],
	);

	useEffect(() => {
		if (!isVideo) return;
		const video = localVideoRef.current;
		if (!video) return;

		const reportDuration = () => {
			if (video.duration > 0 && Number.isFinite(video.duration)) {
				onVideoDuration?.(video.duration * 1000);
			}
		};

		const reportProgress = () => {
			if (video.duration > 0 && Number.isFinite(video.duration)) {
				onVideoProgress?.(video.currentTime / video.duration);
			}
		};

		const handleEnded = () => {
			onVideoProgress?.(1);
			onVideoEnded?.();
		};

		video.addEventListener('loadedmetadata', reportDuration);
		video.addEventListener('durationchange', reportDuration);
		video.addEventListener('timeupdate', reportProgress);
		video.addEventListener('ended', handleEnded);
		if (video.readyState >= 1) reportDuration();

		return () => {
			video.removeEventListener('loadedmetadata', reportDuration);
			video.removeEventListener('durationchange', reportDuration);
			video.removeEventListener('timeupdate', reportProgress);
			video.removeEventListener('ended', handleEnded);
			video.pause();
			if (videoRefProp) videoRefProp.current = null;
		};
	}, [isVideo, src, videoRefProp, onVideoDuration, onVideoEnded, onVideoProgress]);

	useEffect(() => {
		if (!isVideo || resumeTime == null) return;
		const video = localVideoRef.current;
		if (!video) return;

		let cancelled = false;
		const apply = () => {
			if (cancelled) return;
			try {
				video.currentTime = resumeTime;
			} catch {
				/* ignore seek errors */
			}
			onResumeApplied?.();
		};

		if (video.readyState >= 1) apply();
		else video.addEventListener('loadedmetadata', apply, { once: true });

		return () => {
			cancelled = true;
			video.removeEventListener('loadedmetadata', apply);
		};
	}, [isVideo, src, resumeTime, onResumeApplied]);

	useEffect(() => {
		if (!isVideo) return;
		const video = localVideoRef.current;
		if (!video) return;
		video.muted = muted;
		video.volume = volume;
	}, [isVideo, muted, src, volume]);

	useEffect(() => {
		if (!isVideo) return;
		const video = localVideoRef.current;
		if (!video) return;

		let fallbackTimer: number | null = null;

		if (!shouldPlay) {
			video.pause();
			return () => {
				if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
			};
		}

		const playPromise = video.play();
		if (playPromise !== undefined) {
			playPromise.catch(() => {
				if (!mutedRef.current) {
					onMuteRequiredRef.current?.();
					return;
				}
				onVideoDuration?.(AUTOPLAY_MS);
				fallbackTimer = window.setTimeout(() => {
					if (shouldPlayRef.current) onVideoEnded?.();
				}, AUTOPLAY_MS);
			});
		}

		return () => {
			if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
		};
	}, [isVideo, src, shouldPlay, muted, onVideoDuration, onVideoEnded]);

	if (isVideo) {
		return (
			<video
				ref={setVideoNode}
				className="project-card__image media-card__thumb"
				src={src}
				data-gallery-path={path}
				muted={muted}
				playsInline
				preload="auto"
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
