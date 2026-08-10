import React from 'react';
import ProjectDisplay from './ProjectDisplay';

export type GalleryItem = {
	title: string;
	path: string;
	description: string;
};

export default function ModalBox({ gallery }: { gallery: GalleryItem[] }) {
    return <>{Array.from({length: Math.floor(gallery.length / 2)}, (v, i) => i * 2).map(i => <>
        <div className="row" style={i < gallery.length - 1 ? {} : {justifyContent: 'center'}}>
            <ProjectDisplay project={{name: gallery[i].title, image: gallery[i].path}}
                            onClick={() => zoomImage(gallery[i].path, gallery[i].description)}/>
            {i < gallery.length - 1 ?
                <ProjectDisplay project={{name: gallery[i + 1].title, image: gallery[i + 1].path}}
                                onClick={() => zoomImage(gallery[i + 1].path, gallery[i + 1].description)}/>
                : ''}
        </div>
    </>)}</>;
}

function zoomImage(path: string, description: string) {
    const modal = document.getElementById("modal")!;
    const modalImg = document.getElementById("modalImg") as HTMLImageElement;
    const caption = document.getElementById("caption")!;
    modal.style.display = "flex";
    modalImg.src = "/images/projects/" + path;
    caption.innerHTML = description;
}
