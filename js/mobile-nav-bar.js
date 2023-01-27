{
var prevScrollY = window.scrollY
window.addEventListener('scroll', (e) => { 
    if (window.innerWidth <= 700) {
        const scrollY = window.scrollY;

        if (scrollY < prevScrollY && prevScrollY - scrollY > window.innerHeight / 100) {
            showHeader();
        } else if (scrollY - prevScrollY > window.innerHeight / 40) {
            hideHeader();
            hideMenu();
        }
        prevScrollY = scrollY;
    } 
})
}

function hideHeader() {
    header.style.transform = "translateY(-100%)";
}
function showHeader() {
    header.style.transform = "translateY(0)";
}