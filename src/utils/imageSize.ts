import { imageSizes, type ImageSize } from '../data/imageSizes';

export type { ImageSize };

/** Normalize a public image path or URL to the manifest key (relative to /images/). */
export function imageKey(pathOrUrl: string): string {
	return pathOrUrl
		.replace(/^\/images\//, '')
		.replace(/^images\//, '')
		.replace(/^\/?projects\//, 'projects/')
		.replace(/^\//, '');
}

export function lookupImageSize(pathOrUrl: string | undefined | null): ImageSize | null {
	if (!pathOrUrl) return null;
	const key = imageKey(pathOrUrl);
	return imageSizes[key] ?? imageSizes[`projects/${key}`] ?? null;
}

export function imageAspectRatio(pathOrUrl: string | undefined | null): number | null {
	const size = lookupImageSize(pathOrUrl);
	if (!size || !size[1]) return null;
	return size[0] / size[1];
}
