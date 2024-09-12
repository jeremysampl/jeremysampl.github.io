import React, { useState } from 'react';
import '../../styles/global.css';
import Icon from "../Displays/Icon";

export default function ThreeBox({ box1, box2, box3 }) {
	return (
		<div className="row">
			<CreateBox box={box1} />
			<CreateBox box={box2} />
			<CreateBox box={box3} />
		</div>
	);
}

function CreateBox({box}) {
	const [isHover, setIsHover] = useState(false);

	const style = {
		flexBasis: "32%",
		position: "relative",
		borderRadius: "10px",
		boxShadow: isHover ? "0 0 20px 0px rgba(0,0,0,0.5)" : "0 0 20px 0px rgba(0,0,0,0.2)",
		transition: "500ms",
		textDecoration: "none",
		margin: "5px 0"
	}

	return (
		<a
			style={style}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			href={box?.url}
		>
			<h2>{box.title}</h2>
			<Icon name={box.icon} size='20vh' color='var(--secondary-color)' pointer={true}/>
			<p>{box.description}</p>
		</a>
	);
}