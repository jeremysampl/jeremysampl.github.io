import React, { type CSSProperties, type MouseEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AspectImage, { cssAspectRatio } from '../displays/AspectImage';
import Icon from '../displays/Icon';
import { useDeferredSrc } from '../../utils/imageLoadDelay';
import { lookupImageSize, imageAspectRatio } from '../../utils/imageSize';
import {
	type MediaAspectRatio,
	type MediaMaxPerRow,
	type MediaStripAlign,
	type MediaStripAspectRatio,
} from './MediaFlexGrid';
import '../../styles/media-card.css';

export type {
	MediaAspectRatio,
	MediaMaxPerRow,
	MediaStripAlign,
	MediaStripAspectRatio,
};

export type MediaCardProps = {
	title: string;
	src: string;
	alt?: string;
	href?: string;
	isVideo?: boolean;
	compact?: boolean;
	active?: boolean;
	path?: string;
	/** Size the thumb from the media's own aspect ratio. */
	naturalAspect?: boolean;
	/** Flex grow weight within its row. */
	flex?: number;
	/** Fires with width/height once the thumb's intrinsic size is known. */
	onIntrinsicAspect?: (ratio: number) => void;
	onClick?: (event: MouseEvent<HTMLElement>, origin: HTMLElement) => void;
};

function MediaCardBody({
	title,
	src,
	alt,
	isVideo,
	path,
	naturalAspect,
	onIntrinsicAspect,
}: Pick<
	MediaCardProps,
	'title' | 'src' | 'alt' | 'isVideo' | 'path' | 'naturalAspect' | 'onIntrinsicAspect'
>) {
	const knownSize = lookupImageSize(path ?? src);
	const knownRatio = imageAspectRatio(path ?? src);

	if (isVideo) {
		return (
			<MediaCardVideo
				title={title}
				src={src}
				path={path}
				naturalAspect={naturalAspect}
				knownRatio={knownRatio}
				onIntrinsicAspect={onIntrinsicAspect}
			/>
		);
	}

	return (
		<>
			<AspectImage
				className="media-card__media"
				imgClassName="media-card__thumb"
				src={src}
				alt={alt ?? title}
				data-gallery-path={path}
				natural={naturalAspect}
				aspectRatio={naturalAspect ? (knownSize ?? undefined) : undefined}
				onIntrinsicAspect={onIntrinsicAspect}
			/>
			<span className="media-card__label">{title}</span>
		</>
	);
}

function MediaCardVideo({
	title,
	src,
	path,
	naturalAspect,
	knownRatio,
	onIntrinsicAspect,
}: {
	title: string;
	src: string;
	path?: string;
	naturalAspect?: boolean;
	knownRatio: number | null;
	onIntrinsicAspect?: (ratio: number) => void;
}) {
	const deferredSrc = useDeferredSrc(src);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(false);
	}, [deferredSrc]);

	useEffect(() => {
		if (knownRatio != null) onIntrinsicAspect?.(knownRatio);
	}, [knownRatio, onIntrinsicAspect]);

	useEffect(() => {
		const video = videoRef.current;
		if (!video || !deferredSrc) return;
		if (video.readyState >= 1 && video.videoWidth && video.videoHeight) {
			setLoaded(true);
			if (knownRatio == null) onIntrinsicAspect?.(video.videoWidth / video.videoHeight);
		}
	}, [deferredSrc, knownRatio, onIntrinsicAspect]);

	const mediaStyle =
		naturalAspect && knownRatio != null
			? ({ aspectRatio: String(knownRatio) } as CSSProperties)
			: undefined;

	return (
		<>
			<span
				className={[
					'media-card__media',
					'aspect-image',
					naturalAspect ? 'aspect-image--natural' : '',
					loaded ? 'is-loaded' : '',
				]
					.filter(Boolean)
					.join(' ')}
				style={mediaStyle}
			>
				<span className="aspect-image__skeleton" aria-hidden="true" />
				{deferredSrc ? (
					<video
						ref={videoRef}
						className="media-card__thumb aspect-image__media"
						src={deferredSrc}
						data-gallery-path={path}
						muted
						playsInline
						preload="metadata"
						aria-hidden="true"
						onLoadedMetadata={(event) => {
							const video = event.currentTarget;
							setLoaded(true);
							if (knownRatio == null) {
								onIntrinsicAspect?.(video.videoWidth / video.videoHeight);
							}
						}}
					/>
				) : null}
				<span className="media-card__play" aria-hidden="true">
					<span className="media-card__play-icon">
						<Icon name="play" size={22} color="#fff" style={{ transform: 'translateX(3px)' }} />
					</span>
				</span>
			</span>
			<span className="media-card__label">{title}</span>
		</>
	);
}

function mediaCardClassName({
	compact,
	active,
	naturalAspect,
}: Pick<MediaCardProps, 'compact' | 'active' | 'naturalAspect'>) {
	return [
		'media-card',
		compact ? 'media-card--compact' : '',
		naturalAspect ? 'media-card--natural' : '',
		active ? 'is-active' : '',
	]
		.filter(Boolean)
		.join(' ');
}

export default function MediaCard({
	title,
	src,
	alt,
	href,
	isVideo,
	compact,
	active,
	path,
	naturalAspect,
	flex,
	onIntrinsicAspect,
	onClick,
}: MediaCardProps) {
	const originFrom = (el: HTMLElement) =>
		el.querySelector<HTMLElement>('.media-card__thumb') ?? el;
	const className = mediaCardClassName({ compact, active, naturalAspect });
	const style =
		flex != null ? ({ '--media-card-flex': String(flex) } as CSSProperties) : undefined;
	const body = (
		<MediaCardBody
			title={title}
			src={src}
			alt={alt}
			isVideo={isVideo}
			path={path}
			naturalAspect={naturalAspect}
			onIntrinsicAspect={onIntrinsicAspect}
		/>
	);

	if (href) {
		return (
			<Link to={href} className={className} style={style}>
				{body}
			</Link>
		);
	}

	return (
		<button
			type="button"
			className={className}
			style={style}
			onClick={(event) => onClick?.(event, originFrom(event.currentTarget))}
		>
			{body}
		</button>
	);
}

/** Plain CSS grid (and filmstrip) container. Prefer MediaFlexGrid for weighted/natural rows. */
export function MediaCardGrid({
	children,
	columns = 2,
	variant = 'grid',
	gridRef,
	aspectRatio,
	maxPerRow = 3,
}: {
	children: React.ReactNode;
	columns?: 2 | 3;
	variant?: 'grid' | 'filmstrip' | 'inline';
	gridRef?: React.Ref<HTMLDivElement>;
	aspectRatio?: MediaStripAspectRatio;
	maxPerRow?: MediaMaxPerRow;
}) {
	const natural = aspectRatio === 'natural';

	const className = [
		'media-card-grid',
		variant === 'filmstrip' ? 'media-card-grid--filmstrip' : '',
		variant === 'inline' ? 'media-card-grid--inline' : '',
		variant === 'grid' && columns === 3 ? 'media-card-grid--3' : '',
	]
		.filter(Boolean)
		.join(' ');

	const style = {
		...(aspectRatio != null && !natural ? { '--media-card-aspect': cssAspectRatio(aspectRatio) } : {}),
		...(variant === 'inline' ? { '--media-inline-max': String(maxPerRow) } : {}),
	} as CSSProperties;

	return (
		<div ref={gridRef} className={className} style={Object.keys(style).length ? style : undefined}>
			{children}
		</div>
	);
}
