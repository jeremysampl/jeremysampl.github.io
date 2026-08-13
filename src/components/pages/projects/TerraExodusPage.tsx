import ProjectPage from '../ProjectPage';
import { getProject } from '../../../data/projects';

export default function TerraExodusPage() {
	const project = getProject('terra-exodus');

	return (
		<ProjectPage
			projectId={project.id}
			project={{
				name: project.name,
				title: project.title,
				intro:
					'Terra Exodus is a small console-based 2D plane shooter with custom ASCII art. It was made to show the limits of what really can be done on the console (+Windows CMD/PowerShell for controls).',
				points: [
					'The game can be broken down into two parts: the storyline (where the player makes choices which slightly modify the gameplay at the end), and the game itself.',
					'The storyline allows the player to choose their planet, enemy, plane and weapon type.',
					'The gameplay is simple: once the game begins, the player must defeat all enemies. If the player\'s health reaches 0, they lose.',
					'*DISCLAIMER* This game may cause some players to become nauseous due to the way the screen is updated.',
				],
			}}
			overview={{
				boxes: [
					{
						title: 'Controls',
						icon: 'keyboard-o',
						description: 'Uses the keyboard to control the plane.',
					},
					{
						title: 'Collisions',
						icon: 'bullseye',
						description: 'Objects have hitboxes, allowing for them to interact with each other.',
					},
					{
						title: 'Storyline',
						icon: 'image',
						description: 'Contains a storyline which modifies the gameplay depending on the user\'s decisions.',
					},
				],
			}}
			gallery={[
				{
					title: 'Choices',
					path: 'Terra Exodus/Choices.png',
					description: `This is an example of the choices that the player has to make as they are making their way through the storyline.
						This allows a little bit of customizability to the end gameplay.`,
				},
				{
					title: 'Gameplay',
					path: 'Terra Exodus/Gameplay2.png',
					description: `The player's mission is to shoot down all the enemies while avoiding the bombs that they drop
						in order to successfully defend against the enemies.`,
				},
				{
					title: 'Gameplay',
					path: 'Terra Exodus/Gameplay3.png',
					description: `Cross-mapping a display screen over another keeping track of collision zones allows for collisions between objects to take place.
						In this case the missile is about to collide with the enemy plane.`,
				},
				{
					title: 'Gameplay',
					path: 'Terra Exodus/Gameplay.png',
					description: `The player must avoid getting hit by bombs dropped by the enemies. If they get hit too many times, they could lose the game.`,
				},
				{
					title: 'Welcome Screen',
					path: 'Terra Exodus/Welcome.png',
					description: `This is the displayed welcome screen to the player when the game is started.
						The user is able to adjust the size of the canvas of the game in order to fit their needs.`,
				},
				{
					title: 'Storyline',
					path: 'Terra Exodus/Storyline.png',
					description: `This is an example of the type of storyline that is found in this game.`,
				},
			]}
		/>
	);
}
