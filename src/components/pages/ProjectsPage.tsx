import React from 'react';
import ProjectDisplay from '../containers/ProjectDisplay';
import Row from "../containers/Row";
import { projects } from '../../data/projects';

function chunk<T>(items: T[], size: number): T[][] {
	const rows: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		rows.push(items.slice(i, i + size));
	}
	return rows;
}

export default function ProjectsPage() {
	return (
		<>
			<section className="project-showcase section">
				<h1>My Projects</h1>
				<p>Click on any project for more information.</p>

				{chunk(projects, 2).map((row) => (
					<Row key={row.map((project) => project.id).join('-')}>
						{row.map((project) => (
							<ProjectDisplay
								key={project.id}
								isModal={false}
								project={{ name: project.name, url: project.slug, image: project.thumbnail }}
							/>
						))}
					</Row>
				))}

				<h3>More projects are currently being worked on!</h3>
			</section>
		</>
	);
}
