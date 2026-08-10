import { ReactNode } from "react";
import Icon from "../displays/Icon";
import "../../styles/experience.css";

type ExperiencePoint = string | ExperiencePoint[];

export default function ExperienceDisplay({
    name,
    location,
    title,
    start,
    end,
    image,
    descriptionTitle,
    points,
    children,
}: {
    name: string;
    location: string;
    title: string;
    start: string;
    end: string;
    image: string;
    descriptionTitle?: string;
    points: ExperiencePoint[];
    children?: ReactNode;
}) {
    return (
        <article className="experience-card">
            <div className="experience-card__panel">
                <div className="experience-card__media">
                    <img
                        src={"/images/experience/" + image}
                        alt={`${name} workplace`}
                    />
                </div>
                <div className="experience-card__body">
                    <header className="experience-card__header">
                        <h3 className="experience-card__role">{title}</h3>
                        <h2 className="experience-card__company">{name}</h2>
                        <div className="experience-card__meta">
                            <span className="experience-card__meta-item">
                                <Icon name="calendar" size={15} color="var(--secondary-color)" />
                                <span>{start} – {end}</span>
                            </span>
                            <span className="experience-card__meta-sep" aria-hidden="true">·</span>
                            <span className="experience-card__meta-item">
                                <Icon name="map-marker" size={15} color="var(--secondary-color)" />
                                <span>{location}</span>
                            </span>
                        </div>
                    </header>
                    {descriptionTitle ? (
                        <p className="experience-card__intro">{descriptionTitle}</p>
                    ) : null}
                    <ul className="experience-card__points">
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
