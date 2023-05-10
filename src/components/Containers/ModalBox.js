import React from 'react';
import ProjectDisplay from '../Containers/ProjectDisplay';

export default function ModalBox({ gallery }) {
  return (getHTML(gallery));
}

function getHTML(gallery) {
    const data = Object.values(gallery);
    let output = [];

    for (let i = 0; i < data.length; i += 2) {
        const html =
            <div className="row">
                <ProjectDisplay project={{ name: data[i]["title"], image: data[i]["path"] }} onClick={() => zoomImage(data[i]["path"], data[i]["description"])} />
                <ProjectDisplay project={{ name: data[i + 1]["title"], image: data[i + 1]["path"] }} onClick={() => zoomImage(data[i + 1]["path"], data[i + 1]["description"])} />
            </div>;
        output.push(<>{html}</>);
    }
    return (output);
}

function zoomImage(path, description) {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");
    const caption = document.getElementById("caption");
    modal.style.display = "flex";
    modalImg.src = "/Images/Projects/" + path;
    caption.innerHTML = description;
}