import React from 'react';
import { Link } from "react-router-dom";

export default function ProjectDisplay({ project }) {
  return (
    <div class="project-col-margin">
        <Link to={'/projects/' + project.url}>
            <div class="project-col">
                <h3>{project.name}</h3>
                <img src={'../Images/Projects/' + project.image}/>
            </div>
        </Link>
    </div>
  );
}