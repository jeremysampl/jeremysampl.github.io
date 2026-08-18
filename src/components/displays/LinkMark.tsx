const MARKS = {
	external:
		'M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V9.5M9.5 2.5h4v4M13.5 2.5 7 9',
	internal: 'M3.5 8h9M8.5 4l4 4-4 4',
} as const;

export type LinkMarkKind = keyof typeof MARKS;

export default function LinkMark({ kind }: { kind: LinkMarkKind }) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
			<path
				d={MARKS[kind]}
				fill="none"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
