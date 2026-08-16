import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { scrollToElementWithHeaderOffset } from '../../utils/scroll';
import '../../styles/inline-link.css';

type InlineLinkProps = {
	to: string;
	children: ReactNode;
	external?: boolean;
};

function LinkMark({ external }: { external: boolean }) {
	return (
		<span className="inline-link__mark" aria-hidden="true">
			{external ? (
				<svg viewBox="0 0 16 16" width="12" height="12" focusable="false">
					<path
						d="M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V9.5M9.5 2.5h4v4M13.5 2.5 7 9"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.7"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			) : (
				<svg viewBox="0 0 16 16" width="12" height="12" focusable="false">
					<path
						d="M3.5 8h9M8.5 4l4 4-4 4"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.7"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			)}
		</span>
	);
}

export default function InlineLink({ to, children, external = false }: InlineLinkProps) {
	const isExternal = external || /^https?:\/\//i.test(to);
	const content = (
		<>
			<span className="inline-link__label">{children}</span>
			<LinkMark external={isExternal} />
		</>
	);

	if (isExternal || to.startsWith('mailto:')) {
		return (
			<a
				className="inline-link"
				href={to}
				{...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
			>
				{content}
			</a>
		);
	}

	if (to.includes('#')) {
		return (
			<HashLink
				className="inline-link"
				smooth
				to={to}
				scroll={scrollToElementWithHeaderOffset}
			>
				{content}
			</HashLink>
		);
	}

	return (
		<Link className="inline-link" to={to}>
			{content}
		</Link>
	);
}
