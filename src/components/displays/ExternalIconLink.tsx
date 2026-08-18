import LinkMark from './LinkMark';
import '../../styles/external-icon-link.css';

type ExternalIconLinkProps = {
	href: string;
	label: string;
};

export default function ExternalIconLink({ href, label }: ExternalIconLinkProps) {
	return (
		<a
			className="external-icon-link"
			href={href}
			target="_blank"
			rel="noreferrer"
			aria-label={label}
			title={label}
		>
			<LinkMark kind="external" />
		</a>
	);
}
