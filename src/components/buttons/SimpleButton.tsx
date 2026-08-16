import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { scrollToElementWithHeaderOffset } from '../../utils/scroll';
import '../../styles/simple-button.css';

export type SimpleButtonVariant = 'primary' | 'ghost' | 'on-dark';

type SimpleButtonProps = {
	text: string;
	url: string;
	variant?: SimpleButtonVariant;
};

function ButtonArrow() {
	return (
		<span className="simple-btn__arrow" aria-hidden="true">
			<svg viewBox="0 0 16 16" width="14" height="14" focusable="false">
				<path
					d="M3.5 8h9M8.5 4l4 4-4 4"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	);
}

export default function SimpleButton({ text, url, variant = 'primary' }: SimpleButtonProps) {
	const className = `simple-btn simple-btn--${variant}`;
	const content = (
		<>
			<span className="simple-btn__label">{text}</span>
			<ButtonArrow />
		</>
	);

	if (url.startsWith('#')) {
		return (
			<HashLink
				className={className}
				smooth
				to={url}
				scroll={scrollToElementWithHeaderOffset}
			>
				{content}
			</HashLink>
		);
	}

	return (
		<Link className={className} to={url}>
			{content}
		</Link>
	);
}
