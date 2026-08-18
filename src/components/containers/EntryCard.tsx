import { type ReactNode } from 'react';
import ExternalIconLink from '../displays/ExternalIconLink';
import Icon from '../displays/Icon';
import '../../styles/entry-card.css';

export type EntryCardMetaProps = {
	dateRange: string;
	location: string;
	locationHref?: string;
};

export function EntryCardMeta({ dateRange, location, locationHref }: EntryCardMetaProps) {
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
				<span>
					{location}
					{locationHref ? (
						<ExternalIconLink href={locationHref} label={`Map of ${location}`} />
					) : null}
				</span>
			</span>
		</div>
	);
}

export type EntryCardHeaderProps = {
	title: string;
	subtitle: string;
	subtitleHref?: string;
	detail?: string;
	dateRange: string;
	location: string;
	locationHref?: string;
	children?: ReactNode;
	titleAs?: 'h2' | 'h3';
	subtitleAs?: 'h2' | 'h3' | 'p';
};

export function EntryCardHeader({
	title,
	subtitle,
	subtitleHref,
	detail,
	dateRange,
	location,
	locationHref,
	children,
	titleAs = 'h3',
	subtitleAs = 'p',
}: EntryCardHeaderProps) {
	const TitleTag = titleAs;
	const SubtitleTag = subtitleAs;

	return (
		<header className="entry-card__header">
			<TitleTag className="entry-card__title">{title}</TitleTag>
			<SubtitleTag className="entry-card__subtitle">
				{subtitle}
				{subtitleHref ? (
					<ExternalIconLink href={subtitleHref} label={`${subtitle} website`} />
				) : null}
			</SubtitleTag>
			{detail ? <p className="entry-card__detail">{detail}</p> : null}
			<EntryCardMeta dateRange={dateRange} location={location} locationHref={locationHref} />
			{children}
		</header>
	);
}
