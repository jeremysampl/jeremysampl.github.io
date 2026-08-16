import {
	aboutIntro,
	education,
	leadership,
	spokenLanguages,
	type AboutEntry,
} from '../../data/about';
import { getProject } from '../../data/projects';
import { EntryCardHeader } from '../containers/EntryCard';
import InlineLink from '../displays/InlineLink';
import '../../styles/about.css';
import { getExperience } from '../../data/experience';

function AboutEntryCard({ entry }: { entry: AboutEntry }) {
	return (
		<article className="entry-card about-entry">
			<div className="entry-card__body">
				<EntryCardHeader
					title={entry.title}
					subtitle={entry.organization}
					detail={entry.detail}
					dateRange={entry.dateRange}
					location={entry.location}
				/>
				{entry.points.length ? (
					<ul className="entry-card__points">
						{entry.points.map((point) => (
							<li key={point}>{point}</li>
						))}
					</ul>
				) : null}
			</div>
		</article>
	);
}

export default function AboutPage() {
	const wateringCan2023 = getExperience('watering-can-2023');
	const geckode = getProject('geckode');

	return (
		<section className="section about">
			<h1>About Me</h1>

			<div className="about-intro entry-card">
				<div className="about-intro__media">
					<img src={aboutIntro.photo} alt={`${aboutIntro.name} profile`} />
				</div>
				<div className="about-intro__body">
					<h2 className="about-intro__name">{aboutIntro.name}</h2>
					<p className="about-intro__text">
						I am a software developer and recent computer science graduate from McMaster
						University, with eight months of experience building full-stack, event-driven
						applications from past co-op positions.
					</p>
					<p className="about-intro__text">
						One of the most important things to know about me is that I always strive to
						challenge myself and push the limits of what I can accomplish:
					</p>
					<ul className="entry-card__points">
						<li>
							While I was in{' '}
							<InlineLink to="#education">
								school
							</InlineLink>
							, I pursued the highest possible grade while
							continuously improving how I learned.
						</li>
						<li>
							During my{' '}
							<InlineLink to={`/experience#${wateringCan2023.anchor}`}>
								first co-op position
							</InlineLink>
							, through fast learning and measurable contributions, I earned the opportunity
							to lead the end-to-end development of a major point of sale (POS) system
							extension that enabled the company to more tightly integrate their restaurant
							and retail operations by merging them under a single unified system.
						</li>
						<li>
							When I work on personal and group projects, I do not shy away from engineering
							my own solutions where no market-ready option exists, such as in{' '}
							<InlineLink to={`/projects/${geckode.slug}`}>{geckode.name}</InlineLink>
							{' '}where I architected and developed a real-time, multi-user
							collaborative experience in a block coding editor.
						</li>
					</ul>
					<p className="about-intro__text">
						I highly encourage you to check out my{' '}
						<InlineLink to="/experience">work experience</InlineLink>
						{' '}and featured{' '}
						<InlineLink to="/projects">projects</InlineLink>
						{' '}for more information about my skills and how I've put them to use!
					</p>
				</div>
			</div>

			<div className="about-block" id="education">
				<h2>Education</h2>
				<AboutEntryCard entry={education} />
			</div>

			<div className="about-block" id="leadership">
				<h2>Leadership</h2>
				<AboutEntryCard entry={leadership} />
			</div>

			<div className="about-block" id="languages">
				<h2>Languages</h2>
				<ul className="about-languages" aria-label="Spoken languages">
					{spokenLanguages.map((language) => (
						<li key={language.name} className="about-language">
							<span className="about-language__name">{language.name}</span>
							<span className="about-language__level">{language.level}</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
