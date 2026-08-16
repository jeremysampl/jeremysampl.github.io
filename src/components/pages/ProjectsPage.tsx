import React from 'react';
import MediaCard, { MediaCardGrid } from '../containers/MediaCard';
import { projects, projectHref, projectThumbnailSrc } from '../../data/projects';

export default function ProjectsPage() {
	return (
		<section className="project-showcase section">
			<h1>My Projects</h1>
			<p>Click on any project for more information.</p>

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
		</section>
	);
}
