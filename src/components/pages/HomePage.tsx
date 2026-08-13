import React from 'react';
import '../../styles/home.css';
import Spacer from '../containers/Spacer';
import SkillDisplay from '../containers/SkillDisplay';
import MediaCard, { MediaCardGrid } from '../containers/MediaCard';
import SimpleButton from '../buttons/SimpleButton';
import TechStack from '../containers/TechStack';
import HeroBackground from '../containers/HeroBackground';
import { getProject } from '../../data/projects';

export default function HomePage() {
	const stockAssist = getProject('stock-assist');
	const terraExodus = getProject('terra-exodus');

	return (
		<>
			<div id="main-page-background">
				<HeroBackground />
				<div className="hero-content">
					<h1>Jeremy Sampl's Portfolio</h1>
					<p>Welcome to my personal website.</p>
					<SimpleButton text="Click to Know More" url="#skills" color="#fff"/>
				</div>
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
				<SimpleButton text="Learn More" url="/about" color="var(--text-ink)"/>

				<Spacer height="30"/>
				<h2>My Projects</h2>
				<p>A showcase of some of my most sophisticated projects.</p>
				<div className="home-projects">
					<MediaCardGrid>
						<MediaCard
							title={stockAssist.name}
							src={`/images/projects/${stockAssist.thumbnail}`}
							href={`/projects/${stockAssist.slug}`}
						/>
						<MediaCard
							title={terraExodus.name}
							src={`/images/projects/${terraExodus.thumbnail}`}
							href={`/projects/${terraExodus.slug}`}
						/>
					</MediaCardGrid>
				</div>
				<SimpleButton text="View All Projects" url="/projects" color="var(--text-ink)"/>

				<Spacer height="30"/>
				<section className="tech-stack-band">
					<h2>Technology Stack</h2>
					<p>Hover, focus, or tap any skill to see where I've put it to use.</p>
					<TechStack />
				</section>
			</section>
		</>
	);
}
