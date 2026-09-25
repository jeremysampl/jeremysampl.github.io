import React, { type CSSProperties, type MouseEvent, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../displays/Icon';
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

function cssAspectRatio(value: MediaAspectRatio): string {
	if (typeof value === 'number') return String(value);
	if (typeof value === 'string') return value;
	return `${value[0]} / ${value[1]}`;
}

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
	onIntrinsicAspect,
}: Pick<MediaCardProps, 'title' | 'src' | 'alt' | 'isVideo' | 'path' | 'onIntrinsicAspect'>) {
	const imageRef = useRef<HTMLImageElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (!onIntrinsicAspect) return;

		if (isVideo) {
			const video = videoRef.current;
			if (video && video.readyState >= 1 && video.videoWidth && video.videoHeight) {
				onIntrinsicAspect(video.videoWidth / video.videoHeight);
			}
			return;
		}

		const image = imageRef.current;
		if (image?.complete && image.naturalWidth && image.naturalHeight) {
			onIntrinsicAspect(image.naturalWidth / image.naturalHeight);
		}
	}, [isVideo, onIntrinsicAspect, src]);

	const reportAspect = (width: number, height: number) => {
		if (!onIntrinsicAspect || !width || !height) return;
		onIntrinsicAspect(width / height);
	};

	return (
		<>
			<span className="media-card__media">
				{isVideo ? (
					<video
						ref={videoRef}
						className="media-card__thumb"
						src={src}
						data-gallery-path={path}
						muted
						playsInline
						preload="metadata"
						aria-hidden="true"
						onLoadedMetadata={(event) => {
							const video = event.currentTarget;
							reportAspect(video.videoWidth, video.videoHeight);
						}}
					/>
				) : (
					<img
						ref={imageRef}
						className="media-card__thumb"
						src={src}
						data-gallery-path={path}
						alt={alt ?? title}
						loading="lazy"
						onLoad={(event) => {
							const image = event.currentTarget;
							reportAspect(image.naturalWidth, image.naturalHeight);
						}}
					/>
				)}
				{isVideo ? (
					<span className="media-card__play" aria-hidden="true">
						<span className="media-card__play-icon">
							<Icon name="play" size={22} color="#fff" style={{ transform: 'translateX(3px)' }} />
						</span>
					</span>
				) : null}
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
