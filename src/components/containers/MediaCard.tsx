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
	onClick?: (event: MouseEvent<HTMLElement>, origin: HTMLElement) => void;
};

function MediaCardBody({ title, src, alt, isVideo }: Pick<MediaCardProps, 'title' | 'src' | 'alt' | 'isVideo'>) {
	return (
		<>
			<span className="media-card__media">
				{isVideo ? (
					<video className="media-card__thumb" src={src} muted playsInline preload="metadata" aria-hidden="true" />
				) : (
					<img className="media-card__thumb" src={src} alt={alt ?? title} loading="lazy" />
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

export default function MediaCard({ title, src, alt, href, isVideo, onClick }: MediaCardProps) {
	const originFrom = (el: HTMLElement) =>
		el.querySelector<HTMLElement>('.media-card__thumb') ?? el;

	if (href) {
		return (
			<Link to={href} className="media-card">
				<MediaCardBody title={title} src={src} alt={alt} isVideo={isVideo} />
			</Link>
		);
	}

	return (
		<button
			type="button"
			className="media-card"
			onClick={(event) => onClick?.(event, originFrom(event.currentTarget))}
		>
			<MediaCardBody title={title} src={src} alt={alt} isVideo={isVideo} />
		</button>
	);
}

export function MediaCardGrid({
	children,
	columns = 2,
}: {
	children: React.ReactNode;
	columns?: 2 | 3;
}) {
	return (
		<div className={`media-card-grid${columns === 3 ? ' media-card-grid--3' : ''}`}>
			{children}
		</div>
	);
}
