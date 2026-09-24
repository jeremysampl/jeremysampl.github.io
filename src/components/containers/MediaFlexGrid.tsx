import React, { type CSSProperties, useCallback, useEffect, useState } from 'react';
import '../../styles/media-card.css';

export type MediaAspectRatio = string | number | readonly [number, number];
/** Pass `'natural'` to size each thumb from its intrinsic ratio instead of a fixed crop. */
export type MediaStripAspectRatio = MediaAspectRatio | 'natural';
export type MediaMaxPerRow = 1 | 2 | 3 | 4;
export type MediaStripAlign = 'center' | 'stretch';
export type MediaStripFlex = number | number[] | 'auto';

export type MediaFlexItemLayout = {
	/** Normalized flex grow weight within the current row. */
	flex: number;
	naturalAspect: boolean;
	onIntrinsicAspect?: (ratio: number) => void;
};

function cssAspectRatio(value: MediaAspectRatio): string {
	if (typeof value === 'number') return String(value);
	if (typeof value === 'string') return value;
	return `${value[0]} / ${value[1]}`;
}

export function resolveMediaFlex(
	flex: MediaStripFlex | undefined,
	index: number,
	measured?: number[],
): number {
	if (flex === 'auto') return measured?.[index] ?? 1;
	if (flex == null) return 1;
	if (typeof flex === 'number') return flex;
	return flex[index] ?? 1;
}

function chunkRows<T>(items: T[], size: number): T[][] {
	const rows: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		rows.push(items.slice(i, i + size));
	}
	return rows;
}

/** Scale row weights so they sum to 1 (CSS won't fill the row if flex-grow totals < 1). */
function normalizeRowFlex(weights: number[]): number[] {
	const sum = weights.reduce((total, weight) => total + weight, 0);
	if (sum <= 0) return weights.map(() => 1 / Math.max(weights.length, 1));
	return weights.map((weight) => weight / sum);
}

/** Equal-height / weighted media rows. Shared by writeup filmstrips and the projects page. */
export default function MediaFlexGrid<T>({
	items,
	maxPerRow = 3,
	aspectRatio,
	flex,
	alignItems,
	inline = false,
	className,
	getKey,
	renderItem,
}: {
	items: T[];
	maxPerRow?: MediaMaxPerRow;
	aspectRatio?: MediaStripAspectRatio;
	flex?: MediaStripFlex;
	alignItems?: MediaStripAlign;
	/** Tighter full-width strip styling for writeups. */
	inline?: boolean;
	className?: string;
	getKey: (item: T, index: number) => string | number;
	renderItem: (item: T, index: number, layout: MediaFlexItemLayout) => React.ReactNode;
}) {
	const naturalAspect = aspectRatio === 'natural';
	const autoFlex = flex === 'auto';
	const itemKey = items.map((item, index) => String(getKey(item, index))).join('\0');
	const [measuredFlex, setMeasuredFlex] = useState<number[]>(() => items.map(() => 1));

	useEffect(() => {
		setMeasuredFlex(items.map(() => 1));
	}, [itemKey]);

	const handleIntrinsicAspect = useCallback(
		(index: number, ratio: number) => {
			if (!autoFlex) return;
			setMeasuredFlex((prev) => {
				const next =
					prev.length === items.length
						? [...prev]
						: Array.from({ length: items.length }, (_, i) => prev[i] ?? 1);
				if (Math.abs((next[index] ?? 1) - ratio) < 0.0001) return prev;
				next[index] = ratio;
				return next;
			});
		},
		[autoFlex, items.length],
	);

	if (!items.length) return null;

	const resolvedAlign = alignItems ?? 'center';
	const rows = chunkRows(
		items.map((item, index) => ({ item, index })),
		maxPerRow,
	).map((row) => {
		const weights = normalizeRowFlex(
			row.map(({ index }) => resolveMediaFlex(flex, index, measuredFlex)),
		);
		return row.map((entry, rowItemIndex) => ({
			...entry,
			rowFlex: weights[rowItemIndex] ?? 1,
		}));
	});

	const rootClassName = [
		'media-card-grid',
		'media-card-grid--flex',
		inline ? 'media-card-grid--inline' : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	const style = {
		...(aspectRatio != null && !naturalAspect
			? { '--media-card-aspect': cssAspectRatio(aspectRatio) }
			: {}),
		'--media-inline-max': String(maxPerRow),
		'--media-inline-align': resolvedAlign,
	} as CSSProperties;

	return (
		<div className={rootClassName} style={style}>
			{rows.map((row, rowIndex) => (
				<div key={rowIndex} className="media-card-grid__row">
					{row.map(({ item, index, rowFlex }) => (
						<React.Fragment key={getKey(item, index)}>
							{renderItem(item, index, {
								flex: rowFlex,
								naturalAspect,
								onIntrinsicAspect: autoFlex
									? (ratio) => handleIntrinsicAspect(index, ratio)
									: undefined,
							})}
						</React.Fragment>
					))}
				</div>
			))}
		</div>
	);
}
