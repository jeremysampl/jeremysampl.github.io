export type GalleryItem = {
	title: string;
	path: string;
	description: string;
	kind?: 'image' | 'video';
};

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov)(\?|$)/i;

export function isGalleryVideo(item: GalleryItem): boolean {
	if (item.kind) return item.kind === 'video';
	return VIDEO_EXTENSIONS.test(item.path);
}

export function galleryItemUrl(item: GalleryItem): string {
	const normalized = item.path.replace(/^projects\//, '');
	return `/images/projects/${normalized}`;
}
