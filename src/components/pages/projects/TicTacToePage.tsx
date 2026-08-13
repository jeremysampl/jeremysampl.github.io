import ProjectPage from '../ProjectPage';
import { getProject } from '../../../data/projects';

export default function TicTacToePage() {
	const project = getProject('tic-tac-toe');

	return (
		<ProjectPage
			projectId={project.id}
			project={{
				name: project.name,
				title: project.title,
				intro:
					'This recreation of the classic tic tac toe game was simply created as a starter project when I was learning C# and XAML.',
				points: [
					'The game works the exact same as the original.',
					"Players, one being O's and the other X's, take turns placing their letters in a 3x3 grid.",
					'The first player to make a full row, column or diagonal wins the game.',
					'However, it is common to tie the game in which the grid is filled but no one won.',
				],
			}}
			overview={{
				boxes: [
					{
						title: 'Simple',
						icon: 'hand-pointer-o',
						description: 'Simply tap/click to play.',
					},
					{
						title: 'Modern UI',
						icon: 'object-group',
						description: 'An aesthetically pleasing modern-looking user interface.',
					},
					{
						title: 'Amusing',
						icon: 'smile-o',
						description: "Who doesn't like a game of tic tac toe?",
					},
				],
			}}
			gallery={[
				{
					title: 'Gameplay',
					path: 'Tic Tac Toe/Gameplay.png',
					description: 'The game contains a modern looking user interface.',
				},
				{
					title: 'Gameplay',
					path: 'Tic Tac Toe/Gameplay2.png',
					description: 'Obtain three in a row, column or diagonal to win.',
				},
			]}
		/>
	);
}
