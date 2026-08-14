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
		description: 'Local and deployed stacks for the web app, backend APIs, database, and Redis in one compose setup.',
	},
	
];

const galleryStrip: GalleryItem[] = [
	{
		title: 'Platformer Game',
		path: 'Geckode/Platformer Game.png',
		description: 'A simple platformer game built with Geckode.',
	},
];

const editorsStrip: GalleryItem[] = [
    {
        title: 'Sprite Editor',
        path: 'Geckode/Sprite Editor.png',
        description: 'The sprite editor allows you to create and edit sprites for your projects.',
    },
    {
        title: 'Tilemap Editor',
        path: 'Geckode/Tilemap Editor.png',
        description: 'The tilemap editor allows you to create and edit the worlds in your games.',
    },
    {
        title: 'Tileset Editor',
        path: 'Geckode/Tileset Editor.png',
        description: 'The tileset editor allows you to create and edit the tilesets to speed up and organize tilemap editing.',
    },
    {
        title: 'Tile Editor',
        path: 'Geckode/Tile Editor.png',
        description: 'The tile editor allows you to create and edit the tiles for your tilesets.',
    },
];

const shareStrip: GalleryItem[] = [
    {
        title: 'Project Sharing',
        path: 'Geckode/Share Project Users.png',
        description: 'You can share your projects with other users, allowing them to edit or simply view your projects.',
    },
    // TODO: Add project sharing with organizations
    // TODO: Add public game sharing
];

const organizationsStrip: GalleryItem[] = [
	{
		title: 'Organizations',
		path: 'Geckode/Organization Projects.png',
		description: 'Organizations can be used to quickly create, manage and share projects among a group of users, such as a classroom or team.',
	},
    // TODO: Add organization members
    // TODO: Add organization permissions
];

const howItWorksStrip: GalleryItem[] = [
    {
        title: 'How It Works',
        path: 'Geckode/Functionality Diagram.png',
        description: 'A diagram of Geckode\'s core services and how they interact with each other.',
    },
];

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
						<p className="project-card__intro">
                            Geckode is a web-based block coding platform designed to make programming intuitive for
                            beginners while providing powerful tools for experienced developers. Unique features such
                            as a true physics engine, real-time collaboration, and new blocks that condense complex game
                            logic into a single block give Geckode significant advantages over platforms like Scratch and
                            MakeCode.
						</p>
                        <h3>Customization</h3>
						<ul className="project-card__points">
							<li>
								There is plenty of customization available through editors:
								<ProjectFilmstrip media={editorsStrip} />
							</li>
						</ul>
					</>
                    // TODO: Add more information about Geckode's features and how it works
				),
			}}
			overview={{
				boxes: [
					{
						title: 'Simplified Block Coding',
						icon: 'code',
						description: 'Programmers of any level can easily build programs by snapping blocks together.',
					},
					{
						title: 'Multi-User Collaboration',
						icon: 'users',
						description: 'Real-time collaboration on projects between users.',
					},
					{
						title: 'Real Physics Engine',
						icon: 'gear',
						description: 'A custom-built physics engine that enables the rapid development of interactive games.',
					},
				],
			}}
			technologies={technologies}
			siteIconSrc="/images/projects/Geckode/Geckode Icon.png"
			siteIconAlt="Geckode"
			gallery={[...galleryStrip, ...organizationsStrip, ...editorsStrip, ...shareStrip, ...howItWorksStrip]}
		/>
	);
}
