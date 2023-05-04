import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

export default function ProjectDisplay({ project }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div class="project-col-margin">
        <Link to={'/projects/' + project.url}>
            <div class="project-col">
                <h3>{project.name}</h3>
                <img src={'../Images/Projects/' + project.image} alt="Project display"/>
            </div>
        </Link>
    </div>
  );
}