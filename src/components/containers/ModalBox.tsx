import React from 'react';
import ProjectDisplay from './ProjectDisplay';
import { useGalleryLightbox } from '../views/GalleryLightbox';
import type { GalleryItem } from '../../types/gallery';

export type { GalleryItem };

export default function ModalBox({
	gallery,
	from = 0,
	to,
}: {
	gallery: GalleryItem[];
	from?: number;
	to?: number;
}) {
	const { openLightbox } = useGalleryLightbox();
	const items = gallery.slice(from, to);

	return (
		<>
			{Array.from({ length: Math.ceil(items.length / 2) }, (_, row) => {
				const i = row * 2;
				const first = items[i];
				const second = items[i + 1];
				const firstIndex = from + i;
				const secondIndex = from + i + 1;
				const isLastRow = !second;

				return (
					<div
						className="row"
						key={`${first.path}-${firstIndex}`}
						style={isLastRow ? { justifyContent: 'center' } : undefined}
					>
						<ProjectDisplay
							project={{ name: first.title, image: first.path }}
							onClick={(_, el) => {
								const origin = el.querySelector('img') ?? el;
								openLightbox(gallery, firstIndex, origin);
							}}
						/>
						{second ? (
							<ProjectDisplay
								project={{ name: second.title, image: second.path }}
								onClick={(_, el) => {
									const origin = el.querySelector('img') ?? el;
									openLightbox(gallery, secondIndex, origin);
								}}
							/>
						) : null}
					</div>
				);
			})}
		</>
	);
}
