import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import '../../styles/project-display.css'

export default function ProjectDisplay({ project, onClick }) {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, []);

	if (project.url) {
		return (
			<Link to={'/projects/' + project.url} className="project-col section">
				<h3>{project.name}</h3>
				<img src={'../Images/Projects/' + project.image} alt="Project display"/>
			</Link>
		);
	} else {
		return (
			<div className="project-col section" onClick={onClick}>
				<h3>{project.name}</h3>
				<img src={'../Images/Projects/' + project.image} alt="Project display"/>
			</div>
		);
	}
	
}