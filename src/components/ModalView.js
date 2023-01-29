import React from 'react';
import '../styles/modal.css'

export default function ModalView() {
  return (
    <div id="modal" class="modal">
        <span class="close" onClick={closeModal}>&times;</span>
        <img class="modal-content" id="modalImg"/>
        <div id="caption"></div>
    </div>
  );
}

function closeModal() {
    const modal = document.getElementById("modal")
    modal.style.display = "none";
}