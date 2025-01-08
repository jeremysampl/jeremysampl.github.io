import React from 'react';
import '../../styles/home.css';
import Spacer from '../Containers/Spacer';
import SkillDisplay from '../Containers/SkillDisplay';
import ProjectDisplay from '../Containers/ProjectDisplay';
import SimpleButton from '../Buttons/SimpleButton';
import LanguageDisplay from '../Containers/LanguageDisplay';
import DropDownDisplay from '../Containers/DropDownDisplay';

export default function HomePage() {
	return (
		<>
			<div id="main-page-background">
				<h1>Jeremy Sampl's Portfolio</h1>
				<p>Welcome to my personal website.</p>
				<SimpleButton text="Click to Know More" url="#skills" color="#fff"/>
			</div>

			<section className="section" id="skills">
				<h2>Featured Skills</h2>
				<p>My most prominent skills.</p>
				<SkillDisplay
					boxes = {[
						{ title: "Problem Solver", description: "I am very proficient at quickly solving a multitude of different kinds of problems." },
						{ title: "Multitasker", description: "Multitasking enables me to complete more work in less time." },
						{ title: "Team Player", description: "I am able to communicate clearly and effectively on a team, as well as lead when needed." }
					]}
				/>
				<SimpleButton text="Learn More" url="/about" color="#000"/>

				<Spacer height="30"/>
				<h2>My Projects</h2>
				<p>A showcase of some of my most sophisticated projects.</p>
				<div className="row">
					<ProjectDisplay isModal={false} project={{ name: 'StockAssist', url: 'StockAssist', image: 'Inventory Manager/Home.png' }}/>
					<ProjectDisplay isModal={false} project={{ name: 'Terra Exodus', url: 'TerraExodus', image: 'Terra Exodus/Gameplay.png' }}/>
				</div>
				<SimpleButton text="View All Projects" url="/projects" color="#000"/>
				
				<Spacer height="30"/>
				<h2>Programming Languages</h2>
				<p>I have significant experience with the following object-oriented languages:</p>
				<LanguageDisplay
					languages = {[
						{ name: "Java", icon: "Java.png", subtitle: "My first and most proficient language. My most sophisticated project to date is written in Java." },
						{ name: "Python", icon: "Python.png", subtitle: "My second and currently most used language. I have created many small projects in Python." },
						{ name: "PHP", icon: "PHP.svg", subtitle: "During my first two 4-month co-op terms, I used PHP extensively for major projects." }
					]}
				/>

				<DropDownDisplay expansion={<>
					<Spacer height="50"/>
					<p>I also have extensive experience building websites and web applications with:</p>
					<LanguageDisplay
						languages = {[
							{ name: "HTML", icon: "HTML.png" },
							{ name: "CSS", icon: "CSS.png" },
							{ name: "JavaScript", icon: "JavaScript.png" }
						]}
					/>
					<LanguageDisplay
						languages = {[
							{ name: "React.js", icon: "React.png" },
							{ name: "MySQL", icon: "MySQL.png" },
							{ name: "jQuery", icon: "jQuery.png" }
						]}
					/>

					<Spacer height="50"/>
					<p>Additionally, I have moderate experience with the following:</p>
					<LanguageDisplay
						languages = {[
							{ name: "C", icon: "C.png" },
							{ name: "C#", icon: "C Sharp.png" },
							{ name: "Django", icon: "Django.svg" }
						]}
					/>
				</>}/>
			</section>
		</>
	);
}
