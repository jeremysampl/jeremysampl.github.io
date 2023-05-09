import React, { useState } from 'react';

export default function DropDownDisplay({ expansion }) {
    const [isHover, setIsHover] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    let divStyle = {
        display: isExpanded ? "block" : "none",
        transition: "1000ms",
        animationName: "slide-down",
        animationDuration: "1000ms"
    }

    let buttonStyle = {
        fontSize: "50px",
        display: "block",
        width: "fit-content",
        margin: "10px auto",
        transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
        color: isHover ? "var(--secondary-color)" : "#000",
        WebkitTextStrokeWidth: isHover ? "4px" : "0px",
        WebkitTextStrokeColor: "#000"
    }

    return (
        <>
            <div style={divStyle}>{expansion}</div>
            <i className="fa fa-arrow-down" style={buttonStyle} onClick={() => setIsExpanded(!isExpanded)} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}/>
        </>
    );
}