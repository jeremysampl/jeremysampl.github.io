import ProjectPage from '../ProjectPage';
import { getProject } from '../../../data/projects';

export default function BlackjackPage() {
	const project = getProject('blackjack');

	return (
		<ProjectPage
			projectId={project.id}
			project={{
				name: project.name,
				title: project.title,
				intro:
					'Blackjack is a simple card game often played in casinos. This version of the game uses almost standard rules.',
				points: [
					'The biggest rule change involves the aces, in which they are assumed to be eleven until they would force the player to go over, at which point they are converted to ones.',
					'The use of ASCII art for the cards provides the player with visually appealing gameplay almost as if they were playing in person.',
					'The betting system allows the player to bring a certain arbitrary amount of money to the table and use it to bet. If the player wins, their bet is doubled, while if they tie, their bet is simply returned. However, once that amount is used, the player must leave the table.',
					'This system allows the player to feel the thrill of betting at a blackjack table without losing real money.',
				],
			}}
			overview={{
				boxes: [
					{
						title: 'Visuals',
						icon: 'image',
						description: 'Uses ASCII art to display the cards to the player in a visually appealing manner.',
					},
					{
						title: 'Betting',
						icon: 'usd',
						description: 'Allows the player to bring money to the table and bet.',
					},
					{
						title: 'Thrilling',
						icon: 'random',
						description: 'Provides a similar thrill and experience to playing real blackjack.',
					},
				],
			}}
			gallery={[
				{
					title: 'Unlucky Loss',
					path: 'Blackjack/Lose2.png',
					description: 'A common upsetting loss in blackjack.',
				},
				{
					title: 'Win',
					path: 'Blackjack/Win.png',
					description: 'This is an example of how a player could win in blackjack.',
				},
				{
					title: 'Hit/Hold',
					path: 'Blackjack/HitOrHold.png',
					description: 'The player may choose to hit (pick up another card) or hold.',
				},
				{
					title: 'Typical Loss',
					path: 'Blackjack/Lose.png',
					description: 'A typical loss in blackjack. The player went over 21 while trying to obtain higher.',
				},
			]}
		/>
	);
}
