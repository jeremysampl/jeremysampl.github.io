import React, { type ReactNode } from 'react';
import '../../styles/project.css';
import ProjectMediaGrid, { type GalleryItem } from '../containers/ProjectMediaGrid';
import InfoCardGrid, { type InfoCardItem } from '../containers/InfoCardGrid';
import TechnologyChips from '../containers/TechnologyChips';
import ProjectLinks from '../containers/ProjectLinks';
import type { LanguageDisplayItem } from '../containers/LanguageDisplay';
import { ProjectId, getProject, resolveProjectTechnologies } from '../../data/projects';

type ProjectDetails = {
	name: string;
	title: string;
	description: ReactNode;
};

type ProjectOverview = {
	boxes: InfoCardItem[];
};

export default function ProjectPage({
	projectId,
	project,
	overview,
	languages,
	gallery,
	github,
	website,
}: {
	projectId?: ProjectId;
	project: ProjectDetails;
	overview: ProjectOverview;
	languages?: LanguageDisplayItem[];
	gallery: GalleryItem[];
	github?: string;
	website?: string;
}) {
	const listed = projectId ? getProject(projectId) : null;
	const resolvedLanguages =
		languages ??
		(listed
			? resolveProjectTechnologies(listed).map((technology) => ({
					name: technology.name,
					iconSrc: technology.iconSrc,
					faIcon: technology.faIcon,
					iconPadding: technology.iconPadding,
					subtitle: technology.subtitle,
				}))
			: []);

	return (
		<section className="section project-page">
			<header className="project-page__header">
				<h1 className="project-page__name">{project.name}</h1>
				<p className="project-page__tagline">{project.title}</p>
				<ProjectLinks github={github ?? listed?.github} website={website ?? listed?.website} />
				{resolvedLanguages.length ? (
					<TechnologyChips technologies={resolvedLanguages} />
				) : null}
			</header>

			<section className="project-page__overview">
				<h2 className="project-page__heading">Overview</h2>
				<InfoCardGrid items={overview.boxes} />
			</section>

			<section className="project-page__description">
				<h2 className="project-page__heading">About this project</h2>
				<div className="project-prose">{project.description}</div>
			</section>

			{gallery.length ? (
				<section className="project-page__media">
					<h2 className="project-page__heading">Gallery</h2>
					<p className="project-page__media-hint">
						Click any item to open it full screen. Use arrows or swipe to browse photos and
						videos together.
					</p>
					<ProjectMediaGrid media={gallery} />
				</section>
			) : null}
		</section>
	);
}
