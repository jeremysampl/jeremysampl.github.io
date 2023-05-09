import React from 'react';
import ProjectPage from '../ProjectPage';

export default function TerraExodusPage() {
	return (
		<ProjectPage
		project = {{ 
			name: "Terra Exodus",
			title: "CMD Console Shooter Game",
			description: 
				<p>
					Terra Exodus is a small console-based 2D plane shooter with custom ASCII art.<br/>
					It was made to show the limits of what really can be done on the console (+Windows CMD/PowerShell for controls).<br/><br/>
					The game can be broken down into two parts:<br/>
					The storyline in which the player makes choices which slightly modify the gameplay at the end.<br/>The game itself.<br/><br/>
					The storyline allows the player to choose their planet, enemy, plane and weapon type.<br/><br/>
					The gameplay is simple: Once the game begins, the player must defeat all enemies. If the player's health reaches 0, they lose.<br/><br/>
					*DISCLAIMER*<br/>This game may cause some players to become nauseous due to the way the screen is updated.
				</p>
		}}
		overview = {{
			box1: {
			title: "Controls",
			icon: "keyboard-o",
			description: "Uses the keyboard to control the plane."
			},
			box2: {
			title: "Collisions",
			icon: "bullseye",
			description: "Objects have hitboxes, allowing for them to interact with each other."
			},
			box3: {
			title: "Storyline",
			icon: "image",
			description: "Contains a storyline which modifies the gameplay depending on the user's decisions."
			}
		}}
		languages = {{
			languageCount: 1,
			l1: {
			name: "Python",
			icon: "Python.png",
			percent: "100"
			}
		}}
		gallery = {{
			image1: {
			title: "Choices",
			path: "Terra Exodus/Choices.png",
			description: `This is an example of the choices that the player has to make as they are making their way through the storyline.
				This allows a little bit of customizability to the end gameplay.`
			},
			image2: {
			title: "Gameplay",
			path: "Terra Exodus/Gameplay2.png",
			description: `The player's mission is to shoot down all the enemies while avoiding the bombs that they drop
				in order to successfully defend against the enemies.`
			},
			image3: {
			title: "Gameplay",
			path: "Terra Exodus/Gameplay3.png",
			description: `Cross-mapping a display screen over another keeping track of collision zones allows for collisions between objects to take place.
				In this case the missile is about to collide with the enemy plane.`
			},
			image4: {
			title: "Gameplay",
			path: "Terra Exodus/Gameplay.png",
			description: `The player must avoid getting hit by bombs dropped by the enemies. If they get hit too many times, they could lose the game.`
			},
			image5: {
			title: "Welcome Screen",
			path: "Terra Exodus/Welcome.png",
			description: `This is the displayed welcome screen to the player when the game is started.
				The user is able to adjust the size of the canvas of the game in order to fit their needs.`
			},
			image6: {
			title: "Storyline",
			path: "Terra Exodus/Storyline.png",
			description: `This is an example of the type of storyline that is found in this game.`
			}
		}}
		github = {{
			repository: "ascii-shooter"
		}}
		/>
	);
}