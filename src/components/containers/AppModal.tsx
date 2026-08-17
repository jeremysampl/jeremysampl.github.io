import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/app-modal.css';

export type AppModalProps = {
	titleId: string;
	eyebrow: string;
	title: string;
	onClose: () => void;
	children: ReactNode;
	action?: ReactNode;
	afterHeader?: ReactNode;
	footer?: ReactNode;
	/** Wider dialog for tables. */
	size?: 'default' | 'wide';
	className?: string;
};

export default function AppModal({
	titleId,
	eyebrow,
	title,
	onClose,
	children,
	action,
	afterHeader,
	footer,
	size = 'default',
	className,
}: AppModalProps) {
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', onKeyDown);
		document.body.classList.add('nav-lock');
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.body.classList.remove('nav-lock');
		};
	}, [onClose]);

	const dialogClass = [
		'app-modal__dialog',
		size === 'wide' ? 'app-modal__dialog--wide' : '',
		className ?? '',
	]
		.filter(Boolean)
		.join(' ');

	return createPortal(
		<div className="app-modal" role="presentation" onClick={onClose}>
			<div
				className={dialogClass}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				onClick={(event) => event.stopPropagation()}
			>
				<header className={`app-modal__header${action ? ' has-action' : ''}`}>
					<p className="app-modal__eyebrow">{eyebrow}</p>
					<button
						type="button"
						className="app-modal__close"
						aria-label="Close"
						onClick={onClose}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
							<path
								d="M6.5 6.5l11 11M17.5 6.5l-11 11"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
					<h2 id={titleId} className="app-modal__title">
						{title}
					</h2>
					{action ? <div className="app-modal__action">{action}</div> : null}
				</header>
				{afterHeader}
				<div className="app-modal__body">{children}</div>
				{footer ? <div className="app-modal__footer">{footer}</div> : null}
			</div>
		</div>,
		document.body,
	);
}
