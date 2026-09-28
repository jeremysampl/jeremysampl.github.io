import { useEffect, useState } from 'react';

/**
 * Dev-only artificial image delay so you can check skeletons without a slow server.
 *
 * Enable with any of:
 * - URL: ?slowImages or ?slowImages=1500 (ms)
 * - localStorage: localStorage.setItem('slowImages', '1500')
 * - env: VITE_IMAGE_LOAD_DELAY=1500 in .env.local
 *
 * Clear with localStorage.removeItem('slowImages') or drop the query param.
 */
export function getImageLoadDelayMs(): number {
	if (!import.meta.env.DEV) return 0;

	const envDelay = Number(import.meta.env.VITE_IMAGE_LOAD_DELAY ?? 0);
	if (typeof window === 'undefined') return Number.isFinite(envDelay) && envDelay > 0 ? envDelay : 0;

	const param = new URLSearchParams(window.location.search).get('slowImages');
	if (param !== null) {
		if (param === '') return 2000;
		const parsed = Number(param);
		return Number.isFinite(parsed) && parsed >= 0 ? parsed : 2000;
	}

	try {
		const stored = window.localStorage.getItem('slowImages');
		if (stored !== null) {
			if (stored === '') return 2000;
			const parsed = Number(stored);
			return Number.isFinite(parsed) && parsed >= 0 ? parsed : 2000;
		}
	} catch {
		// ignore storage access errors
	}

	return Number.isFinite(envDelay) && envDelay > 0 ? envDelay : 0;
}

/** Holds back `src` until the configured delay elapses (dev only). */
export function useDeferredSrc(src: string | undefined): string | undefined {
	const delay = getImageLoadDelayMs();
	const [readySrc, setReadySrc] = useState<string | undefined>(() => (delay > 0 ? undefined : src));

	useEffect(() => {
		if (!src) {
			setReadySrc(undefined);
			return;
		}
		if (delay <= 0) {
			setReadySrc(src);
			return;
		}

		setReadySrc(undefined);
		const timer = window.setTimeout(() => setReadySrc(src), delay);
		return () => window.clearTimeout(timer);
	}, [src, delay]);

	return readySrc;
}
