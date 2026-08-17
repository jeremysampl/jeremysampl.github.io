import { type ReactNode } from 'react';
import Icon from '../displays/Icon';
import '../../styles/entry-card.css';

export type EntryCardMetaProps = {
	dateRange: string;
	location: string;
};

export function EntryCardMeta({ dateRange, location }: EntryCardMetaProps) {
	const size = 15;

	return (
		<div className="entry-card__meta">
			<span className="entry-card__meta-item">
				<Icon name="calendar" size={size} color="var(--secondary-color)" style={{ width: size, textAlign: 'center' }} />
				<span>{dateRange}</span>
			</span>
			<span className="entry-card__meta-sep" aria-hidden="true">
				·
			</span>
			<span className="entry-card__meta-item">
				<Icon name="map-marker" size={size} color="var(--secondary-color)" style={{ width: size, textAlign: 'center' }} />
				<span>{location}</span>
			</span>
		</div>
	);
}

export type EntryCardHeaderProps = {
	title: string;
	subtitle: string;
	detail?: string;
	dateRange: string;
	location: string;
	children?: ReactNode;
	titleAs?: 'h2' | 'h3';
	subtitleAs?: 'h2' | 'h3' | 'p';
};

export function EntryCardHeader({
	title,
	subtitle,
	detail,
	dateRange,
	location,
	children,
	titleAs = 'h3',
	subtitleAs = 'p',
}: EntryCardHeaderProps) {
	const TitleTag = titleAs;
	const SubtitleTag = subtitleAs;

	return (
		<header className="entry-card__header">
			<TitleTag className="entry-card__title">{title}</TitleTag>
			<SubtitleTag className="entry-card__subtitle">{subtitle}</SubtitleTag>
			{detail ? <p className="entry-card__detail">{detail}</p> : null}
			<EntryCardMeta dateRange={dateRange} location={location} />
			{children}
		</header>
	);
}
