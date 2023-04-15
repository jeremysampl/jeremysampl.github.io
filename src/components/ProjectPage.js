import React from 'react';
import '../styles/project.css';
import ModalBox from './ModalBox';
import ModalView from './ModalView'

export default function ProjectPage({ project, overview, languages, gallery, github }) {
  return (
    <>
        <section class="overview">
            <div class="title">
                <h6>{project.name}</h6>
                <h3>{project.title}</h3>
            </div>

            <h1>Overview</h1>
            <div class="row">
                <div class="three-col">
                    <h1>{overview.box1.title}</h1>
                    <i class={"fa fa-" + overview.box1.icon}></i>
                    <p>{overview.box1.description}</p>
                </div>
                <div class="three-col">
                    <h1>{overview.box2.title}</h1>
                    <i class={"fa fa-" + overview.box2.icon}></i>
                    <p>{overview.box2.description}</p>
                </div>
                <div class="three-col">
                    <h1>{overview.box3.title}</h1>
                    <i class={"fa fa-" + overview.box3.icon}></i>
                    <p>{overview.box3.description}</p>
                </div>
            </div>
        </section>

        <section class="description">
            <h1>Description</h1>
            {project.description}
        </section>

        <section class="languages">
            <h1>Programming Languages</h1>
            <p>This program is written in the following language(s):</p>

            <div class="row">
                {languages.languageCount === 1 ? <> <div></div> {showLanguage(languages.l1)} <div></div> </> : <></>}
                
                {languages.languageCount === 2 ? <> {showLanguage(languages.l1)} {showLanguage(languages.l2)} </> : <></>}

                {languages.languageCount === 3 ? <> {showLanguage(languages.l1)} {showLanguage(languages.l2)} {showLanguage(languages.l3)} </> : <></>}
            </div>
        </section>

        <section class="gallery">
            <h1>Gallery</h1>
            <p>Click on any image to enlarge it and obtain more information.</p>

            <ModalBox gallery={gallery} />

            {gallery.imageCount > 2 ? <>
                <i class="fa fa-arrow-down" onClick={() => expandRow('gallery', true)} id="galleryDown"></i>
                <i class="fa fa-arrow-up" onClick={() => expandRow('gallery', false)} id="galleryUp"></i>
            </> : <></>}
        </section>

        <ModalView />

        <section class="github">
            <p>This project and its source code can be found in its entirety on GitHub:</p>
            <div class="image">
                <a href={"https://github.com/jeremysampl/" + github.repository}><img src="../../Images/Misc/GitHub Logo.png" alt="GitHub Logo"/></a>
                <p>{"https://github.com/jeremysampl/" + github.repository}</p>
            </div>
        </section>
    </>
  );
}

function showLanguage(language) {
    return (
        <div class="three-col">
            <h1>{language.name}</h1>
            <img src={"../Images/Languages/" + language.icon} alt="Java"/>
            <h3>{language.percent + "%"}</h3>
        </div>
    )
}

function expandRow(section, expanded) {
    const elements = document.getElementsByClassName("expand-" + section);
    const arrowUp = document.getElementById(section + "Up");
    const arrowDown = document.getElementById(section + "Down");

    if (expanded) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = "block";
        }
        arrowDown.style.display = "none";
        arrowUp.style.display = "block";
    } else {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
        arrowDown.style.display = "block";
        arrowUp.style.display = "none";
    }
}