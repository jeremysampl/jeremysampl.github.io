import React, { useEffect, useRef } from 'react';
import { useGalleryLightbox } from '../views/GalleryLightbox';
import MediaCard, { MediaCardGrid } from './MediaCard';
import type { GalleryItem } from '../../types/gallery';
import { galleryItemUrl, isGalleryVideo } from '../../types/gallery';

export type { GalleryItem };

/** Compact filmstrip whose lightbox only cycles through the given items. */
export function ProjectFilmstrip({
	media,
	activePath,
}: {
	media: GalleryItem[];
	activePath?: string;
}) {
	return <ProjectMediaGrid media={media} variant="filmstrip" activePath={activePath} />;
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

export default function ProjectMediaGrid({
	media,
	variant = 'grid',
	activePath,
	onSelect,
}: {
	media: GalleryItem[];
	variant?: 'grid' | 'filmstrip';
	activePath?: string;
	/** If provided, filmstrip/grid selection calls this instead of opening the lightbox. */
	onSelect?: (index: number, item: GalleryItem) => void;
}) {
	const { openLightbox } = useGalleryLightbox();
	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (variant !== 'filmstrip' || !activePath) return;
		const strip = gridRef.current;
		if (!strip) return;

		const frame = window.requestAnimationFrame(() => {
			scrollActiveFilmstripThumbIntoView(strip);
		});
		return () => window.cancelAnimationFrame(frame);
	}, [activePath, media, variant]);

	if (!media.length) return null;

	return (
		<MediaCardGrid columns={3} variant={variant} gridRef={gridRef}>
			{media.map((item, index) => (
				<MediaCard
					key={`${item.path}-${index}`}
					title={item.title}
					src={galleryItemUrl(item)}
					path={item.path}
					isVideo={isGalleryVideo(item)}
					compact={variant === 'filmstrip'}
					active={Boolean(activePath && item.path === activePath)}
					onClick={(_, origin) => {
						if (onSelect) {
							onSelect(index, item);
							return;
						}
						openLightbox(media, index, origin);
					}}
				/>
			))}
		</MediaCardGrid>
	);
}
