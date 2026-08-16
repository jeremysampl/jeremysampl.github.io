import React from 'react';
import '../../styles/home.css';
import Spacer from '../containers/Spacer';
import MediaCard, { MediaCardGrid } from '../containers/MediaCard';
import SimpleButton from '../buttons/SimpleButton';
import TechStack from '../containers/TechStack';
import HeroBackground from '../containers/HeroBackground';
import { getProject } from '../../data/projects';

export default function HomePage() {
	const geckode = getProject('geckode');
	const terraExodus = getProject('terra-exodus');

	return (
		<>
			<div id="main-page-background">
				<HeroBackground />
				<div className="hero-content">
					<h1>Jeremy Sampl's Portfolio</h1>
					<p>Welcome to my personal website.</p>
					<SimpleButton text="Click to Know More" url="#projects" variant="on-dark" />
				</div>
			</div>

			<section className="section" id="projects">
				<h2>My Projects</h2>
				<p>A showcase of some of my most sophisticated projects.</p>
				<div className="home-projects">
					<MediaCardGrid>
						<MediaCard
							title={geckode.name}
							src={`/images/projects/${geckode.thumbnail}`}
							href={`/projects/${geckode.slug}`}
						/>
						<MediaCard
							title={terraExodus.name}
							src={`/images/projects/${terraExodus.thumbnail}`}
							href={`/projects/${terraExodus.slug}`}
						/>
					</MediaCardGrid>
				</div>
				<SimpleButton text="View All Projects" url="/projects" variant="primary" />

				<Spacer height="30"/>
				<section className="tech-stack-band">
					<h2>Technology Stack</h2>
					<p>Hover, focus, or tap any skill to see where I've put it to use.</p>
					<TechStack />
				</section>

				<Spacer height="30"/>
				<h2>About Me</h2>
				<p>Education, leadership, and a bit more about who I am.</p>
				<SimpleButton text="Learn More" url="/about" variant="ghost" />
			</section>
		</>
	);
}
