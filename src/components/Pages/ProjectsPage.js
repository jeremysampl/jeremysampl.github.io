import React, { useEffect } from 'react';
import ProjectDisplay from '../Containers/ProjectDisplay';

export default function ProjectsPage() {
	useEffect(() => {
        window.scrollTo(0, 0)
      }, []);

	return (
		<>
			<section className="project-showcase section">
				<h1>My Projects</h1>
				<p>Click on any project for more information.</p>

				<div className="row">
					<ProjectDisplay isModal={false} project={{ name: 'StockAssist', url: 'StockAssist', image: 'Inventory Manager/Home.png' }} />
					<ProjectDisplay isModal={false} project={{ name: 'Terra Exodus', url: 'TerraExodus', image: 'Terra Exodus/Gameplay.png' }} />
				</div>

				<div className="row">
					<ProjectDisplay isModal={false} project={{ name: 'Tic Tac Toe', url: 'TicTacToe', image: 'Tic Tac Toe/Gameplay.png' }} />
					<ProjectDisplay isModal={false} project={{ name: 'Blackjack', url: 'Blackjack', image: 'Blackjack/Lose.png' }} />
				</div>

				<h3>More projects are currently being worked on!</h3>
			</section>
		</>
	);
}