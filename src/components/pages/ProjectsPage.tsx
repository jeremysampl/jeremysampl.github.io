import React from 'react';
import MediaCard, { MediaCardGrid } from '../containers/MediaCard';
import { projects, projectHref, projectThumbnailSrc } from '../../data/projects';
import Spacer from '../containers/Spacer';
import InlineLink from '../displays/InlineLink';

export default function ProjectsPage() {
	return (
		<section className="project-showcase section">
			<h1>My Projects</h1>
			<p>Click on any project for more information.</p>
			<Spacer height="10" />
			<MediaCardGrid>
				{projects.map((project) => (
					<MediaCard
						key={project.id}
						title={project.name}
						src={projectThumbnailSrc(project.id)}
						href={projectHref(project.id)}
					/>
				))}
			</MediaCardGrid>
			<aside className="page-more" aria-label="GitHub">
				<p className="page-more__text">
					Looking for information about other projects I've worked on?{' '}
					<InlineLink to="https://github.com/jeremysampl">Visit my GitHub</InlineLink>
				</p>
			</aside>
		</section>
	);
}
