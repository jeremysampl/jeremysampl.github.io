import React, { useEffect } from 'react';
import '../../styles/project.css';
import ModalBox from '../Containers/ModalBox';
import ModalView from '../Views/ModalView';
import ThreeBox from '../Containers/ThreeBox';
import LanguageDisplay from '../Containers/LanguageDisplay';
import DropDownDisplay from '../Containers/DropDownDisplay';
import Spacer from '../Containers/Spacer';

export default function ProjectPage({ project, overview, languages, gallery, github }) {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, []);
  
    return (
    <section className="section">
        <section className="overview">
            <div className="title">
                <h1>{project.name}</h1>
                <h3>{project.title}</h3>
            </div>

            <h2>Overview</h2>
            <ThreeBox box1 = {overview.box1} box2 = {overview.box2} box3 = {overview.box3} />
        </section>

        <Spacer height="30" />
        <section className="description">
            <h2>Description</h2>
            {project.description}
        </section>

        <Spacer height="30" />
        <section className="languages">
            <h2>Programming Languages</h2>
            <p>This program is written in the following language(s):</p>
			<LanguageDisplay l1={languages.l1} l2={languages.l2} l3={languages.l3} />
        </section>

        <Spacer height="30" />
        <section className="gallery">
            <h2>Gallery</h2>
            <p>Click on any image to enlarge it and obtain more information.</p>
            <ModalBox gallery={Object.values(gallery).slice(0,2)} />
            {Object.values(gallery).length > 2 ? <DropDownDisplay expansion={<ModalBox gallery={Object.values(gallery).slice(2)}/>} /> : null}
        </section>

        <ModalView />

        <section className="github">
            <p>This project and its source code can be found in its entirety on GitHub:</p>
            <div className="image">
                <a href={"https://github.com/jeremysampl/" + github.repository}><img src="../../Images/Misc/GitHub Logo.png" alt="GitHub Logo"/></a>
                <p>{"https://github.com/jeremysampl/" + github.repository}</p>
            </div>
        </section>
    </section>
  );
}