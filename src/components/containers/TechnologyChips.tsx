import React, { useState } from 'react';
import Icon from '../displays/Icon';
import type { LanguageDisplayItem } from './LanguageDisplay';

export default function TechnologyChips({ technologies }: { technologies: LanguageDisplayItem[] }) {
	if (!technologies.length) return null;

	return (
		<ul className="tech-chips" aria-label="Technologies used">
			{technologies.map((technology) => (
				<TechnologyChip key={technology.name} technology={technology} />
			))}
		</ul>
	);
}

function TechnologyChip({ technology }: { technology: LanguageDisplayItem }) {
	const [isHover, setIsHover] = useState(false);

	return (
		<li
			className={`tech-chip${isHover ? ' is-hover' : ''}`}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			title={technology.subtitle ?? technology.name}
		>
			<span className="tech-chip__icon" aria-hidden="true">
				{technology.iconSrc ? (
					<img src={technology.iconSrc} alt="" />
				) : (
					<Icon name={technology.faIcon ?? 'code'} size={22} color="var(--secondary-color)" />
				)}
			</span>
			<span className="tech-chip__name">{technology.name}</span>
			{technology.subtitle ? (
				<span className="tech-chip__subtitle">{technology.subtitle}</span>
			) : null}
		</li>
	);
}
