import React from 'react';
import ProjectDisplay from '../containers/ProjectDisplay';
import Row from "../containers/Row";

export default function ProjectsPage() {
	return (
		<>
			<section className="project-showcase section">
				<h1>My Projects</h1>
				<p>Click on any project for more information.</p>

				<Row>
					<ProjectDisplay isModal={false} project={{ name: 'StockAssist', url: 'StockAssist', image: 'Inventory Manager/Home.png' }}/>
					<ProjectDisplay isModal={false} project={{ name: 'Terra Exodus', url: 'TerraExodus', image: 'Terra Exodus/Gameplay.png' }}/>
				</Row>

				<Row>
					<ProjectDisplay isModal={false} project={{ name: 'RC Tank', url: 'RC-Tank', image: 'RC Tank/Final Tank.jpg' }}/>
					<ProjectDisplay isModal={false} project={{ name: 'Blackjack', url: 'Blackjack', image: 'Blackjack/Lose.png' }}/>
				</Row>

				<Row>
					<ProjectDisplay isModal={false} project={{ name: 'Tic Tac Toe', url: 'TicTacToe', image: 'Tic Tac Toe/Gameplay.png' }}/>
				</Row>

				<h3>More projects are currently being worked on!</h3>
			</section>
		</>
	);
}
