import React, { type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../displays/Icon';
import '../../styles/media-card.css';

export type MediaCardProps = {
	title: string;
	src: string;
	alt?: string;
	href?: string;
	isVideo?: boolean;
	compact?: boolean;
	active?: boolean;
	path?: string;
	onClick?: (event: MouseEvent<HTMLElement>, origin: HTMLElement) => void;
};

function MediaCardBody({
	title,
	src,
	alt,
	isVideo,
	path,
}: Pick<MediaCardProps, 'title' | 'src' | 'alt' | 'isVideo' | 'path'>) {
	return (
		<>
			<span className="media-card__media">
				{isVideo ? (
					<video
						className="media-card__thumb"
						src={src}
						data-gallery-path={path}
						muted
						playsInline
						preload="metadata"
						aria-hidden="true"
					/>
				) : (
					<img
						className="media-card__thumb"
						src={src}
						data-gallery-path={path}
						alt={alt ?? title}
						loading="lazy"
					/>
				)}
				{isVideo ? (
					<span className="media-card__play" aria-hidden="true">
						<span className="media-card__play-icon">
							<Icon name="play" size={22} color="#fff" />
						</span>
					</span>
				) : null}
			</span>
			<span className="media-card__label">{title}</span>
		</>
	);
}

function mediaCardClassName({ compact, active }: Pick<MediaCardProps, 'compact' | 'active'>) {
	return [
		'media-card',
		compact ? 'media-card--compact' : '',
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
	onClick,
}: MediaCardProps) {
	const originFrom = (el: HTMLElement) =>
		el.querySelector<HTMLElement>('.media-card__thumb') ?? el;
	const className = mediaCardClassName({ compact, active });

	if (href) {
		return (
			<Link to={href} className={className}>
				<MediaCardBody title={title} src={src} alt={alt} isVideo={isVideo} path={path} />
			</Link>
		);
	}

	return (
		<button
			type="button"
			className={className}
			onClick={(event) => onClick?.(event, originFrom(event.currentTarget))}
		>
			<MediaCardBody title={title} src={src} alt={alt} isVideo={isVideo} path={path} />
		</button>
	);
}

export function MediaCardGrid({
	children,
	columns = 2,
	variant = 'grid',
	gridRef,
}: {
	children: React.ReactNode;
	columns?: 2 | 3;
	variant?: 'grid' | 'filmstrip';
	gridRef?: React.Ref<HTMLDivElement>;
}) {
	const className = [
		'media-card-grid',
		variant === 'filmstrip' ? 'media-card-grid--filmstrip' : '',
		variant === 'grid' && columns === 3 ? 'media-card-grid--3' : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div ref={gridRef} className={className}>
			{children}
		</div>
	);
}
