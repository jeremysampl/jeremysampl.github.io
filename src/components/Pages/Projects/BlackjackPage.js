import React from 'react';
import ProjectPage from '../ProjectPage';

export default function BlackjackPage() {
	return (
		<ProjectPage
		project = {{ 
			name: "Blackjack",
			title: "Casino Card Game",
			description: 
				<p>
					Blackjack is a simple card game often played in casinos. This version of the game uses almost standard rules.<br/>
					The biggest rule change inolves the aces, in which they are assumed to be eleven until they would force the player to go over, at which point they are converted to ones.<br/><br/>
					The use of ASCII art for the cards provides the player with visually appealing gameplay almost as if they were playing in person.<br/><br/>
					The betting system allows the player to bring a certain arbitrary amount of money to the table and use it to bet.<br/>
					If the player wins, their bet is doubled, while if they tie, their bet is simply returned.<br/>
					However, once that amount is used, the player must leave the table.<br/>
					This system allows the player to feel the thrill of betting at a blackjack table without losing real money.
				</p>
		}}
		overview = {{
			box1: {
			title: "Visuals",
			icon: "image",
			description: "Uses ASCII art to display the cards to the player in a visually appealing manner."
			},
			box2: {
			title: "Betting",
			icon: "usd",
			description: "Allows the player to bring money to the table and bet."
			},
			box3: {
			title: "Thrilling",
			icon: "random",
			description: "Provides a similar thrill and experience to playing real blackjack."
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
			title: "Unlucky Loss",
			path: "Blackjack/Lose2.png",
			description: "A common upsetting loss in blackjack."
			},
			image2: {
			title: "Win",
			path: "Blackjack/Win.png",
			description: "This is an example of how a player could win in blackjack."
			},
			image3: {
				title: "Hit/Hold",
				path: "Blackjack/HitOrHold.png",
				description: "The player may choose to hit (pick up another card) or hold."
			},
			image4: {
				title: "Typical Loss",
				path: "Blackjack/Lose.png",
				description: "A typical loss in blackjack. The player went over 21 while trying to obtain higher."
			}
		}}
		github = {{
			repository: "blackjack"
		}}
		/>
	);
}