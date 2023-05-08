import React from 'react';
import ProjectDisplay from '../Containers/ProjectDisplay';

export default function ModalBox({ gallery }) {
  return (getHTML(gallery));
}

function getHTML(gallery) {
    var output = [];
    for (let i = 1; i < gallery.imageCount; i += 2) {
        // eslint-disable-next-line
        const image1 = eval("gallery.image" + String(i));
        // eslint-disable-next-line
        const image2 = eval("gallery.image" + String(i + 1));
        const html = 
            <div class="row">
                <ProjectDisplay project={{ name: image1.title, image: image1.path }} onClick={() => zoomImage(image1.path, image1.description)} />
                <ProjectDisplay project={{ name: image2.title, image: image2.path }} onClick={() => zoomImage(image2.path, image2.description)} />
            </div>;
        if (i > 2) {
            output.push(<div className="expand-gallery">{html}</div>);
        } else {
            output.push(html);
        }    
    }
    return (output);
}

function zoomImage(path, description) {
    const modal = document.getElementById("modal")
    const modalImg = document.getElementById("modalImg")
    const caption = document.getElementById("caption")
    modal.style.display = "block";
    modalImg.src = "../Images/Projects/" + path;
    caption.innerHTML = description;
}