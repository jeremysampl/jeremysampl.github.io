import React, { useState, ReactNode, CSSProperties } from 'react';
import Icon from "../displays/Icon";

export default function DropDownDisplay({ expansion }: { expansion: ReactNode }) {
    const [isHover, setIsHover] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    let divStyle: CSSProperties = {
        display: isExpanded ? "block" : "none",
        transition: "1000ms",
        animationName: "slide-down",
        animationDuration: "1000ms"
    }

    let buttonStyle: CSSProperties = {
        fontSize: "50px",
        display: "block",
        width: "fit-content",
        margin: "10px auto",
        transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
        color: isHover ? "var(--secondary-color)" : "var(--text-ink)",
        WebkitTextStrokeWidth: isHover ? "4px" : "0px",
        WebkitTextStrokeColor: "var(--text-ink)",
        transitionDuration: '200ms',
    }

    return (
        <>
            <div style={divStyle}>{expansion}</div>
            <Icon
                name="arrow-down"
                style={buttonStyle}
                onClick={() => setIsExpanded(!isExpanded)}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                pointer={true}
            />
        </>
    );
}
