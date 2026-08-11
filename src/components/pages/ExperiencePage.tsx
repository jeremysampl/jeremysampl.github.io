import ExperienceDisplay from '../containers/ExperienceDisplay';
import { experienceDateRange, experiences } from '../../data/experience';

export default function ExperiencePage() {
	return (
		<section className="section">
			<h1>Experience</h1>
			<div className="experience-timeline">
				{experiences.map((experience) => (
					<ExperienceDisplay
						key={experience.id}
						id={experience.anchor}
						name={experience.company}
						location={experience.location}
						title={experience.role}
						dateRange={experienceDateRange(experience, 'long')}
						image={experience.image}
						descriptionTitle={experience.descriptionTitle}
						points={experience.points}
					/>
				))}
			</div>
		</section>
	);
}
