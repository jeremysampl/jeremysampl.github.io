function expandRow(section, expanded) {
    const expand = document.getElementById(section + "Expand");
    const arrowUp = document.getElementById(section + "Up");
    const arrowDown = document.getElementById(section + "Down");

    if (expanded) {
        expand.style.display = "block";
        arrowDown.style.display = "none";
        arrowUp.style.display = "block";
    } else {
        expand.style.display = "none";
        arrowDown.style.display = "block";
        arrowUp.style.display = "none";
    }
}