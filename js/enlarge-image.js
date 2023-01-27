function zoomImage(el) {
    if (window.innerWidth <= 700) {
        hideMenu();
    }
    modal.style.display = "block";
    modalImg.src = el.src;
    caption.innerHTML = el.alt;
}

{
const span = document.getElementsByClassName("close")[0];
span.onclick = function() { 
    modal.style.display = "none";
}
}