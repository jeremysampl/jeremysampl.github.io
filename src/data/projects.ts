import { TechnologyId, getTechnology, technologyIconSrc } from './technologies';

export type ProjectId =
	| 'stock-assist'
	| 'terra-exodus'
	| 'rc-tank'
	| 'blackjack'
	| 'tic-tac-toe';

/** A project can list a tech id, or attach display-only extras like a subtitle. */
export type ProjectTechnologyRef =
	| TechnologyId
	| {
			id: TechnologyId;
			subtitle?: string;
	  };

export type ProjectEntry = {
	id: ProjectId;
	/** URL segment used in routes, e.g. /projects/{slug} (must match the <Route> path in App.tsx) */
	slug: string;
	name: string;
	title: string;
	/** Path segment under /images/projects/ */
	thumbnail: string;
	/** Technologies used by this project — source of truth for project pages + skill usages */
	technologies: ProjectTechnologyRef[];
};

export type ResolvedProjectTechnology = {
	id: TechnologyId;
	name: string;
	iconSrc?: string;
	faIcon?: string;
	iconPadding?: number;
	subtitle?: string;
};

/**
 * Single source of truth for every project on the site.
 * Entries here automatically show up on the Projects page
 * and become linkable from the Tech Stack orbit (via a skill's `usages`).
 */
export const projects: ProjectEntry[] = [
	{
		id: 'stock-assist',
		slug: 'StockAssist',
		name: 'StockAssist',
		title: 'Inventory Management System',
		thumbnail: 'Inventory Manager/Home.png',
		technologies: ['java'],
	},
	{
		id: 'terra-exodus',
		slug: 'TerraExodus',
		name: 'Terra Exodus',
		title: 'CMD Console Shooter Game',
		thumbnail: 'Terra Exodus/Gameplay.png',
		technologies: ['python'],
	},
	{
		id: 'rc-tank',
		slug: 'RC-Tank',
		name: 'RC Tank',
		title: '3D-Printed Arduino Remote-Controlled Tank',
		thumbnail: 'RC Tank/Final Tank.jpg',
		technologies: ['arduino', 'app-inventor'],
	},
	{
		id: 'blackjack',
		slug: 'Blackjack',
		name: 'Blackjack',
		title: 'Casino Card Game',
		thumbnail: 'Blackjack/Lose.png',
		technologies: ['python'],
	},
	{
		id: 'tic-tac-toe',
		slug: 'TicTacToe',
		name: 'Tic Tac Toe',
		title: 'Classic Paper/Pencil Game',
		thumbnail: 'Tic Tac Toe/Gameplay.png',
		technologies: [
			{ id: 'csharp', subtitle: '60%' },
			{ id: 'xaml', subtitle: '40%' },
		],
	},
];

export function getProject(id: ProjectId): ProjectEntry {
	const project = projects.find((entry) => entry.id === id);

	if (!project) {
		throw new Error(`Unknown project id: ${id}`);
	}

	return project;
}

export function projectHref(id: ProjectId): string {
	return `/projects/${getProject(id).slug}`;
}

export function projectThumbnailSrc(id: ProjectId): string {
	return `/images/projects/${getProject(id).thumbnail}`;
}

export function projectTechnologyId(ref: ProjectTechnologyRef): TechnologyId {
	return typeof ref === 'string' ? ref : ref.id;
}

export function projectHasTechnology(project: ProjectEntry, technologyId: TechnologyId): boolean {
	return project.technologies.some((ref) => projectTechnologyId(ref) === technologyId);
}

export function resolveProjectTechnologies(project: ProjectEntry): ResolvedProjectTechnology[] {
	return project.technologies.map((ref) => {
		const id = projectTechnologyId(ref);
		const technology = getTechnology(id);
		const subtitle = typeof ref === 'string' ? undefined : ref.subtitle;

		return {
			id,
			name: technology.name,
			iconSrc: technologyIconSrc(technology),
			faIcon: technology.faIcon,
			iconPadding: technology.iconPadding,
			subtitle,
		};
	});
}
