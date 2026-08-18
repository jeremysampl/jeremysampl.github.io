import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import type { GalleryItem } from '../../types/gallery';
import { galleryItemUrl, isGalleryVideo } from '../../types/gallery';
import '../../styles/modal.css';

export type { GalleryItem };

type OriginRect = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>;

export type LightboxVideoHandoff = {
	currentTime?: number;
	muted?: boolean;
	play?: boolean;
};

export type LightboxVideoReturn = {
	path: string;
	currentTime: number;
	muted: boolean;
	volume?: number;
	play: boolean;
};

export type MediaAudioState = {
	volume: number;
	muted: boolean;
};

export type OpenLightboxOptions = {
	video?: LightboxVideoHandoff;
	galleryVideo?: LightboxVideoReturn;
};

type LightboxSession = {
	items: GalleryItem[];
	index: number;
	origin: OriginRect | null;
	originEl: Element | null;
	videoHandoff?: LightboxVideoHandoff | null;
	galleryVideo?: LightboxVideoReturn | null;
};

type GalleryLightboxContextValue = {
	openLightbox: (
		items: GalleryItem[],
		index: number,
		originEl?: Element | null,
		options?: OpenLightboxOptions,
	) => void;
	closeLightbox: () => void;
	isOpen: boolean;
	isVideoPlaying: boolean;
	takeVideoReturn: () => LightboxVideoReturn | null;
	mediaAudio: MediaAudioState;
	setMediaAudio: (update: Partial<MediaAudioState> | ((prev: MediaAudioState) => MediaAudioState)) => void;
};

const GalleryLightboxContext = createContext<GalleryLightboxContextValue | null>(null);

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const CLICK_ZOOM = 2.5;
const TAP_MOVE_THRESHOLD = 10;
const CHROME_IDLE_MS = 2600;
const THUMB_SCOPE_SELECTOR =
	'.media-card-grid, .project-gallery-ref, .project-card__visual, .project-card__story, .project-card__panel';

export function useGalleryLightbox() {
	const value = useContext(GalleryLightboxContext);
	if (!value) {
		throw new Error('useGalleryLightbox must be used within GalleryLightboxProvider');
	}
	return value;
}

function rectFromElement(el: Element): OriginRect {
	const rect = el.getBoundingClientRect();
	return {
		top: rect.top,
		left: rect.left,
		width: rect.width,
		height: rect.height,
	};
}

/** Visible painted area for object-fit: contain media. */
function renderedMediaRect(element: HTMLImageElement | HTMLVideoElement): OriginRect {
	const box = element.getBoundingClientRect();
	const naturalWidth =
		element instanceof HTMLVideoElement ? element.videoWidth : element.naturalWidth;
	const naturalHeight =
		element instanceof HTMLVideoElement ? element.videoHeight : element.naturalHeight;

	if (!naturalWidth || !naturalHeight) {
		return rectFromElement(element);
	}

	const boxAspect = box.width / box.height;
	const mediaAspect = naturalWidth / naturalHeight;
	let width: number;
	let height: number;

	if (mediaAspect > boxAspect) {
		width = box.width;
		height = box.width / mediaAspect;
	} else {
		height = box.height;
		width = box.height * mediaAspect;
	}

	return {
		top: box.top + (box.height - height) / 2,
		left: box.left + (box.width - width) / 2,
		width,
		height,
	};
}

function containMediaSize(
	containerWidth: number,
	containerHeight: number,
	mediaWidth: number,
	mediaHeight: number,
): { width: number; height: number } {
	if (!mediaWidth || !mediaHeight) {
		return { width: containerWidth, height: containerHeight };
	}

	const containerAspect = containerWidth / containerHeight;
	const mediaAspect = mediaWidth / mediaHeight;

	if (mediaAspect > containerAspect) {
		return { width: containerWidth, height: containerWidth / mediaAspect };
	}

	return { width: containerHeight * mediaAspect, height: containerHeight };
}

function galleryPathMatches(element: HTMLElement, path: string): boolean {
	const galleryPath = element.getAttribute('data-gallery-path');
	if (
		galleryPath &&
		(galleryPath === path || path.endsWith(galleryPath) || galleryPath.endsWith(path))
	) {
		return true;
	}

	const src =
		element.getAttribute('src') ||
		(element as HTMLImageElement).currentSrc ||
		'';
	if (!src) return false;
	return src.includes(`/images/projects/${path}`) || src.endsWith(path);
}

function isElementOnScreen(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();
	return (
		rect.width > 1 &&
		rect.height > 1 &&
		rect.bottom > 0 &&
		rect.right > 0 &&
		rect.top < window.innerHeight &&
		rect.left < window.innerWidth
	);
}

function findThumbnailElements(path: string, root: ParentNode = document): HTMLElement[] {
	const media = root.querySelectorAll<HTMLElement>(
		'[data-gallery-path], .media-card__thumb, .project-card__image, .project-gallery-ref__thumb',
	);
	return Array.from(media).filter((element) => galleryPathMatches(element, path));
}

function pickPreferredThumbnail(candidates: HTMLElement[]): HTMLElement | null {
	if (!candidates.length) return null;
	return candidates.find(isElementOnScreen) ?? candidates[0];
}

/**
 * Resolve the thumbnail to animate back to.
 * Prefers the opener element / its filmstrip or section so inline strips
 * do not snap to a duplicate thumb in the hero gallery.
 */
function findThumbnailElement(path: string, preferred?: Element | null): HTMLElement | null {
	if (preferred && preferred.isConnected) {
		const preferredEl = preferred as HTMLElement;
		if (galleryPathMatches(preferredEl, path)) {
			return preferredEl;
		}

		const scope = preferredEl.closest(THUMB_SCOPE_SELECTOR);
		if (scope) {
			const scoped = pickPreferredThumbnail(findThumbnailElements(path, scope));
			if (scoped) return scoped;
		}
	}

	return pickPreferredThumbnail(findThumbnailElements(path));
}

function findThumbnailOrigin(path: string, preferred?: Element | null): OriginRect | null {
	const element = findThumbnailElement(path, preferred);
	return element ? rectFromElement(element) : null;
}

function closeStartRectForVideo(video: HTMLVideoElement): OriginRect {
	const frame = video.closest('.gallery-lightbox__video-frame');
	if (frame instanceof HTMLElement) {
		return rectFromElement(frame);
	}
	return renderedMediaRect(video);
}

function objectFitForElement(element: Element | null): React.CSSProperties['objectFit'] {
	if (!element) return 'cover';
	const fit = getComputedStyle(element).objectFit;
	return fit === 'contain' || fit === 'cover' || fit === 'fill' || fit === 'none' || fit === 'scale-down'
		? fit
		: 'cover';
}

function ensureFilmstripThumbVisible(thumbEl: HTMLElement) {
	const strip = thumbEl.closest('.media-card-grid--filmstrip');
	if (!(strip instanceof HTMLElement)) return;
	const card = thumbEl.closest('.media-card');
	if (!(card instanceof HTMLElement)) return;

	const stripRect = strip.getBoundingClientRect();
	const cardRect = card.getBoundingClientRect();
	const paddingLeft = parseFloat(getComputedStyle(strip).paddingLeft) || 0;
	if (cardRect.left >= stripRect.left - 2 && cardRect.right <= stripRect.right + 2) return;

	const delta = cardRect.left - (stripRect.left + paddingLeft);
	strip.scrollBy({ left: delta, behavior: 'auto' });
}

function pauseVideosIn(root: ParentNode | null) {
	if (!root) return;
	root.querySelectorAll('video').forEach((video) => {
		video.pause();
	});
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

export function GalleryLightboxProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<LightboxSession | null>(null);
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const [mediaAudio, setMediaAudioState] = useState<MediaAudioState>({ volume: 1, muted: true });
	const videoReturnRef = useRef<LightboxVideoReturn | null>(null);
	const { pathname } = useLocation();

	const setMediaAudio = useCallback(
		(update: Partial<MediaAudioState> | ((prev: MediaAudioState) => MediaAudioState)) => {
			setMediaAudioState((prev) => {
				const next = typeof update === 'function' ? update(prev) : { ...prev, ...update };
				if (next.volume === prev.volume && next.muted === prev.muted) return prev;
				return next;
			});
		},
		[],
	);

	const openLightbox = useCallback(
		(items: GalleryItem[], index: number, originEl?: Element | null, options?: OpenLightboxOptions) => {
			if (!items.length) return;
			const safeIndex = Math.max(0, Math.min(index, items.length - 1));
			const matched = originEl ?? findThumbnailElement(items[safeIndex].path);
			setIsVideoPlaying(false);
			videoReturnRef.current = null;
			setSession({
				items,
				index: safeIndex,
				originEl: matched,
				origin: matched ? rectFromElement(matched) : null,
				videoHandoff: options?.video ?? null,
				galleryVideo: options?.galleryVideo ?? null,
			});
		},
		[],
	);

	const closeLightbox = useCallback(() => {
		setIsVideoPlaying(false);
		setSession(null);
	}, []);

	const takeVideoReturn = useCallback(() => {
		const value = videoReturnRef.current;
		videoReturnRef.current = null;
		return value;
	}, []);

	const stashVideoReturn = useCallback((value: LightboxVideoReturn | null) => {
		videoReturnRef.current = value;
	}, []);

	useEffect(() => {
		setSession(null);
		setIsVideoPlaying(false);
		videoReturnRef.current = null;
		document.body.classList.remove('nav-lock');
	}, [pathname]);

	const setIndex = useCallback((index: number) => {
		setSession((current) => {
			if (!current) return null;
			const nextIndex = ((index % current.items.length) + current.items.length) % current.items.length;
			const matched = findThumbnailElement(current.items[nextIndex].path, current.originEl);
			return {
				...current,
				index: nextIndex,
				originEl: matched ?? current.originEl,
				origin: matched ? rectFromElement(matched) : current.origin,
				videoHandoff: null,
			};
		});
	}, []);

	return (
		<GalleryLightboxContext.Provider
			value={{
				openLightbox,
				closeLightbox,
				isOpen: session !== null,
				isVideoPlaying,
				takeVideoReturn,
				mediaAudio,
				setMediaAudio,
			}}
		>
			{children}
			{session ? (
				<LightboxOverlay
					session={session}
					mediaAudio={mediaAudio}
					onIndexChange={setIndex}
					onClosed={closeLightbox}
					onVideoPlayingChange={setIsVideoPlaying}
					onStashVideoReturn={stashVideoReturn}
					onMediaAudioChange={setMediaAudio}
				/>
			) : null}
		</GalleryLightboxContext.Provider>
	);
}

type PointerMode = 'undecided' | 'vertical' | 'horizontal' | 'pan' | 'pinch';

type DragState = {
	pointerId: number;
	startX: number;
	startY: number;
	x: number;
	y: number;
	mode: PointerMode;
	moved: boolean;
	isTouch: boolean;
};

type PinchState = {
	startDistance: number;
	startZoom: number;
	startPanX: number;
	startPanY: number;
	startMidX: number;
	startMidY: number;
};

function LightboxVideoSlide({
	src,
	active,
	slideWidth,
	onVideoRef,
}: {
	src: string;
	active: boolean;
	slideWidth: number;
	onVideoRef?: (node: HTMLVideoElement | null) => void;
}) {
	const localRef = useRef<HTMLVideoElement>(null);
	const [frameSize, setFrameSize] = useState<{ width: number; height: number } | null>(null);

	const measure = useCallback(() => {
		const video = localRef.current;
		if (!video?.videoWidth || !video.videoHeight) return;
		const containerHeight = window.innerHeight;
		setFrameSize(
			containMediaSize(slideWidth, containerHeight, video.videoWidth, video.videoHeight),
		);
	}, [slideWidth]);

	useLayoutEffect(() => {
		measure();
		const video = localRef.current;
		if (!video) return;

		video.addEventListener('loadedmetadata', measure);
		window.addEventListener('resize', measure);
		return () => {
			video.removeEventListener('loadedmetadata', measure);
			window.removeEventListener('resize', measure);
		};
	}, [measure, src]);

	const setRef = useCallback(
		(node: HTMLVideoElement | null) => {
			localRef.current = node;
			if (active) onVideoRef?.(node);
		},
		[active, onVideoRef],
	);

	return (
		<div
			className="gallery-lightbox__video-frame"
			style={
				frameSize
					? { width: `${frameSize.width}px`, height: `${frameSize.height}px` }
					: undefined
			}
		>
			<video
				ref={setRef}
				className="gallery-lightbox__video"
				src={src}
				controls={active}
				playsInline
				preload="auto"
			/>
		</div>
	);
}

function FlyingCloseVideo({
	src,
	time,
	style,
}: {
	src: string;
	time: number;
	style: React.CSSProperties;
}) {
	const setRef = useCallback(
		(node: HTMLVideoElement | null) => {
			if (!node) return;
			const apply = () => {
				try {
					node.currentTime = time;
				} catch {
					/* ignore seek errors during close */
				}
			};
			if (node.readyState >= 1) apply();
			else node.addEventListener('loadedmetadata', apply, { once: true });
		},
		[time],
	);

	return (
		<video
			ref={setRef}
			className="gallery-lightbox__video gallery-lightbox__video--flying"
			src={src}
			style={style}
			muted
			playsInline
			preload="auto"
			aria-hidden="true"
		/>
	);
}

function LightboxOverlay({
	session,
	mediaAudio,
	onIndexChange,
	onClosed,
	onVideoPlayingChange,
	onStashVideoReturn,
	onMediaAudioChange,
}: {
	session: LightboxSession;
	mediaAudio: MediaAudioState;
	onIndexChange: (index: number) => void;
	onClosed: () => void;
	onVideoPlayingChange: (playing: boolean) => void;
	onStashVideoReturn: (value: LightboxVideoReturn | null) => void;
	onMediaAudioChange: (update: Partial<MediaAudioState>) => void;
}) {
	const { items, index, origin, originEl, videoHandoff, galleryVideo } = session;
	const item = items[index];
	const isVideo = isGalleryVideo(item);
	const stageRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const dragRef = useRef<DragState | null>(null);
	const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
	const pinchRef = useRef<PinchState | null>(null);
	const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
	const settleTimeoutRef = useRef<number | null>(null);
	const zoomRef = useRef(1);
	const panRef = useRef({ x: 0, y: 0 });
	const handoffAppliedForIndexRef = useRef<number | null>(null);
	const pendingHandoffRef = useRef(videoHandoff);
	const prevSlideIndexRef = useRef<number | null>(null);
	const handoffCancelRef = useRef<(() => void) | null>(null);
	const galleryVideoReturnRef = useRef<LightboxVideoReturn | null>(galleryVideo ?? null);
	const stashedVideoReturnRef = useRef<LightboxVideoReturn | null>(null);
	const isClosingRef = useRef(false);
	const chromeIdleTimerRef = useRef<number | null>(null);
	const closeVideoTimeRef = useRef(0);

	const [slideWidth, setSlideWidth] = useState(() => window.innerWidth);
	const [dragX, setDragX] = useState(0);
	const [dragY, setDragY] = useState(0);
	const [dragging, setDragging] = useState(false);
	const [settling, setSettling] = useState(false);
	const [suppressTransition, setSuppressTransition] = useState(false);
	const [closing, setClosing] = useState(false);
	const [entered, setEntered] = useState(false);
	const [closeStyle, setCloseStyle] = useState<React.CSSProperties | undefined>();
	const [chromeVisible, setChromeVisible] = useState(true);
	const [metaVisible, setMetaVisible] = useState(true);
	const [finePointer, setFinePointer] = useState(() =>
		typeof window !== 'undefined'
			? window.matchMedia('(hover: hover) and (pointer: fine)').matches
			: false,
	);
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [zoomAnimating, setZoomAnimating] = useState(false);

	zoomRef.current = zoom;
	panRef.current = pan;

	const prevIndex = (index - 1 + items.length) % items.length;
	const nextIndex = (index + 1) % items.length;
	const canNavigate = items.length > 1;
	const isZoomed = !isVideo && zoom > 1.02;

	const clearChromeIdleTimer = useCallback(() => {
		if (chromeIdleTimerRef.current !== null) {
			window.clearTimeout(chromeIdleTimerRef.current);
			chromeIdleTimerRef.current = null;
		}
	}, []);

	const scheduleChromeIdleHide = useCallback(() => {
		clearChromeIdleTimer();
		if (!finePointer) return;
		chromeIdleTimerRef.current = window.setTimeout(() => {
			setChromeVisible(false);
			chromeIdleTimerRef.current = null;
		}, CHROME_IDLE_MS);
	}, [clearChromeIdleTimer, finePointer]);

	const revealChrome = useCallback(() => {
		setChromeVisible(true);
		scheduleChromeIdleHide();
	}, [scheduleChromeIdleHide]);

	const onDesktopPointerActivity = useCallback(() => {
		if (!finePointer) return;
		revealChrome();
	}, [finePointer, revealChrome]);

	const onChromeZoneEnter = useCallback(() => {
		if (!finePointer) return;
		clearChromeIdleTimer();
		setChromeVisible(true);
	}, [clearChromeIdleTimer, finePointer]);

	const onChromeZoneLeave = useCallback(() => {
		if (!finePointer) return;
		scheduleChromeIdleHide();
	}, [finePointer, scheduleChromeIdleHide]);

	useEffect(() => {
		const media = window.matchMedia('(hover: hover) and (pointer: fine)');
		const onChange = () => setFinePointer(media.matches);
		media.addEventListener('change', onChange);
		return () => media.removeEventListener('change', onChange);
	}, []);

	useEffect(() => {
		if (!entered) return;
		if (finePointer) {
			setChromeVisible(true);
			scheduleChromeIdleHide();
		}
		return clearChromeIdleTimer;
	}, [clearChromeIdleTimer, entered, finePointer, index, scheduleChromeIdleHide]);

	useEffect(() => () => clearChromeIdleTimer(), [clearChromeIdleTimer]);

	useEffect(() => {
		document.body.classList.add('nav-lock');
		const frame = requestAnimationFrame(() => setEntered(true));
		return () => {
			cancelAnimationFrame(frame);
			document.body.classList.remove('nav-lock');
			if (settleTimeoutRef.current !== null) {
				window.clearTimeout(settleTimeoutRef.current);
			}
			onVideoPlayingChange(false);
		};
	}, [onVideoPlayingChange]);

	useLayoutEffect(() => {
		const measure = () => {
			const width = stageRef.current?.clientWidth || window.innerWidth;
			setSlideWidth(width);
		};
		measure();
		window.addEventListener('resize', measure);
		return () => window.removeEventListener('resize', measure);
	}, []);

	useEffect(() => {
		setDragX(0);
		setDragY(0);
		setDragging(false);
		setClosing(false);
		setCloseStyle(undefined);
		setZoom(1);
		setPan({ x: 0, y: 0 });
		setZoomAnimating(false);
		pinchRef.current = null;
		pointersRef.current.clear();
		const hadPriorSlide = prevSlideIndexRef.current !== null;
		prevSlideIndexRef.current = index;
		if (hadPriorSlide) {
			pauseVideosIn(stageRef.current);
			onVideoPlayingChange(false);
		}
	}, [index, onVideoPlayingChange]);

	useEffect(() => {
		if (videoHandoff) pendingHandoffRef.current = videoHandoff;
	}, [videoHandoff]);

	useEffect(() => {
		if (!isVideo) {
			onVideoPlayingChange(false);
			return;
		}

		const video = videoRef.current;
		if (!video) return;

		const handlePlay = () => onVideoPlayingChange(true);
		const handleStop = () => onVideoPlayingChange(false);

		video.addEventListener('play', handlePlay);
		video.addEventListener('playing', handlePlay);
		video.addEventListener('pause', handleStop);
		video.addEventListener('ended', handleStop);
		onVideoPlayingChange(!video.paused);

		return () => {
			video.removeEventListener('play', handlePlay);
			video.removeEventListener('playing', handlePlay);
			video.removeEventListener('pause', handleStop);
			video.removeEventListener('ended', handleStop);
		};
	}, [index, isVideo, onVideoPlayingChange]);

	const applyVideoHandoff = useCallback((video: HTMLVideoElement) => {
		const handoff = pendingHandoffRef.current;
		if (!handoff || handoffAppliedForIndexRef.current === index) return;

		handoffCancelRef.current?.();
		handoffAppliedForIndexRef.current = index;
		pendingHandoffRef.current = null;

		let cancelled = false;
		handoffCancelRef.current = () => {
			cancelled = true;
		};

		void (async () => {
			const waitForMetadata = () =>
				new Promise<void>((resolve) => {
					if (video.readyState >= 1) {
						resolve();
						return;
					}
					const onReady = () => {
						video.removeEventListener('loadedmetadata', onReady);
						resolve();
					};
					video.addEventListener('loadedmetadata', onReady);
				});

			await waitForMetadata();
			if (cancelled) return;

			video.volume = mediaAudio.volume;
			if (typeof handoff.muted === 'boolean') {
				video.muted = handoff.muted;
			} else {
				video.muted = mediaAudio.muted;
			}

			if (typeof handoff.currentTime === 'number' && Number.isFinite(handoff.currentTime)) {
				const targetTime = Math.max(0, handoff.currentTime);
				await new Promise<void>((resolve) => {
					let settled = false;
					const finish = () => {
						if (settled) return;
						settled = true;
						video.removeEventListener('seeked', finish);
						resolve();
					};
					video.addEventListener('seeked', finish);
					try {
						video.currentTime = targetTime;
					} catch {
						finish();
						return;
					}
					window.setTimeout(finish, 120);
				});
			}

			if (cancelled) return;

			video.volume = mediaAudio.volume;
			if (typeof handoff.muted === 'boolean') {
				video.muted = handoff.muted;
			}

			if (handoff.play) {
				try {
					await video.play();
				} catch {
					if (cancelled) return;
					video.muted = true;
					try {
						await video.play();
					} catch {
						/* autoplay blocked */
					}
				}
			}
		})();
	}, [index, mediaAudio.muted, mediaAudio.volume]);

	useEffect(() => {
		if (!isVideo) return;
		const video = videoRef.current;
		if (video) applyVideoHandoff(video);
	}, [applyVideoHandoff, isVideo, videoHandoff]);

	useEffect(() => {
		return () => handoffCancelRef.current?.();
	}, [index]);

	const [activeVideoEpoch, setActiveVideoEpoch] = useState(0);

	const setActiveVideoRef = useCallback(
		(node: HTMLVideoElement | null) => {
			videoRef.current = node;
			if (node) {
				node.volume = mediaAudio.volume;
				node.muted = mediaAudio.muted;
				applyVideoHandoff(node);
				setActiveVideoEpoch((value) => value + 1);
			}
		},
		[applyVideoHandoff, mediaAudio.muted, mediaAudio.volume],
	);

	useEffect(() => {
		if (!isVideo) return;
		const video = videoRef.current;
		if (!video) return;
		if (Math.abs(video.volume - mediaAudio.volume) > 0.001) {
			video.volume = mediaAudio.volume;
		}
		if (video.muted !== mediaAudio.muted) {
			video.muted = mediaAudio.muted;
		}
	}, [activeVideoEpoch, isVideo, mediaAudio.muted, mediaAudio.volume]);

	const releasePageLock = useCallback(() => {
		document.body.classList.remove('nav-lock');
	}, []);

	const finalizeGalleryVideoReturn = useCallback(() => {
		const tracked = galleryVideoReturnRef.current;
		if (!tracked) return;

		if (isVideo && item.path === tracked.path && videoRef.current) {
			galleryVideoReturnRef.current = {
				...tracked,
				currentTime: videoRef.current.currentTime,
				muted: videoRef.current.muted,
				volume: videoRef.current.volume,
				play: !videoRef.current.paused,
			};
		}

		stashedVideoReturnRef.current = galleryVideoReturnRef.current;
	}, [isVideo, item.path]);

	const finishClose = useCallback(() => {
		isClosingRef.current = false;
		onStashVideoReturn(stashedVideoReturnRef.current ?? galleryVideoReturnRef.current);
		stashedVideoReturnRef.current = null;
		releasePageLock();
		onClosed();
	}, [onClosed, onStashVideoReturn, releasePageLock]);

	useEffect(() => {
		const tracked = galleryVideoReturnRef.current;
		if (!isVideo) return;
		const video = videoRef.current;
		if (!video) return;

		const syncReturn = () => {
			if (isClosingRef.current) return;
			if (!tracked || item.path !== tracked.path) return;
			galleryVideoReturnRef.current = {
				path: tracked.path,
				currentTime: video.currentTime,
				muted: video.muted,
				volume: video.volume,
				play: !video.paused,
			};
		};

		const syncAudio = () => {
			onMediaAudioChange({ volume: video.volume, muted: video.muted });
			syncReturn();
		};

		video.addEventListener('timeupdate', syncReturn);
		video.addEventListener('seeked', syncReturn);
		video.addEventListener('play', syncReturn);
		video.addEventListener('pause', syncReturn);
		video.addEventListener('ended', syncReturn);
		video.addEventListener('volumechange', syncAudio);
		syncReturn();

		return () => {
			syncReturn();
			video.removeEventListener('timeupdate', syncReturn);
			video.removeEventListener('seeked', syncReturn);
			video.removeEventListener('play', syncReturn);
			video.removeEventListener('pause', syncReturn);
			video.removeEventListener('ended', syncReturn);
			video.removeEventListener('volumechange', syncAudio);
		};
	}, [activeVideoEpoch, index, isVideo, item.path, onMediaAudioChange]);

	const resetZoom = useCallback(() => {
		setZoom(1);
		setPan({ x: 0, y: 0 });
	}, []);

	const animateCloseToOrigin = useCallback(
		(fromDismiss = false) => {
			const isVideoItem = isGalleryVideo(item);

			if (isVideoItem && videoRef.current) {
				closeVideoTimeRef.current = videoRef.current.currentTime;
			}

			finalizeGalleryVideoReturn();
			isClosingRef.current = true;
			pauseVideosIn(stageRef.current);
			releasePageLock();

			const thumbEl = findThumbnailElement(item.path, originEl);

			const mediaEl = isVideoItem ? videoRef.current : imgRef.current;
			if (!mediaEl) {
				finishClose();
				return;
			}

			if (thumbEl) {
				ensureFilmstripThumbVisible(thumbEl);
			}

			if (!fromDismiss) {
				setDragX(0);
				setDragY(0);
				if (!isVideoItem) resetZoom();
			}

			const measureAndAnimate = () => {
				const current = isVideoItem
					? closeStartRectForVideo(videoRef.current!)
					: renderedMediaRect(imgRef.current!);
				const target = thumbEl
					? rectFromElement(thumbEl)
					: origin ?? {
							top: window.innerHeight * 0.85,
							left: window.innerWidth / 2 - current.width * 0.12,
							width: current.width * 0.24,
							height: current.height * 0.24,
						};

				setCloseStyle({
					position: 'fixed',
					top: current.top,
					left: current.left,
					width: current.width,
					height: current.height,
					maxWidth: 'none',
					maxHeight: 'none',
					margin: 0,
					padding: 0,
					transform: 'none',
					transition: 'none',
					zIndex: 1001,
					objectFit: 'fill',
				});
				setClosing(true);

				requestAnimationFrame(() => {
					setCloseStyle({
						position: 'fixed',
						top: target.top,
						left: target.left,
						width: target.width,
						height: target.height,
						maxWidth: 'none',
						maxHeight: 'none',
						margin: 0,
						padding: 0,
						transform: 'none',
						opacity: 0.15,
						transition:
							'top 0.34s cubic-bezier(0.22, 1, 0.36, 1), left 0.34s cubic-bezier(0.22, 1, 0.36, 1), width 0.34s cubic-bezier(0.22, 1, 0.36, 1), height 0.34s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease',
						zIndex: 1001,
						objectFit: 'fill',
					});
				});
			};

			requestAnimationFrame(() => {
				requestAnimationFrame(measureAndAnimate);
			});

			window.setTimeout(finishClose, finePointer ? 360 : 320);
		},
		[finePointer, finalizeGalleryVideoReturn, finishClose, item, origin, originEl, releasePageLock, resetZoom],
	);

	const goPrev = useCallback(() => {
		if (!canNavigate || closing || settling || isZoomed) return;
		revealChrome();
		onIndexChange(index - 1);
	}, [canNavigate, closing, index, isZoomed, onIndexChange, revealChrome, settling]);

	const goNext = useCallback(() => {
		if (!canNavigate || closing || settling || isZoomed) return;
		revealChrome();
		onIndexChange(index + 1);
	}, [canNavigate, closing, index, isZoomed, onIndexChange, revealChrome, settling]);

	const settleHorizontal = useCallback(
		(direction: -1 | 0 | 1) => {
			if (direction === 0) {
				setSettling(true);
				setDragX(0);
				setDragY(0);
				settleTimeoutRef.current = window.setTimeout(() => setSettling(false), 280);
				return;
			}

			setSettling(true);
			setDragX(-direction * slideWidth);
			settleTimeoutRef.current = window.setTimeout(() => {
				setSuppressTransition(true);
				onIndexChange(index + direction);
				setDragX(0);
				setDragY(0);
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setSuppressTransition(false);
						setSettling(false);
					});
				});
			}, 280);
		},
		[index, onIndexChange, slideWidth],
	);

	const clampPan = useCallback((nextZoom: number, nextPan: { x: number; y: number }) => {
		const img = imgRef.current;
		const stage = stageRef.current;
		if (!img || !stage || nextZoom <= 1) return { x: 0, y: 0 };

		const stageRect = stage.getBoundingClientRect();
		const baseWidth = img.clientWidth || img.getBoundingClientRect().width / Math.max(zoomRef.current, 0.01);
		const baseHeight = img.clientHeight || img.getBoundingClientRect().height / Math.max(zoomRef.current, 0.01);
		const scaledW = baseWidth * nextZoom;
		const scaledH = baseHeight * nextZoom;
		const maxX = Math.max(0, (scaledW - stageRect.width) / 2);
		const maxY = Math.max(0, (scaledH - stageRect.height) / 2);
		return {
			x: clamp(nextPan.x, -maxX, maxX),
			y: clamp(nextPan.y, -maxY, maxY),
		};
	}, []);

	const setZoomAroundPoint = useCallback(
		(nextZoomRaw: number, clientX: number, clientY: number, animate = false) => {
			const img = imgRef.current;
			if (!img) return;

			const nextZoom = clamp(nextZoomRaw, MIN_ZOOM, MAX_ZOOM);
			const rect = img.getBoundingClientRect();
			const currentZoom = zoomRef.current;
			const currentPan = panRef.current;

			const offsetX = clientX - (rect.left + rect.width / 2);
			const offsetY = clientY - (rect.top + rect.height / 2);
			const nextPan = clampPan(nextZoom, {
				x: currentPan.x + offsetX * (1 - nextZoom / currentZoom),
				y: currentPan.y + offsetY * (1 - nextZoom / currentZoom),
			});

			if (animate) setZoomAnimating(true);
			setZoom(nextZoom);
			setPan(nextZoom <= 1 ? { x: 0, y: 0 } : nextPan);
			if (animate) {
				window.setTimeout(() => setZoomAnimating(false), 240);
			}
		},
		[clampPan],
	);

	const toggleClickZoom = useCallback(
		(clientX: number, clientY: number) => {
			if (zoomRef.current > 1.05) {
				setZoomAnimating(true);
				setZoom(1);
				setPan({ x: 0, y: 0 });
				window.setTimeout(() => setZoomAnimating(false), 240);
				return;
			}
			setZoomAroundPoint(CLICK_ZOOM, clientX, clientY, true);
		},
		[setZoomAroundPoint],
	);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (closing || settling) return;
			if (event.key === 'Escape') {
				if (isZoomed) {
					resetZoom();
					return;
				}
				animateCloseToOrigin();
			}
			if (event.key === 'ArrowLeft') goPrev();
			if (event.key === 'ArrowRight') goNext();
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [animateCloseToOrigin, closing, goNext, goPrev, isZoomed, resetZoom, settling]);

	const updatePinch = () => {
		const points = [...pointersRef.current.values()];
		if (points.length < 2 || !pinchRef.current) return;

		const [a, b] = points;
		const distance = Math.hypot(a.x - b.x, a.y - b.y);
		const midX = (a.x + b.x) / 2;
		const midY = (a.y + b.y) / 2;
		const pinch = pinchRef.current;
		const ratio = distance / Math.max(pinch.startDistance, 1);
		const nextZoom = clamp(pinch.startZoom * ratio, MIN_ZOOM, MAX_ZOOM);

		const midOffsetX = midX - pinch.startMidX;
		const midOffsetY = midY - pinch.startMidY;
		const zoomRatio = nextZoom / Math.max(pinch.startZoom, 0.01);

		setZoom(nextZoom);
		setPan(
			clampPan(nextZoom, {
				x: pinch.startPanX * zoomRatio + midOffsetX,
				y: pinch.startPanY * zoomRatio + midOffsetY,
			}),
		);
	};

	const onPointerDown = (event: React.PointerEvent) => {
		if (closing || settling) return;
		if (event.button !== 0 && event.pointerType === 'mouse') return;

		const isTouch = event.pointerType === 'touch';

		// Desktop on video: native controls handle interaction
		if (isVideo && !isTouch) return;

		// Desktop: click to zoom, no swipe/pan
		if (!isTouch) {
			dragRef.current = {
				pointerId: event.pointerId,
				startX: event.clientX,
				startY: event.clientY,
				x: 0,
				y: 0,
				mode: 'undecided',
				moved: false,
				isTouch: false,
			};
			return;
		}

		pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

		if (isVideo && (event.target as HTMLElement).closest('.gallery-lightbox__video-frame')) {
			return;
		}

		if (isVideo) {
			event.preventDefault();
		}

		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

		if (pointersRef.current.size === 2) {
			const points = [...pointersRef.current.values()];
			const [a, b] = points;
			pinchRef.current = {
				startDistance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
				startZoom: zoomRef.current,
				startPanX: panRef.current.x,
				startPanY: panRef.current.y,
				startMidX: (a.x + b.x) / 2,
				startMidY: (a.y + b.y) / 2,
			};
			dragRef.current = null;
			setDragging(true);
			setZoomAnimating(false);
			return;
		}

		dragRef.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			x: 0,
			y: 0,
			mode: isZoomed ? 'pan' : 'undecided',
			moved: false,
			isTouch: true,
		};

		if (isZoomed) {
			panStartRef.current = {
				x: event.clientX,
				y: event.clientY,
				panX: panRef.current.x,
				panY: panRef.current.y,
			};
		}

		setDragging(true);
	};

	const onPointerMove = (event: React.PointerEvent) => {
		if (closing || settling) return;

		const state = dragRef.current;

		// Desktop: only track whether the pointer moved (cancel click-zoom if dragged)
		if (state && !state.isTouch && state.pointerId === event.pointerId) {
			const dx = event.clientX - state.startX;
			const dy = event.clientY - state.startY;
			if (Math.hypot(dx, dy) > TAP_MOVE_THRESHOLD) state.moved = true;
			return;
		}

		if (pointersRef.current.has(event.pointerId)) {
			pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
		}

		if (pointersRef.current.size >= 2) {
			updatePinch();
			return;
		}

		if (!state || state.pointerId !== event.pointerId) return;

		const dx = event.clientX - state.startX;
		const dy = event.clientY - state.startY;
		if (Math.hypot(dx, dy) > TAP_MOVE_THRESHOLD) state.moved = true;

		if (state.mode === 'pan' || (isZoomed && state.mode !== 'vertical' && state.mode !== 'horizontal')) {
			state.mode = 'pan';
			const nextPan = clampPan(zoomRef.current, {
				x: panStartRef.current.panX + (event.clientX - panStartRef.current.x),
				y: panStartRef.current.panY + (event.clientY - panStartRef.current.y),
			});
			setPan(nextPan);
			return;
		}

		if (state.mode === 'undecided') {
			if (Math.hypot(dx, dy) < 8) return;
			state.mode = Math.abs(dy) > Math.abs(dx) * 1.15 ? 'vertical' : 'horizontal';
		}

		if (state.mode === 'vertical') {
			const y = Math.max(dy, dy * 0.2);
			state.x = 0;
			state.y = y;
			setDragX(0);
			setDragY(state.y);
			return;
		}

		if (!canNavigate) {
			state.x = dx * 0.25;
			state.y = 0;
			setDragX(state.x);
			setDragY(0);
			return;
		}

		state.x = dx;
		state.y = 0;
		setDragX(state.x);
		setDragY(0);
	};

	const onPointerUp = (event: React.PointerEvent) => {
		const state = dragRef.current;

		// Desktop click-to-zoom
		if (state && !state.isTouch && state.pointerId === event.pointerId) {
			dragRef.current = null;
			if (!state.moved && !closing) {
				toggleClickZoom(event.clientX, event.clientY);
			}
			return;
		}

		pointersRef.current.delete(event.pointerId);

		if (pointersRef.current.size < 2) {
			pinchRef.current = null;
		}

		if (pointersRef.current.size === 1) {
			const remaining = [...pointersRef.current.entries()][0];
			if (remaining) {
				const [pointerId, point] = remaining;
				dragRef.current = {
					pointerId,
					startX: point.x,
					startY: point.y,
					x: 0,
					y: 0,
					mode: zoomRef.current > 1.02 ? 'pan' : 'undecided',
					moved: true,
					isTouch: true,
				};
				panStartRef.current = {
					x: point.x,
					y: point.y,
					panX: panRef.current.x,
					panY: panRef.current.y,
				};
			}
			return;
		}

		if (pointersRef.current.size === 0) {
			setDragging(false);
			if (zoomRef.current < 1.05) {
				resetZoom();
			} else {
				setPan(clampPan(zoomRef.current, panRef.current));
			}
		}

		if (!state || state.pointerId !== event.pointerId || closing) {
			return;
		}

		dragRef.current = null;
		setDragging(false);

		// Tap with no drag: toggle chrome on touch (letterbox taps; video frame handles its own taps).
		if (!state.moved) {
			if (isVideo) {
				event.preventDefault();
			}
			if (!finePointer) {
				setChromeVisible((visible) => !visible);
				setMetaVisible((visible) => !visible);
			}
			return;
		}

		if (state.mode === 'pan') {
			if (zoomRef.current <= 1.02) resetZoom();
			return;
		}

		if (state.mode === 'vertical' && state.y > 110 && !isZoomed) {
			animateCloseToOrigin(true);
			return;
		}

		if (state.mode === 'vertical') {
			setSettling(true);
			setDragX(0);
			setDragY(0);
			settleTimeoutRef.current = window.setTimeout(() => setSettling(false), 280);
			return;
		}

		if (state.mode === 'horizontal' && canNavigate && !isZoomed) {
			const threshold = Math.min(120, slideWidth * 0.22);
			if (state.x <= -threshold) {
				settleHorizontal(1);
				return;
			}
			if (state.x >= threshold) {
				settleHorizontal(-1);
				return;
			}
		}

		settleHorizontal(0);
		setDragY(0);
	};

	const dismissProgress = Math.min(1, Math.max(0, dragY / 280));
	const dragScale = isZoomed ? 1 : 1 - dismissProgress * 0.12;
	const backdropOpacity = entered ? 0.55 - dismissProgress * 0.35 : 0;
	const isDismissing = !isZoomed && dragY > 0;
	const baseOffset = canNavigate ? -slideWidth : 0;
	const shouldTransition = !dragging && !suppressTransition && (settling || !closing);

	const trackStyle: React.CSSProperties = closing
		? { transform: `translate3d(${baseOffset}px, 0, 0)`, transition: 'none', visibility: 'hidden' }
		: {
				transform: `translate3d(${baseOffset + (isZoomed ? 0 : dragX)}px, ${isZoomed ? 0 : dragY}px, 0) scale(${dragScale})`,
				transition: shouldTransition
					? 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
					: 'none',
		  };

	const activeImageStyle: React.CSSProperties = {
		transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
		transition: zoomAnimating ? 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
	};

	const slides = canNavigate
		? [
				{ key: `prev-${prevIndex}-${items[prevIndex].path}`, item: items[prevIndex], role: 'prev' as const },
				{ key: `active-${index}-${item.path}`, item, role: 'active' as const },
				{ key: `next-${nextIndex}-${items[nextIndex].path}`, item: items[nextIndex], role: 'next' as const },
		  ]
		: [{ key: `active-${index}-${item.path}`, item, role: 'active' as const }];

	return createPortal(
		<div
			className={[
				'gallery-lightbox',
				entered ? 'is-open' : '',
				closing ? 'is-closing' : '',
				isDismissing ? 'is-dismissing' : '',
				chromeVisible ? '' : 'chrome-hidden',
				metaVisible ? '' : 'meta-hidden',
				finePointer && !chromeVisible ? 'cursor-hidden' : '',
				isZoomed ? 'is-zoomed' : '',
			].filter(Boolean).join(' ')}
			role="dialog"
			aria-modal="true"
			aria-label="Project media gallery"
			style={{ ['--lightbox-backdrop-opacity' as string]: String(backdropOpacity) }}
			onMouseMove={onDesktopPointerActivity}
		>
			<button
				type="button"
				className="gallery-lightbox__close"
				aria-label="Close gallery"
				onClick={() => animateCloseToOrigin()}
				onMouseEnter={onChromeZoneEnter}
				onMouseLeave={onChromeZoneLeave}
				disabled={closing}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path
						d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.2"
						strokeLinecap="round"
					/>
				</svg>
			</button>

			<button
				type="button"
				className="gallery-lightbox__meta-toggle"
				aria-pressed={metaVisible}
				aria-label={metaVisible ? 'Hide description' : 'Show description'}
				hidden={closing}
				onClick={() => setMetaVisible((visible) => !visible)}
				onMouseEnter={onChromeZoneEnter}
				onMouseLeave={onChromeZoneLeave}
			>
				<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path
						d="M4 7.5h16M4 12h16M4 16.5h10"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					/>
				</svg>
				<span>{metaVisible ? 'Hide description' : 'Show description'}</span>
			</button>

			{canNavigate ? (
				<>
					<button
						type="button"
						className="gallery-lightbox__nav gallery-lightbox__nav--prev"
						aria-label="Previous image"
						onClick={goPrev}
						onMouseEnter={onChromeZoneEnter}
						onMouseLeave={onChromeZoneLeave}
						disabled={closing || settling || isZoomed}
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
						className="gallery-lightbox__nav gallery-lightbox__nav--next"
						aria-label="Next image"
						onClick={goNext}
						onMouseEnter={onChromeZoneEnter}
						onMouseLeave={onChromeZoneLeave}
						disabled={closing || settling || isZoomed}
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

			<div
				ref={stageRef}
				className={`gallery-lightbox__stage${isVideo ? ' gallery-lightbox__stage--video' : ''}`}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
			>
				<div
					ref={trackRef}
					className={`gallery-lightbox__track${canNavigate ? '' : ' gallery-lightbox__track--single'}`}
					style={trackStyle}
				>
					{slides.map((slide) => {
						const slideIsVideo = isGalleryVideo(slide.item);
						return (
							<div
								key={slide.key}
								className={`gallery-lightbox__slide${slide.role === 'active' ? ' is-active' : ''}${slideIsVideo ? ' is-video' : ''}`}
								style={{ width: slideWidth }}
							>
								{slideIsVideo ? (
									<LightboxVideoSlide
										src={galleryItemUrl(slide.item)}
										active={slide.role === 'active'}
										slideWidth={slideWidth}
										onVideoRef={slide.role === 'active' ? setActiveVideoRef : undefined}
									/>
								) : (
									<img
										ref={slide.role === 'active' ? imgRef : undefined}
										className="gallery-lightbox__image"
										src={galleryItemUrl(slide.item)}
										alt={slide.item.title}
										draggable={false}
										style={slide.role === 'active' ? activeImageStyle : undefined}
									/>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{closing && closeStyle ? (
				isVideo ? (
					<FlyingCloseVideo
						src={galleryItemUrl(item)}
						time={closeVideoTimeRef.current}
						style={closeStyle}
					/>
				) : (
					<img
						className="gallery-lightbox__image gallery-lightbox__image--flying"
						src={galleryItemUrl(item)}
						alt=""
						draggable={false}
						style={closeStyle}
					/>
				)
			) : null}

			<div
				className="gallery-lightbox__meta"
				hidden={closing}
				onMouseEnter={onChromeZoneEnter}
				onMouseLeave={onChromeZoneLeave}
			>
				<h3 className="gallery-lightbox__title">{item.title}</h3>
				{item.description ? (
					<p className="gallery-lightbox__caption">{item.description}</p>
				) : null}
				{canNavigate ? (
					<p className="gallery-lightbox__counter">
						{index + 1} / {items.length}
					</p>
				) : null}
			</div>
		</div>,
		document.body,
	);
}
