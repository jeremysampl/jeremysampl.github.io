import React, { type CSSProperties, type MouseEventHandler } from 'react';

type IconProps = {
	name: string;
	color?: string;
	size?: string | number;
	pointer?: boolean;
	onClick?: MouseEventHandler<HTMLElement>;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	style?: CSSProperties;
};

export default function Icon({
	name,
	color,
	size,
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
				fontSize: size,
				color,
				cursor: pointer ? 'pointer' : undefined,
				...style,
			}}
		/>
	);
}
