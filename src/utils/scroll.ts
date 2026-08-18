const ANCHOR_GAP_PX = 8;
const MOBILE_NAV_MQ = '(max-width: 800px)';
/** Scroll Y past which the mobile header is expected to be fully hidden. */
const HEADER_HIDES_AFTER_Y = 120;

function headerCssHeightPx() {
	return (
		parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 64
	);
}

/** Pixels of the sliding header that currently overlap the top of the viewport. */
export function getVisibleHeaderCoveragePx() {
	const slide = document.querySelector<HTMLElement>('.header__slide');
	const full = headerCssHeightPx();
	if (!slide) {
		return full;
	}

	const { bottom } = slide.getBoundingClientRect();
	return Math.max(0, Math.min(full, bottom));
}

/**
 * Offset used when scrolling to an in-page target.
 * Desktop always clears the fixed header. On mobile, if the bar is already
 * hidden (or will hide on the way down), the target sits flush with the top.
 */
export function getScrollHeaderOffsetPx(targetY: number, currentY = window.scrollY) {
	const full = headerCssHeightPx() + ANCHOR_GAP_PX;
	const isMobileNav = window.matchMedia(MOBILE_NAV_MQ).matches;

	if (!isMobileNav) {
		return full;
	}

	const visible = getVisibleHeaderCoveragePx();
	const scrollingDown = targetY > currentY + 4;

	if (visible < 1) {
		return 0;
	}

	if (scrollingDown && targetY > HEADER_HIDES_AFTER_Y) {
		return 0;
	}

	return visible + ANCHOR_GAP_PX;
}

/** Smooth-scroll to an element, clearing the header when it is on screen. */
export function scrollToElementWithHeaderOffset(el: HTMLElement) {
	const currentY = window.scrollY;
	const elementY = el.getBoundingClientRect().top + currentY;
	const offset = getScrollHeaderOffsetPx(elementY, currentY);
	const targetY = Math.max(0, elementY - offset);
	window.scrollTo({ top: targetY, behavior: 'smooth' });
}
