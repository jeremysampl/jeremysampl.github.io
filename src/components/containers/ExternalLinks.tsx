import React from 'react';
import Icon from '../displays/Icon';
import { projectGithubUrl } from '../../data/projects';

export type ExternalLinksProps = {
	github?: string;
	website?: string;
	/** Replaces the default globe on the site button. */
	siteIconSrc?: string;
	siteIconAlt?: string;
	siteLabel?: string;
	githubLabel?: string;
};

function displayHost(url: string) {
	try {
		const parsed = new URL(url);
		return `${parsed.host}${parsed.pathname}`.replace(/\/$/, '');
	} catch {
		return url;
	}
}

function githubMeta(github: string, href: string) {
	if (/^https?:\/\//i.test(github)) return displayHost(href);
	return `jeremysampl/${github}`;
}

export default function ExternalLinks({
	github,
	website,
	siteIconSrc,
	siteIconAlt = '',
	siteLabel = 'Visit site',
	githubLabel = 'View source',
}: ExternalLinksProps) {
	const githubHref = github ? projectGithubUrl(github) : null;
	if (!githubHref && !website) return null;

	return (
		<div className="external-links">
			{website ? (
				<a className="external-link external-link--site" href={website} target="_blank" rel="noreferrer">
					<span
						className={`external-link__icon${siteIconSrc ? ' external-link__icon--image' : ''}`}
						aria-hidden="true"
					>
						{siteIconSrc ? (
							<img src={siteIconSrc} alt={siteIconAlt} />
						) : (
							<Icon name="globe" size={18} color="#fff" />
						)}
					</span>
					<span className="external-link__copy">
						<span className="external-link__label">{siteLabel}</span>
						<span className="external-link__meta">{displayHost(website).replace(/^www\./, '')}</span>
					</span>
				</a>
			) : null}
			{githubHref ? (
				<a className="external-link external-link--github" href={githubHref} target="_blank" rel="noreferrer">
					<span className="external-link__icon" aria-hidden="true">
						<Icon name="github" size={18} color="#fff" />
					</span>
					<span className="external-link__copy">
						<span className="external-link__label">{githubLabel}</span>
						<span className="external-link__meta">{githubMeta(github, githubHref)}</span>
					</span>
				</a>
			) : null}
		</div>
	);
}
