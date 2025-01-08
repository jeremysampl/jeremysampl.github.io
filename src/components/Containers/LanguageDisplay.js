import React, { useState } from 'react';
import '../../styles/global.css';

export default function LanguageDisplay({ languages }) {
	return (
		<div className="row" style={languages.length > 2 ? {} : {justifyContent: 'center', gap: 20}}>
			{languages.map(language => <CreateBox language={language}/>)}
		</div>
	);
}

function CreateBox({language}) {
	const [isHover, setIsHover] = useState(false);

	const style = {
		flexBasis: "32%",
		position: "relative",
        marginTop: "15px",
		borderRadius: "10px",
		boxShadow: isHover ? "0 0 20px 0px rgba(0,0,0,0.5)" : "0 0 20px 0px rgba(0,0,0,0.2)",
		transition: "500ms"
	};

    const imgStyle = {
        width: `calc(100% - ${2 * (language.iconPadding ?? 0)}px)`,
		padding: language.iconPadding ?? 0
    };

	return (
		<div style={style} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
			<h2>{language.name}</h2>
            <img src={"/Images/Languages/" + language.icon} alt="Java" style={imgStyle}/>
            <p>{language.subtitle}</p>
		</div>
	);
}