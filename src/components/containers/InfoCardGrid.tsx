import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../displays/Icon';
import '../../styles/info-card.css';

export type InfoCardItem = {
	title: string;
	description: string;
	icon?: string;
	url?: string;
};

function isInternalPath(url: string) {
	return url.startsWith('/') && !url.startsWith('//');
}

function isExternalHttp(url: string) {
	return /^https?:\/\//i.test(url);
}

export default function InfoCardGrid({
	items,
	variant = 'surface',
}: {
	items: InfoCardItem[];
	variant?: 'surface' | 'tint';
}) {
	if (!items.length) return null;

	return (
		<div className="info-card-grid">
			{items.map((item) => {
				const className = `info-card${variant === 'tint' ? ' info-card--tint' : ''}`;
				const content = (
					<>
						{item.icon ? (
							<span className="info-card__icon" aria-hidden="true">
								<Icon name={item.icon} size={28} color="var(--secondary-color)" />
							</span>
						) : null}
						<div className="info-card__body">
							<h3 className="info-card__title">{item.title}</h3>
							<p className="info-card__text">{item.description}</p>
						</div>
					</>
				);

				if (!item.url) {
					return (
						<article key={item.title} className={className}>
							{content}
						</article>
					);
				}

				if (isInternalPath(item.url)) {
					return (
						<Link key={item.title} className={className} to={item.url}>
							{content}
						</Link>
					);
				}

				return (
					<a
						key={item.title}
						className={className}
						href={item.url}
						{...(isExternalHttp(item.url) ? { target: '_blank', rel: 'noreferrer' } : {})}
					>
						{content}
					</a>
				);
			})}
		</div>
	);
}
