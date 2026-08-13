import React from 'react';
import { useGalleryLightbox } from '../views/GalleryLightbox';
import MediaCard, { MediaCardGrid } from './MediaCard';
import type { GalleryItem } from '../../types/gallery';
import { galleryItemUrl, isGalleryVideo } from '../../types/gallery';

export type { GalleryItem };

export default function ProjectMediaGrid({ media }: { media: GalleryItem[] }) {
	const { openLightbox } = useGalleryLightbox();

	if (!media.length) return null;

	return (
		<MediaCardGrid columns={3}>
			{media.map((item, index) => (
				<MediaCard
					key={`${item.path}-${index}`}
					title={item.title}
					src={galleryItemUrl(item)}
					isVideo={isGalleryVideo(item)}
					onClick={(_, origin) => openLightbox(media, index, origin)}
				/>
			))}
		</MediaCardGrid>
	);
}
