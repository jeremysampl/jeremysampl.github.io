import ProjectPage, { ProjectFilmstrip } from '../ProjectPage';
import { getProject } from '../../../data/projects';
import type { GalleryItem } from '../../../types/gallery';

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

						<h3>My Role in the Project</h3>
						<p>
							Geckode was developed as a final-year capstone project in collaboration with 4 other students.
							As backend lead, I was responsible for designing and implementing the core backend functionality of the platform,
							including the APIs, authentication system, database schema, project storage, project sharing, real-time collaboration,
							and much more.
							This involved making design decisions about all aspects of the backend, from the technologies used to the
							manner in which they communicate with each other. However, I also significantly contributed to the frontend,
							including creating reusable React components and pages for the platform, as well as collaborating with the other team
							members to implement compatible project state management and synchronization with the backend.
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
						<ProjectFilmstrip media={[platformerGame, ...editorsStrip]} maxPerRow={2} aspectRatio={1} />

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
						<ProjectFilmstrip media={organizationsStrip} aspectRatio={[17, 9]} />

						<h2>Demo Video</h2>

						<p>
							Here is the original demo video of Geckode showcased at the end of the capstone course:
						</p>

						<ProjectFilmstrip media={[demoVideo]} aspectRatio={[16, 9]} />

						<h2>Underlying Implementation</h2>
						<ProjectFilmstrip media={howItWorksStrip} aspectRatio={[5, 3.5]} />

						<h3>Frontend</h3>

						<h4>React (Next.js) & TypeScript</h4>
						<p>
							Arguably the most important part of the project, the frontend was built using{' '}
							<span className="bold">React (Next.js)</span> and{' '}
							<span className="bold">TypeScript</span>.
							React was chosen for its ability to create reusable components and pages, while TypeScript was chosen for its
							strong type system to help avoid runtime errors and improve code readability.
						</p>

						<h4>Blockly</h4>
						<p>
							Blocks are the core of the platform, and are used to create the games. Therefore, we needed a sophisticated block editor.
							After researching the options, we settled on <span className="bold">Blockly</span>, an
							open-source block editor developed by Google. Blockly is a powerful tool that allowed us to create a block editor that
							is both easy to use and powerful enough to handle the complex logic of the games. We could have built our own block
							editor, but Blockly was the most mature and well-supported option, and, in fact, it is used by most existing block
							coding platforms like Scratch and MakeCode due to these reasons.
						</p>

						<h4>Zustand</h4>
						<p>
							As with any other block coding platform, we needed a way to easily manage the state of the projects, including sprites.
							To accomplish this, we used <span className="bold">Zustand</span>, a lightweight state management library
							for React. Zustand was chosen for its simplicity and ease of use, as well as its performance and scalability.
							It also allowed us to dynamically tie sprite states to blocks, allowing for a seamless and responsive experience.
							Furthermore, Zustand allowed us to easily implement real-time collaboration by accessing and sharing the state of
							projects outside of React's component tree, allowing for a more efficient and scalable implementation (more on this later).
						</p>

						<h4>Phaser</h4>
						<p>
							Once we introduced blocks and sprites into the project, we needed a way to render them and to handle the logic of the games.
							Existing platforms like Scratch and MakeCode use a custom rendering engine, but we wanted to differentiate ourselves
							by using a real physics engine to handle the movement and interactions of the games.
							We looked into building our own physics engine from scratch, but it would have taken a significant amount of time and
							effort, and it would have diverted our focus away from the core features of the platform so we decided to use{' '}
							<span className="bold">Phaser</span>, an open-source game physics framework.
							With complex custom logic, we synchronized the sprites and their respective blocks to the Phaser game canvas, enabling
							real-time rendering and interaction of the games, including sprite movement, collisions, and tilemap .
						</p>

						<h3>Backend</h3>

						<h4>Django</h4>
						<p>
							For the backend, we used <span className="bold">Django</span>, a powerful web framework for Python.
							Django was chosen for its powerful features, such as its ORM, its built-in admin interface, and its
							built-in authentication system.
							The <span className="bold">Django REST Framework</span> enabled us to easily create standardized RESTful APIs, streamlining
							the development process and allowing for a more efficient and scalable implementation.
						</p>

						<h4>PostgreSQL</h4>
						<p>
							For persistent data storage, we used the de facto standard for production Django projects,{' '}
							<span className="bold">PostgreSQL</span>.
							It is reliable, fast, and managed directly by Django, allowing for a seamless and efficient data storage solution.
						</p>

						<h3>Real-time Collaboration Layer</h3>

						<h4>Yjs</h4>
						<p>
							To implement real-time collaboration, I decided to use <span className="bold">Yjs</span>, an open-source CRDT (Conflict-free
							Replicated Data Type) library that synchronizes a shared document and automatically handles merge conflicts deterministically.
							Yjs was chosen for its ability to handle the complex state management of the projects, including sprites and tilemaps,
							as well as its performance and scalability.
						</p>
						<p>
							State for any given project is stored in a single shared Yjs document via{' '}
							Yjs-specific shared types, such as Array and Map, and any changes made to those shared types are automatically merged and
							synchronized by Yjs. Custom-made algorithms that I designed and implemented listen for the changes and update local Blockly,
							Phaser, and Zustand state accordingly via their respective APIs, ensuring that different users see the same updates in
							real-time.
						</p>

						<h4>Node.js</h4>
						<p>
							A shared Yjs document needs to be synced to all connected clients in real-time. To accomplish this, I engineered a custom{' '}
							<span className="bold">Node.js</span> WebSocket server that listens for changes to the Yjs document and broadcasts them to all
							connected clients. Node.js was chosen instead of attempting to use Django Channels due to the fact that Yjs runs natively
							in JavaScript and Node.js is a mature and well-supported runtime environment for this purpose.
							Furthermore, separating the synchronization logic from the backend allows for a more modular and scalable implementation,
							ensuring that the backend can focus on its core responsibilities of handling requests and responses, while the Node.js server
							can focus on synchronizing the Yjs document to all connected clients in real-time.
						</p>
						<p>
							When a client initially opens a project, it connects to the WebSocket server and requests the latest state of the Yjs document.
							To authenticate, the client sends its JWT token to the server, which is then verified via an API call to the Django backend.
							This API call obtains the stored Yjs document if it was not already loaded on the WebSocket server, as well as the client's
							permissions for the project and other important information about the user.
							Once authenticated, the client receives the latest state of the Yjs document and begins listening for changes.
							Depending on the client's permissions, the WebSocket server will either allow the client to make changes to the Yjs document,
							or will only allow the client to view the project.
						</p>

						<h4>Redis</h4>
						<p>
							Large amounts of API calls can be very taxing on the backend, especially when they are all happening simultaneously.
							In order to enable automatic project saving, I decided to use <span className="bold">Redis</span>, an in-memory data store
							that is capable of acting both as a cache and a message broker, allowing for a more efficient and scalable implementation.
						</p>
						<p>
							As a replacement for API calls, upon a debounced project save event, the Node.js server stores the latest state of the Yjs
							document in Redis and sets a flag that the project is queued for saving.
							Django listens for these changes in the Redis store and updates the project in the database accordingly, signaling to the
							Node.js server that the project has been saved via the same flag. Throughout this process, the Node.js server broadcasts
							saving state updates to all connected clients, ensuring that users can be certain that the project has been saved.
						</p>
						<p>
							Another important use case for Redis is to store information about each connected client.
							This is extremely useful for the Django backend to track which clients are connected to which projects in real-time,
							enabling any external changes, such as project updates (name, description, thumbnail, collaborators, etc.) via API calls,
							to be broadcast to the appropriate clients so that they can be immediately reflected in the UI. This also ensures that
							user permissions (or lack thereof) are updated in real-time, giving or taking away users' abilities to view, edit, or share
							the project instantly without forcing them to refresh the page.
						</p>
					</>
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
			technologies={project.technologies}
			siteIconSrc="/images/projects/geckode/geckode-icon.png"
			siteIconAlt="Geckode"
			gallery={[platformerGame, ...editorsStrip, ...shareStrip, ...organizationsStrip, ...howItWorksStrip, demoVideo, ...projectsStrip, ...loginStrip]}
		/>
	);
}
