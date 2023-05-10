import React, { useState } from 'react';
import '../../styles/global.css';

export default function LanguageDisplay(props) {
    const boxCount = getLanguageCount(props);

	return (
		<div className="row">
            {boxCount === 1 ? <div></div> : null}
            <CreateBox language={props.l1} />
            {boxCount === 1 ? <div></div> : null}
            {boxCount !== 1 ? <CreateBox language={props.l2} /> : null}
            {boxCount === 3 ? <CreateBox language={props.l3} /> : null}
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
        width: "100%"
    };

	return (
		<div style={style} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
			<h2>{language.name}</h2>
            <img src={"%PUBLIC_URL%/Images/Languages/" + language.icon} alt="Java" style={imgStyle}/>
            {Number(language.percent) ? <h3>{language.percent + "%"}</h3> : <p>{language.percent}</p>}
		</div>
	);
}

function getLanguageCount(props) {
    let count = 0;
    if (props.l1) {
        count++;
    }
    if (props.l2) {
        count++;
    }
    if (props.l3) {
        count++;
    }
    return count;
}