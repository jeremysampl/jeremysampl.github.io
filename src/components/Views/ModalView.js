import React from 'react';
import '../../styles/modal.css'

export default function ModalView() {
	return (
		<div id="modal" className="modal">
			<span className="close" onClick={closeModal}>&times;</span>
			<img className="modal-content" id="modalImg" alt="Showcase" style={{objectFit: 'contain', maxWidth: '95vw', maxHeight: 'calc(95vh - 41px)'}}/>
			<div id="caption"></div>
		</div>
	);
}

function closeModal() {
	const modal = document.getElementById("modal")
	modal.style.display = "none";
}