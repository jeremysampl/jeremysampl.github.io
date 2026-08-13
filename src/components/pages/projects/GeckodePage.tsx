import ProjectPage, { ProjectFilmstrip } from '../ProjectPage';
import { getProject } from '../../../data/projects';
import type { GalleryItem } from '../../../types/gallery';

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
			gallery={[...galleryStrip, ...organizationsStrip, ...editorsStrip, ...shareStrip, ...howItWorksStrip]}
		/>
	);
}
