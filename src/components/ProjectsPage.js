import React from 'react';
import '../styles/projects.css';
import ProjectDisplay from './ProjectDisplay';

export default function ProjectsPage() {
  return (
    <>
        <section class="project-showcase">
            <h6>My Projects</h6>
            <p>Click on any project for more information.</p>

            <div class="row">
                <ProjectDisplay isModal={false} project={{ name: 'StockAssist', url: 'StockAssist', image: 'Inventory Manager/Home.png' }} />
                <ProjectDisplay isModal={false} project={{ name: 'Terra Exodus', url: 'TerraExodus', image: 'Terra Exodus/Gameplay.png' }} />
            </div>

            <div class="row">
                <ProjectDisplay isModal={false} project={{ name: 'Tic Tac Toe', url: 'TicTacToe', image: 'Tic Tac Toe/Gameplay.png' }} />
                <ProjectDisplay isModal={false} project={{ name: 'Black Jack', url: 'Blackjack', image: 'Blackjack/Lose.png' }} />
            </div>

            <h3>More projects are currently being worked on!</h3>
        </section>
    </>
  );
}