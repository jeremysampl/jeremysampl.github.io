import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import '../../styles/sliding-text.css';

function nearestScrollRoot(node: HTMLElement): Element | null {
	let current: HTMLElement | null = node.parentElement;
	while (current) {
		const { overflowY } = getComputedStyle(current);
		if (overflowY === 'auto' || overflowY === 'scroll') return current;
		current = current.parentElement;
	}
	return null;
}

export default function SlidingText({
	text,
	enabled = true,
	delayMs = 1100,
	mobileOnly = true,
	className,
	...rest
}: {
	text: string;
	enabled?: boolean;
	delayMs?: number;
	mobileOnly?: boolean;
	className?: string;
} & HTMLAttributes<HTMLSpanElement>) {
	const wrapRef = useRef<HTMLSpanElement>(null);
	const textRef = useRef<HTMLSpanElement>(null);
	const shiftRef = useRef(0);
	const returningRef = useRef(false);
	const [shift, setShift] = useState(0);

	shiftRef.current = shift;

	useEffect(() => {
		const wrap = wrapRef.current;
		const inner = textRef.current;
		if (!wrap || !inner || !enabled) {
			setShift(0);
			return;
		}

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let timeout = 0;

		const overflowPx = () => Math.max(0, inner.scrollWidth - wrap.clientWidth);

		const easeBack = () => {
			if (returningRef.current || shiftRef.current <= 0) return;
			const matrix = getComputedStyle(inner).transform;
			if (matrix === 'none') {
				setShift(0);
				return;
			}
			returningRef.current = true;
			inner.style.animation = 'none';
			inner.style.transform = matrix;
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					inner.style.transition = 'transform 0.6s ease-in-out';
					inner.style.transform = 'translateX(0)';
				});
			});
			inner.addEventListener(
				'transitionend',
				() => {
					inner.style.animation = '';
					inner.style.transition = '';
					inner.style.transform = '';
					returningRef.current = false;
					setShift(0);
				},
				{ once: true },
			);
		};

		const shouldAnimateForViewport = !mobileOnly || window.matchMedia('(max-width: 700px)').matches;
		if (!shouldAnimateForViewport || reduceMotion.matches) {
			setShift(0);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				window.clearTimeout(timeout);
				if (!entry.isIntersecting) {
					easeBack();
					return;
				}
				timeout = window.setTimeout(() => {
					if (returningRef.current) return;
					setShift(overflowPx());
				}, delayMs);
			},
			{ root: nearestScrollRoot(wrap), threshold: 0.65 },
		);

		observer.observe(wrap);
		return () => {
			window.clearTimeout(timeout);
			inner.style.animation = '';
			inner.style.transition = '';
			inner.style.transform = '';
			returningRef.current = false;
			observer.disconnect();
		};
	}, [text, enabled, delayMs, mobileOnly]);

	const classes = ['sliding-text', className, shift > 0 ? 'is-marquee' : '']
		.filter(Boolean)
		.join(' ');

	return (
		<span className={classes} ref={wrapRef} {...rest}>
			<span
				ref={textRef}
				className="sliding-text__inner"
				style={
					shift > 0
						? {
								['--marquee-distance' as string]: `-${shift}px`,
								['--marquee-duration' as string]: `${Math.min(16, Math.max(5, shift / 22))}s`,
							}
						: undefined
				}
			>
				{text}
			</span>
		</span>
	);
}
