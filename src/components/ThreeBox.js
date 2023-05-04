import React, { useState } from 'react';
import '../styles/global.css';

export default function ThreeBox({ box1, box2, box3 }) {

	
	return (
		<div class="row">
			{<CreateBox box = {box1} />}
			{<CreateBox box = {box2} />}
			{<CreateBox box = {box3} />}
		</div>
	);
}

function CreateBox({box}) {
	const [isHover, setIsHover] = useState(false);

	const handleMouseEnter = () => {
		setIsHover(true);
	};
	const handleMouseLeave = () => {
		setIsHover(false);
	};

	const boxStyle = {
		flexBasis: "32%",
		position: "relative",
		borderRadius: "10px",
		boxShadow: isHover ? "0 0 20px 0px rgba(0,0,0,0.5)" : "0 0 20px 0px rgba(0,0,0,0.2)",
		transition: "500ms",
		marginTop: "15px"
	}

	return (
		<div style={boxStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<h1>{box.title}</h1>
			<i class={"fa fa-" + box.icon} style={{fontSize: "20vh", color: "var(--secondary-color)" }}></i>
			<p>{box.description}</p>
		</div>
	);
}