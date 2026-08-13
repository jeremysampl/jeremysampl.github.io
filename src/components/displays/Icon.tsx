import { type CSSProperties, type MouseEventHandler } from 'react';

type IconProps = {
	name: string;
	color?: string;
	/** px number, any CSS size, or omit for 1em (inherits from parent) */
	size?: string | number;
	/**
	 * When size is a number, scale it with the viewport between ~70% and 100%.
	 * Ignored for string sizes.
	 */
	fluid?: boolean;
	pointer?: boolean;
	onClick?: MouseEventHandler<HTMLElement>;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	style?: CSSProperties;
};

function resolveFontSize(size: string | number | undefined, fluid: boolean): string | undefined {
	if (size == null) {
		return '1em';
	}
	if (typeof size === 'string') {
		return size;
	}
	if (!fluid) {
		return `${size}px`;
	}
	const min = Math.max(10, Math.round(size * 0.7));
	const preferredVw = (size / 1280) * 100;
	return `clamp(${min}px, ${preferredVw.toFixed(3)}vw, ${size}px)`;
}

export default function Icon({
	name,
	color,
	size,
	fluid = false,
	pointer = false,
	onClick,
	onMouseEnter,
	onMouseLeave,
	style,
}: IconProps) {
	return (
		<i
			className={`fa fa-${name}`}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			style={{
				fontSize: resolveFontSize(size, fluid),
				color,
				cursor: pointer ? 'pointer' : undefined,
				...style,
			}}
		/>
	);
}
