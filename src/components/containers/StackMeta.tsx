import React from 'react';
import '../../styles/stack-meta.css';
import ExternalLinks, { type ExternalLinksProps } from './ExternalLinks';
import TechnologyChips, { type TechnologyItem } from './TechnologyChips';

export type StackMetaProps = {
	links?: ExternalLinksProps;
	technologies?: TechnologyItem[];
	className?: string;
	label?: string;
};

export default function StackMeta({ links, technologies, className, label }: StackMetaProps) {
	const hasLinks = Boolean(links?.github || links?.website);
	const hasTech = Boolean(technologies?.length);
	if (!hasLinks && !hasTech) return null;

	return (
		<div className={className ? `stack-meta ${className}` : 'stack-meta'}>
			{hasLinks && links ? <ExternalLinks {...links} /> : null}
			{hasTech && technologies ? <TechnologyChips technologies={technologies} label={label} /> : null}
		</div>
	);
}

export type { ExternalLinksProps, TechnologyItem };
