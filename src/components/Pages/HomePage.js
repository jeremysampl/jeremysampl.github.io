import React, { useEffect } from 'react';
import '../../styles/home.css';
import Spacer from '../Containers/Spacer';
import SkillDisplay from '../Containers/SkillDisplay';
import ProjectDisplay from '../Containers/ProjectDisplay';
import SimpleButton from '../Buttons/SimpleButton';
import LanguageDisplay from '../Containers/LanguageDisplay';
import DropDownDisplay from '../Containers/DropDownDisplay';

export default function HomePage() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<div id="main-page-background">
				<h1>Jeremy Sampl's Portfolio</h1>
				<p>Welcome to my personal website.</p>
				<SimpleButton text="Click to Know More" url="#skills" color="#fff" />
			</div>

			<section className="section" id="skills">
				<h2>Featured Skills</h2>
				<p>My most prominent skills.</p>
				<SkillDisplay
					box1={{ title: "Problem Solver", description: "I am very proficient at quickly solving a multitude of different kinds of problems." }}
					box2={{ title: "Multitasker", description: "Multitasking enables me to complete the same amount of work in less time." }}
					box3={{ title: "Team Player", description: "I am able to communicate clearly and effectively on a team, as well as lead when needed." }}
				/>
				<SimpleButton text="Learn More" url="/about" color="#000" />

				<Spacer height="30" />
				<h2>My Projects</h2>
				<p>A showcase of my most sophisticated programs.</p>
				<div className="row">
					<ProjectDisplay isModal={false} project={{ name: 'StockAssist', url: 'StockAssist', image: 'Inventory Manager/Home.png' }} />
					<ProjectDisplay isModal={false} project={{ name: 'Terra Exodus', url: 'TerraExodus', image: 'Terra Exodus/Gameplay.png' }} />
				</div>
				<SimpleButton text="View All Projects" url="/projects" color="#000" />
				
				<Spacer height="30" />
				<h2>Programming Languages</h2>
				<p>I have significant experience in the following languages:</p>
				<LanguageDisplay
					l1={{ name: "Java", icon: "Java.png", percent: "My first and most proficient language. My most sophisticated project to date is written in Java." }}
					l2={{ name: "Python", icon: "Python.png", percent: "My second and currently most used language. I have created many small projects in Python." }}
					l3={{ name: "C#", icon: "C Sharp.png", percent: "My skills from Java have been very easily transferred to C#, however I am still learning it." }}
				/>

				<DropDownDisplay expansion={<>
					<Spacer height="10" />
					<p>I also have moderate experience building websites with:</p>
					<LanguageDisplay
						l1={{ name: "HTML", icon: "HTML.png", percent: "" }}
						l2={{ name: "CSS", icon: "CSS.png", percent: "" }}
						l3={{ name: "JavaScript", icon: "JavaScript.png", percent: "" }}
					/>
				</>}/>
			</section>
		</>
	);
}
