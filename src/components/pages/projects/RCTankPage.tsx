import ProjectPage from '../ProjectPage';
import { getProject } from '../../../data/projects';

export default function RCTankPage() {
	const project = getProject('rc-tank');

	return (
		<ProjectPage
			projectId={project.id}
			project={{
				name: project.name,
				title: project.title,
				intro:
					'This was my final project for my grade 12 computer engineering class, in collaboration with two other classmates.',
				points: [
					'During this project, we looked into many different applications of Arduino boards and we eventually settled on making a remote-controlled vehicle.',
					'We knew that this project was very ambitious, but with three very dedicated students, we persevered.',
					'We admittedly had a lot of difficulty at first when trying to make the Bluetooth module work as intended, but we eventually successfully achieved proper functionality and the bytes were being received as required.',
					'Using reserved ranges of bytes, we were able to smoothly control the tank\'s speed with a slider in our very own custom-made Android app. Following this breakthrough, later on, we also added the ability to turn the tank itself, as well as its muzzle.',
					'We then 3D-printed our own custom-made chassis and installed the necessary components.',
					'Eventually, we also engineered a motor-controlled valve to shoot harmless projectiles using carbon dioxide as a propellant.',
					'Finally, we added a range sensor at the end of the muzzle and implemented algorithms that, at the press of a button on the app, enables the tank to enter a mode that automatically scans for nearby objects.',
				],
			}}
			overview={{
				boxes: [
					{
						title: 'Bluetooth',
						icon: 'bluetooth',
						description: 'Utilizes Bluetooth for remote control.',
					},
					{
						title: 'Android app',
						icon: 'android',
						description: 'A custom-made Android app that turns any phone into a remote to control the tank.',
					},
					{
						title: 'Sensors',
						icon: 'camera',
						description: 'Automatically scans for nearby objects and determines their distance.',
					},
				],
			}}
			gallery={[
				{
					title: 'Assembled tank',
					path: 'rc-tank/assembled.jpg',
					description: 'The assembled version of our project.',
				},
				{
					title: 'Arduino board',
					path: 'rc-tank/arduino-board.jpg',
					description: 'The Arduino board with the PWM hat installed and the Bluetooth module connected.',
				},
				{
					title: 'Android app',
					path: 'rc-tank/app.jpg',
					description: 'The visuals of the Android app made with MIT App Inventor.',
				},
				{
					title: '3D-printed chassis',
					path: 'rc-tank/chassis.jpg',
					description: 'The 3D-printed chassis assembly of our tank.',
				},
				{
					title: 'Connecting components',
					path: 'rc-tank/connecting-components.jpg',
					description: 'The components being connected inside the chassis.',
				},
				{
					title: 'App code',
					path: 'rc-tank/app-code-snippet.jpg',
					description: "A snippet of our Android app's code.",
				},
				{
					title: 'Bytes sending',
					path: 'rc-tank/bytes-sending.jpg',
					description:
						'An example of the bytes sent from the Android app to the Bluetooth module and then processed by the Arduino board.',
				},
				{
					title: 'Muzzle scanning',
					path: 'rc-tank/tank.mp4',
					description: "Demonstration of the tank's automatic muzzle scanning mode.",
					kind: 'video' as const,
				},
			]}
		/>
	);
}
