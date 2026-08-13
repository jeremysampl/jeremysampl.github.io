import React from 'react';
import MediaCard from './MediaCard';

type ProjectSummary = {
	name: string;
	url?: string;
	image: string;
};

export default function ProjectDisplay({
	project,
	onClick,
}: {
	project: ProjectSummary;
	onClick?: (event: React.MouseEvent<HTMLElement>, el: HTMLElement) => void;
	isModal?: boolean;
}) {
	return (
		<MediaCard
			title={project.name}
			src={`/images/projects/${project.image}`}
			href={project.url ? `/projects/${project.url}` : undefined}
			onClick={onClick}
		/>
	);
}
