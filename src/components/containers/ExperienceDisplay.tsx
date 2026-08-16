import { ReactNode } from "react";
import { ExperiencePoint } from "../../data/experience";
import { EntryCardHeader } from "./EntryCard";
import StackMeta, { type ExternalLinksProps, type TechnologyItem } from "./StackMeta";
import "../../styles/experience.css";

export default function ExperienceDisplay({
	id,
	name,
	location,
	title,
	dateRange,
	image,
	descriptionTitle,
	points,
	links,
	technologies,
	children,
}: {
	id?: string;
	name: string;
	location: string;
	title: string;
	dateRange: string;
	image: string;
	descriptionTitle?: string;
	points: ExperiencePoint[];
	links?: ExternalLinksProps;
	technologies?: TechnologyItem[];
	children?: ReactNode;
}) {
	return (
		<article id={id} className="experience-card">
			<div className="entry-card entry-card--lift">
				<div className="entry-card__media">
					<img
						src={"/images/experience/" + image}
						alt={`${name} workplace`}
					/>
				</div>
				<div className="entry-card__body">
					<EntryCardHeader
						title={title}
						subtitle={name}
						dateRange={dateRange}
						location={location}
						subtitleAs="h2"
					>
						<StackMeta links={links} technologies={technologies} label="Technologies Used" />
					</EntryCardHeader>
					{descriptionTitle ? (
						<p className="entry-card__intro">{descriptionTitle}</p>
					) : null}
					<ul className="entry-card__points">
						{points.map((point, index) => renderPoint(point, index))}
					</ul>
					{children}
				</div>
			</div>
		</article>
	);
}

function renderPoint(point: ExperiencePoint, index: number): ReactNode {
	let currPoint: ExperiencePoint;
	let subPoints: ExperiencePoint[] = [];

	if (Array.isArray(point)) {
		if (!point.length) {
			return null;
		}

		currPoint = point[0];
		subPoints = point.slice(1);
	} else {
		currPoint = point;
	}

	return (
		<li key={index}>
			{currPoint}
			{subPoints.length ? (
				<ul>
					{subPoints.map((subPoint, subIndex) =>
						renderPoint(subPoint, subIndex)
					)}
				</ul>
			) : null}
		</li>
	);
}
