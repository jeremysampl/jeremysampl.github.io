import { ReactNode } from "react";
import { ExperiencePoint } from "../../data/experience";
import { EntryCardHeader } from "./EntryCard";
import StackMeta, { type ExternalLinksProps, type TechnologyItem } from "./StackMeta";
import AspectImage from "../displays/AspectImage";
import { lookupImageSize } from "../../utils/imageSize";
import "../../styles/experience.css";

export default function ExperienceDisplay({
	id,
	name,
	companyUrl,
	location,
	mapUrl,
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
	companyUrl?: string;
	location: string;
	mapUrl?: string;
	title: string;
	dateRange: string;
	image: string;
	descriptionTitle?: string;
	points: ExperiencePoint[];
	links?: ExternalLinksProps;
	technologies?: TechnologyItem[];
	children?: ReactNode;
}) {
	const src = `/images/experience/${image}`;
	const knownSize = lookupImageSize(src);

	return (
		<article id={id} className="experience-card">
			<div className="entry-card">
				<div className="entry-card__media">
					<AspectImage
						src={src}
						alt={`${name} workplace`}
						fill
						aspectRatio={knownSize ?? [16, 9]}
						imgClassName="entry-card__photo"
					/>
				</div>
				<div className="entry-card__body">
					<EntryCardHeader
						title={title}
						subtitle={name}
						subtitleHref={companyUrl}
						dateRange={dateRange}
						location={location}
						locationHref={mapUrl}
						subtitleAs="h2"
					>
						<StackMeta links={links} technologies={technologies} label="Technologies used" />
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
