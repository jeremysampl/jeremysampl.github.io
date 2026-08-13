import React, { useState, CSSProperties } from 'react';
import Icon from '../displays/Icon';
import '../../styles/global.css';

export type LanguageDisplayItem = {
	name: string;
	iconSrc?: string;
	faIcon?: string;
	subtitle?: string;
	iconPadding?: number;
};

export default function LanguageDisplay({ languages }: { languages: LanguageDisplayItem[] }) {
	return (
		<div className="row" style={languages.length > 2 ? {} : { justifyContent: 'center', gap: 20 }}>
			{languages.map((language) => (
				<CreateBox key={language.name} language={language} />
			))}
		</div>
	);
}

function CreateBox({ language }: { language: LanguageDisplayItem }) {
	const [isHover, setIsHover] = useState(false);

	const style: CSSProperties = {
		flexBasis: '32%',
		position: 'relative',
		marginTop: '15px',
		borderRadius: '10px',
		boxShadow: isHover ? '0 0 20px 0px rgba(0,0,0,0.5)' : '0 0 20px 0px rgba(0,0,0,0.2)',
		transition: '500ms',
	};

	const imgStyle: CSSProperties = {
		width: `calc(100% - ${2 * (language.iconPadding ?? 0)}px)`,
		padding: language.iconPadding ?? 0,
	};

	return (
		<div style={style} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
			<h2>{language.name}</h2>
			{language.iconSrc ? (
				<img src={language.iconSrc} alt={language.name} style={imgStyle} />
			) : (
				<div style={{ padding: '24px 0' }}>
					<Icon name={language.faIcon ?? 'code'} size={64} color="var(--secondary-color)" />
				</div>
			)}
			<p>{language.subtitle}</p>
		</div>
	);
}
