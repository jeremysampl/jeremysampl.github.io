import { TechnologyId, getTechnology, technologyIconSrc } from './technologies';

export type ProjectId =
	| 'geckode'
	| 'stock-assist'
	| 'terra-exodus'
	| 'rc-tank'
	| 'blackjack'
	| 'tic-tac-toe';

/** Tech id, or a tech id plus a subtitle shown on the project page. */
export type ProjectTechnologyRef =
	| TechnologyId
	| {
			id: TechnologyId;
			subtitle?: string;
	  };

export type ProjectEntry = {
	id: ProjectId;
	/** Used in /projects/{slug} */
	slug: string;
	name: string;
	title: string;
	/** Relative to /images/projects/ */
	thumbnail: string;
	technologies: ProjectTechnologyRef[];
	/** Repo name under jeremysampl/, or a full URL */
	github?: string;
	website?: string;
};

export type ResolvedProjectTechnology = {
	id: TechnologyId;
	name: string;
	iconSrc?: string;
	faIcon?: string;
	iconPadding?: number;
	subtitle?: string;
};

/** Projects listed on the site. Also used by the tech stack wheel. */
export const projects: ProjectEntry[] = [
	{
		id: 'geckode',
		slug: 'Geckode',
		name: 'Geckode',
		title: 'Multi-User Block Coding Platform',
		thumbnail: 'Geckode/Platformer Game.png',
		technologies: ['nodejs', 'nextjs', 'react', 'html', 'css', 'tailwindcss', 'typescript', 'rest-apis', 'django', 'python', 'postgresql', 'redis', 'docker', 'phaser', 'websocket', 'yjs'],
		website: 'https://geckode.ca/playground-editor',
	},
	{
		id: 'terra-exodus',
		slug: 'TerraExodus',
		name: 'Terra Exodus',
		title: 'CMD Console Shooter Game',
		thumbnail: 'Terra Exodus/Gameplay.png',
		technologies: ['python'],
		github: 'ascii-shooter',
	},
	{
		id: 'stock-assist',
		slug: 'StockAssist',
		name: 'StockAssist',
		title: 'Inventory Management System',
		thumbnail: 'Inventory Manager/Home.png',
		technologies: ['java'],
		github: 'inventory-system',
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
		github: 'blackjack',
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
		github: 'tictactoe',
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

export function projectGithubUrl(github: string): string {
	if (/^https?:\/\//i.test(github)) return github;
	return `https://github.com/jeremysampl/${github}`;
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
