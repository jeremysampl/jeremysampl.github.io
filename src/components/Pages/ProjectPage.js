import React from 'react';
import '../../styles/project.css';
import ModalBox from '../Containers/ModalBox';
import ModalView from '../Views/ModalView';
import ThreeBox from '../Containers/ThreeBox';
import LanguageDisplay from '../Containers/LanguageDisplay';
import DropDownDisplay from '../Containers/DropDownDisplay';
import Spacer from '../Containers/Spacer';

export default function ProjectPage({ project, overview, languages, gallery, github = null, videos = null }) {
    return (
    <section className="section">
        <section className="overview">
            <div className="title">
                <h1>{project.name}</h1>
                <h3>{project.title}</h3>
            </div>

            <h2>Overview</h2>
            <ThreeBox boxes = {overview.boxes}/>
        </section>

        <Spacer height="30"/>
        <section className="description">
            <h2>Description</h2>
            {project.description}
        </section>

        <Spacer height="30"/>
        <section className="languages">
            <h2>Technologies</h2>
            <p>This project utilizes the following technologies:</p>
			<LanguageDisplay languages={languages}/>
        </section>

        <Spacer height="30"/>
        <section className="gallery">
            <h2>Gallery</h2>
            <p>Click on any image to enlarge it and obtain more information.</p>
            <ModalBox gallery={gallery.slice(0,2)} />
            {gallery.length > 2 ? <DropDownDisplay expansion={<ModalBox gallery={gallery.slice(2)}/>}/> : null}
        </section>

        <ModalView/>

        {videos ? <>
            <Spacer height="30"/>
            <section>
                <h2>Videos</h2>
                {videos.map(video => <>
                    <p>{video.title}</p>
                    <video width="auto" height="auto" controls style={{border: 'solid black 10px', borderRadius: 10, maxWidth: 'calc(80vw - 20px)'}}>
                        <source src={"/Images/" + video.src}/>
                        Your browser does not support the video tag.
                    </video>
                </>)}
            </section>
        </> : ''}

        {github ?
            <section className="github">
                <p>This project and its source code can be found in its entirety on GitHub:</p>
                <div className="image">
                    <a href={"https://github.com/jeremysampl/" + github.repository}><img
                        src="/Images/Misc/GitHub Logo.png" alt="GitHub Logo"/></a>
                    <p>{"https://github.com/jeremysampl/" + github.repository}</p>
                </div>
            </section>
        : ''}
    </section>
    );
}