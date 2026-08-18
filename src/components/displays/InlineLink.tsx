import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { scrollToElementWithHeaderOffset } from '../../utils/scroll';
import LinkMark from './LinkMark';
import '../../styles/inline-link.css';

type InlineLinkProps = {
	to: string;
	children: ReactNode;
	external?: boolean;
};

export default function InlineLink({ to, children, external = false }: InlineLinkProps) {
	const isExternal = external || /^https?:\/\//i.test(to);
	const content = (
		<>
			<span className="inline-link__label">{children}</span>
			<span className="inline-link__mark" aria-hidden="true">
				<LinkMark kind={isExternal ? 'external' : 'internal'} />
			</span>
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
