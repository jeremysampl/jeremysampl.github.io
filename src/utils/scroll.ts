export function scrollToElementWithHeaderOffset(el: HTMLElement) {
	const yCoord = el.getBoundingClientRect().top + window.pageYOffset;
	const yOffset = window.innerHeight * 0.08;
	window.scrollTo({ top: yCoord - yOffset, behavior: 'smooth' });
}
