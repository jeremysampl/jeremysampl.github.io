export function scrollToElementWithHeaderOffset(el: HTMLElement) {
	const yCoord = el.getBoundingClientRect().top + window.pageYOffset;
	const headerStyles = getComputedStyle(document.documentElement);
	const headerHeight =
		parseFloat(headerStyles.getPropertyValue('--header-height')) || 64;
	window.scrollTo({ top: yCoord - headerHeight - 8, behavior: 'smooth' });
}
