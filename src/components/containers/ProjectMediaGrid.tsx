import React, { useEffect, useRef } from 'react';
import { useGalleryLightbox } from '../views/GalleryLightbox';
import MediaCard, { MediaCardGrid, type MediaAspectRatio } from './MediaCard';
import MediaFlexGrid, {
	type MediaMaxPerRow,
	type MediaStripAlign,
	type MediaStripAspectRatio,
	type MediaStripFlex,
} from './MediaFlexGrid';
import type { GalleryItem } from '../../types/gallery';
import { galleryItemUrl, isGalleryVideo } from '../../types/gallery';

export type {
	GalleryItem,
	MediaAspectRatio,
	MediaMaxPerRow,
	MediaStripAlign,
	MediaStripAspectRatio,
	MediaStripFlex,
};

/** Inline screenshot strip for project writeups. Lightbox only cycles these items. */
export function ProjectFilmstrip({
	media,
	activePath,
	aspectRatio,
	maxPerRow = 3,
	flex,
	alignItems,
}: {
	media: GalleryItem[];
	activePath?: string;
	/** Crop box for every thumb (default 16 / 10), or `'natural'` for each media's own ratio. */
	aspectRatio?: MediaStripAspectRatio;
	/** Max items per row on larger screens. Phones stay one-across. Defaults to 3. */
	maxPerRow?: MediaMaxPerRow;
	/** Flex weights per item, or `'auto'` to match height from each item's intrinsic ratio. */
	flex?: MediaStripFlex;
	/** Vertical alignment within a flex row. Defaults to `center`. */
	alignItems?: MediaStripAlign;
}) {
	return (
		<ProjectMediaGrid
			media={media}
			variant="inline"
			activePath={activePath}
			aspectRatio={aspectRatio}
			maxPerRow={maxPerRow}
			flex={flex}
			alignItems={alignItems}
		/>
	);
}

/**
 * Inline gallery reference(s) for project descriptions.
 * Clicking any thumb opens a lightbox scoped to just these items.
 */
export function ProjectGalleryRef({
	items,
	className,
}: {
	items: GalleryItem[];
	className?: string;
}) {
	const { openLightbox } = useGalleryLightbox();

	if (!items.length) return null;

	return (
		<span className={['project-gallery-ref', className].filter(Boolean).join(' ')}>
			{items.map((item, index) => (
				<button
					key={`${item.path}-${index}`}
					type="button"
					className="project-gallery-ref__item"
					aria-label={`Open ${item.title}`}
					onClick={(event) => {
						const origin =
							event.currentTarget.querySelector<HTMLElement>('.project-gallery-ref__thumb') ??
							event.currentTarget;
						openLightbox(items, index, origin);
					}}
				>
					{isGalleryVideo(item) ? (
						<video
							className="project-gallery-ref__thumb media-card__thumb"
							src={galleryItemUrl(item)}
							data-gallery-path={item.path}
							muted
							playsInline
							preload="metadata"
							aria-hidden="true"
						/>
					) : (
						<img
							className="project-gallery-ref__thumb media-card__thumb"
							src={galleryItemUrl(item)}
							data-gallery-path={item.path}
							alt={item.title}
							loading="lazy"
						/>
					)}
				</button>
			))}
		</span>
	);
}

function scrollActiveFilmstripThumbIntoView(strip: HTMLElement) {
	const active = strip.querySelector<HTMLElement>('.media-card.is-active');
	if (!active) return;

	const stripRect = strip.getBoundingClientRect();
	const activeRect = active.getBoundingClientRect();
	const epsilon = 2;
	const fullyVisible =
		activeRect.left >= stripRect.left - epsilon && activeRect.right <= stripRect.right + epsilon;

	if (fullyVisible) return;

	const paddingLeft = parseFloat(getComputedStyle(strip).paddingLeft) || 0;
	const delta = activeRect.left - (stripRect.left + paddingLeft);
	strip.scrollBy({ left: delta, behavior: 'smooth' });
}

const FILMSTRIP_USER_SCROLL_GRACE_MS = 2500;

export default function ProjectMediaGrid({
	media,
	variant = 'grid',
	activePath,
	onSelect,
	autoActiveChangeRef,
	aspectRatio,
	maxPerRow = 3,
	flex,
	alignItems,
}: {
	media: GalleryItem[];
	variant?: 'grid' | 'filmstrip' | 'inline';
	activePath?: string;
	/** If provided, filmstrip/grid selection calls this instead of opening the lightbox. */
	onSelect?: (index: number, item: GalleryItem) => void;
	/**
	 * When the parent sets this to true before an activePath change, the filmstrip
	 * treats that change as automatic (e.g. autoplay) and may skip follow-scroll
	 * if the user recently panned the strip.
	 */
	autoActiveChangeRef?: React.MutableRefObject<boolean>;
	aspectRatio?: MediaStripAspectRatio;
	maxPerRow?: MediaMaxPerRow;
	flex?: MediaStripFlex;
	alignItems?: MediaStripAlign;
}) {
	const { openLightbox } = useGalleryLightbox();
	const gridRef = useRef<HTMLDivElement>(null);
	const ignoreProgrammaticScrollRef = useRef(false);
	const programmaticScrollTimerRef = useRef<number | null>(null);
	const userScrollGraceUntilRef = useRef(0);
	const forceScrollOnSelectRef = useRef(false);
	const naturalAspect = aspectRatio === 'natural';
	const useFlexRows = variant === 'inline' && (flex != null || naturalAspect);

	useEffect(() => {
		if (variant !== 'filmstrip') return;
		const strip = gridRef.current;
		if (!strip) return;

		const onScroll = () => {
			if (ignoreProgrammaticScrollRef.current) return;
			userScrollGraceUntilRef.current = Date.now() + FILMSTRIP_USER_SCROLL_GRACE_MS;
		};

		strip.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			strip.removeEventListener('scroll', onScroll);
			if (programmaticScrollTimerRef.current !== null) {
				window.clearTimeout(programmaticScrollTimerRef.current);
				programmaticScrollTimerRef.current = null;
			}
		};
	}, [variant]);

	useEffect(() => {
		if (variant !== 'filmstrip' || !activePath) return;
		const strip = gridRef.current;
		if (!strip) return;

		const forceScroll = forceScrollOnSelectRef.current;
		forceScrollOnSelectRef.current = false;
		const automaticChange = Boolean(autoActiveChangeRef?.current);
		if (autoActiveChangeRef) autoActiveChangeRef.current = false;

		if (
			!forceScroll &&
			automaticChange &&
			Date.now() < userScrollGraceUntilRef.current
		) {
			return;
		}

		const frame = window.requestAnimationFrame(() => {
			ignoreProgrammaticScrollRef.current = true;
			scrollActiveFilmstripThumbIntoView(strip);
			if (programmaticScrollTimerRef.current !== null) {
				window.clearTimeout(programmaticScrollTimerRef.current);
			}
			programmaticScrollTimerRef.current = window.setTimeout(() => {
				ignoreProgrammaticScrollRef.current = false;
				programmaticScrollTimerRef.current = null;
			}, 450);
		});
		return () => window.cancelAnimationFrame(frame);
	}, [activePath, autoActiveChangeRef, media, variant]);

	if (!media.length) return null;

	const handleSelect = (index: number, item: GalleryItem, origin: HTMLElement) => {
		if (onSelect) {
			if (variant === 'filmstrip') {
				forceScrollOnSelectRef.current = true;
			}
			onSelect(index, item);
			return;
		}
		openLightbox(media, index, origin);
	};

	if (useFlexRows) {
		return (
			<MediaFlexGrid
				items={media}
				inline
				maxPerRow={maxPerRow}
				aspectRatio={aspectRatio}
				flex={flex ?? (naturalAspect ? 1 : undefined)}
				alignItems={alignItems}
				getKey={(item, index) => `${item.path}-${index}`}
				renderItem={(item, index, layout) => (
					<MediaCard
						title={item.title}
						src={galleryItemUrl(item)}
						path={item.path}
						isVideo={isGalleryVideo(item)}
						active={Boolean(activePath && item.path === activePath)}
						naturalAspect={layout.naturalAspect}
						flex={layout.flex}
						onIntrinsicAspect={layout.onIntrinsicAspect}
						onClick={(_, origin) => handleSelect(index, item, origin)}
					/>
				)}
			/>
		);
	}

	return (
		<MediaCardGrid
			columns={3}
			variant={variant}
			gridRef={gridRef}
			aspectRatio={aspectRatio}
			maxPerRow={maxPerRow}
		>
			{media.map((item, index) => (
				<MediaCard
					key={`${item.path}-${index}`}
					title={item.title}
					src={galleryItemUrl(item)}
					path={item.path}
					isVideo={isGalleryVideo(item)}
					compact={variant === 'filmstrip'}
					active={Boolean(activePath && item.path === activePath)}
					onClick={(_, origin) => handleSelect(index, item, origin)}
				/>
			))}
		</MediaCardGrid>
	);
}
