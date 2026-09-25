import ExperienceDisplay from '../containers/ExperienceDisplay';
import { experienceDateRange, experiences } from '../../data/experience';

export default function ExperiencePage() {
	return (
		<section className="section">
			<h1>Professional Experience</h1>
			<div className="experience-timeline">
				{experiences.map((experience) => (
					<ExperienceDisplay
						key={experience.id}
						id={experience.anchor}
						name={experience.company}
						companyUrl={experience.companyUrl}
						location={experience.location}
						mapUrl={experience.mapUrl}
						title={experience.role}
						dateRange={experienceDateRange(experience, 'long')}
						image={experience.image}
						descriptionTitle={experience.descriptionTitle}
						technologies={experience.technologies}
						points={experience.points}
					/>
				))}
			</div>
		</section>
	);
}
