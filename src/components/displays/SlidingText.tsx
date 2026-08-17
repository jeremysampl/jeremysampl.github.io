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
	className,
	...rest
}: {
	text: string;
	enabled?: boolean;
	delayMs?: number;
	className?: string;
} & HTMLAttributes<HTMLSpanElement>) {
	const wrapRef = useRef<HTMLSpanElement>(null);
	const textRef = useRef<HTMLSpanElement>(null);
	const [shift, setShift] = useState(0);

	useEffect(() => {
		const wrap = wrapRef.current;
		const inner = textRef.current;
		if (!wrap || !inner || !enabled) {
			setShift(0);
			return;
		}

		const mobile = window.matchMedia('(max-width: 700px)');
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let timeout = 0;

		const overflowPx = () => Math.max(0, inner.scrollWidth - wrap.clientWidth);

		const stop = () => {
			window.clearTimeout(timeout);
			setShift(0);
		};

		if (!mobile.matches || reduceMotion.matches) {
			setShift(0);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				window.clearTimeout(timeout);
				if (!entry.isIntersecting) {
					setShift(0);
					return;
				}
				timeout = window.setTimeout(() => {
					setShift(overflowPx());
				}, delayMs);
			},
			{ root: nearestScrollRoot(wrap), threshold: 0.65 },
		);

		observer.observe(wrap);
		mobile.addEventListener('change', stop);
		return () => {
			stop();
			observer.disconnect();
			mobile.removeEventListener('change', stop);
		};
	}, [text, enabled, delayMs]);

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
