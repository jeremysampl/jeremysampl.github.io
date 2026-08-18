import ProjectPage, { ProjectFilmstrip, type TechnologyItem } from '../ProjectPage';
import { getProject } from '../../../data/projects';
import type { GalleryItem } from '../../../types/gallery';

const technologies: TechnologyItem[] = [
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
				description: 'Inline styling for rapid development..',
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
		id: 'docker',
		featured: true,
		description: 'Local and deployed stacks for the web app, backend APIs, database, and Redis in one compose setup.',
	},
	
];

const platformerGame: GalleryItem = {
	title: 'Platformer game',
	path: 'geckode/platformer-game.png',
	description: 'A simple platformer game built with Geckode.',
};

const loginStrip: GalleryItem[] = [
	{
		title: 'Register',
		path: 'geckode/register.png',
		description: 'The form to register an account with Geckode.',
	},
	{
		title: 'Login',
		path: 'geckode/login.png',
		description: 'The form to login to an existing Geckode account.',
	},
];

const projectsStrip: GalleryItem[] = [
	{
		title: 'Projects table',
		path: 'geckode/projects-table.png',
		description: 'The projects page allows you to manage your projects and view other users\' projects.',
	},
	{
		title: 'Project filtering',
		path: 'geckode/filter-projects.png',
		description: 'Fine-tuned filters allow users to quickly find the projects they are looking for or discover new ones.',
	},
	{
		title: 'Project creation',
		path: 'geckode/create-project.png',
		description: 'The project creation modal allows you to create a new project with a name and thumbnail.',
	},
	{
		title: 'Project details',
		path: 'geckode/project-details.png',
		description: 'View and modify project details all in one place.'
	}
];

const editorsStrip: GalleryItem[] = [
    {
        title: 'Sprite editor',
        path: 'geckode/sprite-editor.png',
        description: 'The sprite editor allows users to create and edit sprites for their projects.',
    },
    {
        title: 'Tilemap editor',
        path: 'geckode/tilemap-editor.png',
        description: 'The tilemap editor allows users to create and edit the worlds in their games.',
    },
    {
        title: 'Tileset editor',
        path: 'geckode/tileset-editor.png',
        description: 'The tileset editor allows users to create and edit the tilesets to speed up and organize tilemap editing.',
    },
    {
        title: 'Tile editor',
        path: 'geckode/tile-editor.png',
        description: 'The tile editor allows users to create and edit the tiles for their tilesets.',
    },
];

const shareStrip: GalleryItem[] = [
    {
        title: 'User sharing',
        path: 'geckode/share-project-users.png',
        description: 'Projects can be shared with other users, allowing them to edit or simply view your projects.',
    },
	{
		title: 'Organization sharing',
		path: 'geckode/share-project-organizations.png',
		description: `Projects can be shared with organizations, providing an easy way to give the same access to a specific group of users,
			such as a classroom or team.`,
	},
	{
		title: 'Link sharing',
		path: 'geckode/share-project-links.png',
		description: 'Projects can be shared with a link, allowing anyone with the link to play the game without needing to create an account.',
	},
	{
		title: 'Shared game',
		path: 'geckode/shared-game.png',
		description: 'A game being played from a shared link. This also provides the ability for games to be versioned.'
	},
];

const organizationsStrip: GalleryItem[] = [
	{
		title: 'Organizations',
		path: 'geckode/organization-projects.png',
		description: 'Organizations can be used to quickly create, manage and share projects among a group of users, such as a classroom or team.',
	},
    // TODO: Add organization members
    // TODO: Add organization permissions
];

const howItWorksStrip: GalleryItem[] = [
    {
        title: 'How it works',
        path: 'geckode/functionality-diagram.png',
        description: 'A diagram of Geckode\'s core services and how they interact with each other.',
    },
];

const demoVideo: GalleryItem = {
	title: 'Demo video',
	path: 'geckode/geckode-demo.mp4',
	description: 'The original demo video of Geckode showcased at the end of the capstone course.',
};

export default function GeckodePage() {
	const project = getProject('geckode');

	return (
		<ProjectPage
			projectId={project.id}
			project={{
				name: project.name,
				title: project.title,
				description: (
					<>
						<h2>Overview</h2>
						<p>
                            Geckode is a web-based block coding platform designed to make programming intuitive for
                            beginners while providing powerful tools for experienced developers. Unique features such
                            as a true physics engine, real-time collaboration, and new blocks that condense complex game
                            logic into a single block give Geckode significant advantages over platforms like Scratch and
                            MakeCode.
						</p>

						<h2>Accounts</h2>

						<h3>Register/Login</h3>
						<p>
							Prospective users can easily create an account using an email or a Google account. Existing users
							can use the same method to login:
						</p>
						<ProjectFilmstrip media={loginStrip} aspectRatio={[3, 3.6]} />
						
						<h3>Project Management</h3>
						<p>
							Users have access to projects, in which they can create, manage, and view them straight from the projects page:
						</p>
						<ProjectFilmstrip media={projectsStrip} aspectRatio={[3, 4]} maxPerRow={2} />

						<h2>Projects</h2>

						<h3>Editor</h3>
						<p>
							Projects can be developed using the editor, which provides a suite of tools for creating and editing games:
						</p>
						<ProjectFilmstrip media={[platformerGame, ...editorsStrip]} />

						<h3>Sharing</h3>
						<p>
							Projects can be shared with other users, allowing them to edit or simply view your projects. Sharing can be done
							with individual users, such as friends or colleagues, or with organizations, such as a classroom or team:
						</p>
						<ProjectFilmstrip media={shareStrip} maxPerRow={2} />

						<h3>Organizations</h3>
						<p>
							Organizations can be used to quickly create, manage and share projects among a group of users, such as a classroom
							or team:
						</p>
						<ProjectFilmstrip media={organizationsStrip} />
					</>
                    // TODO: Add details about the physics engine, the real-time collaboration, and how they work
				),
			}}
			overview={{
				boxes: [
					{
						title: 'Simplified block coding',
						icon: 'code',
						description: 'Programmers of any level can easily build programs by snapping blocks together.',
					},
					{
						title: 'Multi-user collaboration',
						icon: 'users',
						description: 'Real-time collaboration on projects between users.',
					},
					{
						title: 'Real physics engine',
						icon: 'gear',
						description: 'A custom-built physics engine that enables the rapid development of interactive games.',
					},
				],
			}}
			technologies={technologies}
			siteIconSrc="/images/projects/geckode/geckode-icon.png"
			siteIconAlt="Geckode"
			gallery={[platformerGame, ...editorsStrip, ...shareStrip, ...organizationsStrip, ...howItWorksStrip, demoVideo, ...projectsStrip, ...loginStrip]}
		/>
	);
}
