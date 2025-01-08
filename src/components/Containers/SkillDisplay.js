import React, { useState } from 'react';

export default function SkillDisplay({ boxes }) {
    return (
		<div className="row">
			{boxes.map(box => <CreateBox box={box}/>)}
		</div>
	);
}

function CreateBox({box}) {
	const [isHover, setIsHover] = useState(false);

	const style = {
		flexBasis: "30%",
		position: "relative",
		borderRadius: "10px",
		boxShadow: isHover ? "0 0 20px 0px rgba(0,0,0,0.5)" : "0 0 20px 0px rgba(0,0,0,0.0)",
		transition: "500ms",
        background: "#ffcdcd",
		marginTop: "15px",
        padding: "20px 12px"
	}

	return (
        <div style={style} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <h3>{box.title}</h3>
            <p>{box.description}</p>
        </div>
    );
}