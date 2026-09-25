import { type TechnologyId, getTechnology, technologyIconSrc, type TechnologyItem } from './technologies';

export type ProjectId =
	| 'geckode'
	| 'smb-media-viewer'
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
	/** Canonical URL segment for /projects/{slug} (kebab-case) */
	slug: string;
	/** Former URL segments that should redirect to the canonical slug */
	legacySlugs?: string[];
	name: string;
	title: string;
	/** Relative to /images/projects/ */
	thumbnail: string;
	technologies: TechnologyItem[];
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
		slug: 'geckode',
		legacySlugs: ['Geckode'],
		name: 'Geckode',
		title: 'Multi-user block coding platform',
		thumbnail: 'geckode/platformer-game.png',
		technologies: [
			{
				id: 'nextjs',
				featured: true,
				description: 'App router, API routes, and useful server-side rendering features.',
			},
			{
				id: 'react',
				featured: true,
				description: 'Frontend framework for the Geckode editor and website.',
				children: [
					{
						id: 'typescript',
						description: `Used instead of plain JavaScript for its strongly typed models,
							helping prevent unnecessary bugs and improve code readability.`,
					},
					{
						id: 'html',
					},
					{
						id: 'css',
					},
					{
						id: 'tailwindcss',
						description: 'Inline styling for rapid development.',
					},
				],
			},
			{
				id: 'blockly',
				description: 'Google\'s open-source block-based programming library used to create the Geckode editor.',
			},
			{
				id: 'phaser',
				description: `2D physics engine highly tailored for the Geckode editor. Custom JavaScript code generation from
					Blockly blocks carefully combine with sprite parameters from React to create complex Phaser game logic, such as
					sprite movement, object collisions, gravity, and much more.`,
			},
			{
				id: 'yjs',
				featured: true,
				description: `Used for its conflict-free replicated data types (CRDTs), which allow multiple users to work on the
					same project simultaneously without conflicts. Paired with hand-crafted custom merging logic to enable full
					offline editing capabilities, avoiding data corruption such as circular references.`,
			},
			{
				id: 'django',
				featured: true,
				description: `Main backend APIs for the app, handling user accounts, organizations, project storage, permissions,
					and more.`,
				children: [
					{
						id: 'python',
					},
					{
						id: 'rest-apis',
						description: 'Used the Django REST Framework to create structured API responses and validation.',
					},
					{
						id: 'postgresql',
						description: 'Primary datastore for users, organizations, and project metadata.',
					},
				],
			},
			{
				id: 'nodejs',
				featured: true,
				description: `WebSocket server to rapidly sync real-time changes between project collaborators, checking
					necessary permissions, sending essential updates to each connected client, and ensuring data consistency.`,
				children: [
					{
						id: 'websocket',
						description: `Live project-specific channels that ferry Yjs updates between collaborators, including
							connected user information and project state updates.`,
					},
				],
			},
			{
				id: 'redis',
				featured: true,
				description: `Extremely fast in-memory datastore for the bidirectional transport of data between the Django backend
					(single source of truth) and the WebSocket server to update connected clients about data changes from sources
					outside the scope of the WebSocket connection as well as funnel validated updates from clients to the backend
					for processing and storage, avoiding costly API calls and ensuring data integrity at all times.`,
			},
			{
				id: 'zustand',
				featured: true,
				description: `State management library for the web app. Synchronizes some state with Yjs to enable real-time
					collaboration.`,
			},
			{
				id: 'docker',
				featured: true,
				description: 'Local and deployed stacks for the web app, backend APIs, database, and Redis in one compose setup.',
			},
			{
				id: 'nginx',
				description: 'Reverse proxy for routing requests to the appropriate services.',
			},
			{
				id: 'linux',
				description: 'Configured server for hosting the application.',
			},
			{
				id: 'jwt',
				description: 'Tokens used for authentication and authorization of users on the WebSocket server.',
			},
			{
				id: 'cicd',
				description: 'GitHub Actions pipeline for automated testing and deployment of the web app and backend services.',
			},
			{
				id: 'playwright',
				description: `Used for end-to-end testing typical user flows and edge cases. Tests are run automatically before
					each deployment to ensure the frontend React components and the overall application are working as intended.`,
			},
			{
				id: 'vitest',
				description: `Used for unit testing the web app. Tests are run automatically before each deployment to ensure the
					frontend React components and the overall application are working as intended.`,
			},
			{
				id: 'pytest',
				description: `Used for extensive testing of the backend Django server. All tests are run automatically before each
					deployment to ensure the application is working as expected and catch any regressions.`,
			},
		],
		website: 'https://geckode.ca/playground-editor',
	},
	{
		id: 'smb-media-viewer',
		slug: 'smb-media-viewer',
		name: 'SMB Media Viewer',
		title: 'Media viewer for SMB shares',
		thumbnail: 'smb-media-viewer/desktop-gallery.png',
		technologies: [
			{
				id: 'react',
				featured: true,
				description: 'Frontend for browsing shares, viewing media, and managing cast slideshows.',
				children: [
					{ id: 'typescript' },
					{ id: 'html' },
					{ id: 'css' },
				],
			},
			{
				id: 'nodejs',
				featured: true,
				description: 'Backend for authentication, indexing, thumbnails, video transcoding, serving media, and cast support.',
				children: [
					{
					id: 'express',
					description: 'Fast and lightweight HTTP API for login, browse, media streaming, admin, downloads, and casting.',
					},
				],
			},
			{
				id: 'sqlite',
				description: `Local databases for the media index and cache metadata (capture time, duration, thumb keys, open
					counts, etc.).`,
			},
			{
				id: 'docker',
				featured: true,
				description: `Compose setup for the frontend and backend images, so the app can run locally or on a server with one
					stack.`,
			},
			{
				id: 'nginx',
				description: 'Serves the built frontend in production and proxies API requests to the backend.',
			},
			{
				id: 'sharp',
				description: 'Image processing for thumbnails and quality tiers, so media loads faster and uses less bandwidth.',
			},
			{
				id: 'ffmpeg',
				description: 'Video posters, remuxing, and transcoding for browser compatibility and lower-bandwidth quality tiers.',
			},
			{
				id: 'jwt',
				description: 'Signed session cookies and media/cast URL tokens for authentication without exposing filesystem paths.',
			},
		],
		github: 'smb-media-viewer',
	},
	{
		id: 'terra-exodus',
		slug: 'terra-exodus',
		legacySlugs: ['TerraExodus'],
		name: 'Terra Exodus',
		title: 'Console-based shooter game',
		thumbnail: 'terra-exodus/gameplay.png',
		technologies: [{ id: 'python' }],
		github: 'ascii-shooter',
	},
	{
		id: 'stock-assist',
		slug: 'stock-assist',
		legacySlugs: ['StockAssist'],
		name: 'StockAssist',
		title: 'Inventory management system',
		thumbnail: 'inventory-manager/home.png',
		technologies: [{ id: 'java' }],
		github: 'inventory-system',
	},
	{
		id: 'rc-tank',
		slug: 'rc-tank',
		legacySlugs: ['RC-Tank'],
		name: 'RC Tank',
		title: '3D-printed Arduino remote-controlled tank',
		thumbnail: 'rc-tank/final-tank.jpg',
		technologies: [{ id: 'arduino' }, { id: 'app-inventor' }],
	},
	{
		id: 'blackjack',
		slug: 'blackjack',
		legacySlugs: ['Blackjack'],
		name: 'Blackjack',
		title: 'Casino card game',
		thumbnail: 'blackjack/lose.png',
		technologies: [{ id: 'python' }],
		github: 'blackjack',
	},
	{
		id: 'tic-tac-toe',
		slug: 'tic-tac-toe',
		legacySlugs: ['TicTacToe'],
		name: 'Tic Tac Toe',
		title: 'Classic paper/pencil game',
		thumbnail: 'tic-tac-toe/gameplay.png',
		technologies: [ { id: 'csharp' }, { id: 'xaml' } ],
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

export function getProjectBySlug(slug: string): ProjectEntry | undefined {
	return projects.find((entry) => entry.slug === slug);
}

/** Resolve a URL slug to a project, including legacy slugs that should redirect. */
export function resolveProjectFromSlug(
	slug: string
): { project: ProjectEntry; isLegacy: boolean } | undefined {
	const current = getProjectBySlug(slug);
	if (current) {
		return { project: current, isLegacy: false };
	}

	const legacy = projects.find((entry) => entry.legacySlugs?.includes(slug));
	if (legacy) {
		return { project: legacy, isLegacy: true };
	}

	return undefined;
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
