import React from 'react';
import { Link } from "react-router-dom";
import '../../styles/project-display.css'

export default function ProjectDisplay({ project, onClick }) {
	if (project.url) {
		return (
			<Link to={'/projects/' + project.url} className="project-col">
				<h3>{project.name}</h3>
				<img src={'%PUBLIC_URL%/Images/Projects/' + project.image} alt="Project display"/>
			</Link>
		);
	} else {
		return (
			<div className="project-col" onClick={onClick}>
				<h3>{project.name}</h3>
				<img src={'%PUBLIC_URL%/Images/Projects/' + project.image} alt="Project display"/>
			</div>
		);
	}
	
}