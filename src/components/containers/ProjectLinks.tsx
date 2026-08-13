import React from 'react';
import Icon from '../displays/Icon';
import { projectGithubUrl } from '../../data/projects';

export type ProjectLinksProps = {
	github?: string;
	website?: string;
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

export default function ProjectLinks({ github, website }: ProjectLinksProps) {
	const githubHref = github ? projectGithubUrl(github) : null;
	if (!githubHref && !website) return null;

	return (
		<div className="project-links">
			{website ? (
				<a className="project-link project-link--site" href={website} target="_blank" rel="noreferrer">
					<span className="project-link__icon" aria-hidden="true">
						<Icon name="globe" size={18} color="#fff" />
					</span>
					<span className="project-link__copy">
						<span className="project-link__label">Visit site</span>
						<span className="project-link__meta">{displayHost(website).replace(/^www\./, '')}</span>
					</span>
				</a>
			) : null}
			{githubHref ? (
				<a className="project-link project-link--github" href={githubHref} target="_blank" rel="noreferrer">
					<span className="project-link__icon" aria-hidden="true">
						<Icon name="github" size={18} color="#fff" />
					</span>
					<span className="project-link__copy">
						<span className="project-link__label">View source</span>
						<span className="project-link__meta">{githubMeta(github, githubHref)}</span>
					</span>
				</a>
			) : null}
		</div>
	);
}
