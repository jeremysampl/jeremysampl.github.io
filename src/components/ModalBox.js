import React from 'react';

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
                <div class="project-col-margin">
                    <div class="project-col">
                        <h3>{image1.title}</h3>
                        <img src={'../Images/Projects/' + image1.path} onClick={() => zoomImage(image1.path, image1.description)} alt={image1.description}/>
                    </div>
                </div>
                <div class="project-col-margin">
                    <div class="project-col">
                        <h3>{image2.title}</h3>
                        <img src={'../Images/Projects/' + image2.path} onClick={() => zoomImage(image2.path, image2.description)} alt={image2.description}/>
                    </div>
                </div>
            </div>;
        if (i > 2) {
            output.push(<div class="expand-gallery">{html}</div>);
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