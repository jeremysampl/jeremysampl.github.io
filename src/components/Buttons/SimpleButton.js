import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

export default function SimpleButton(props) {
    const [isHover, setIsHover] = useState(false);

    const style = {
        display: "inline-block",
        textDecoration: "none",
        color: props.color,
        border: "1px solid " + props.color,
        borderRadius: "5px",
        padding: "12px 34px",
        fontSize: "13px",
        fontWeight: 800,
        background: "transparent",
        position: "relative",
        cursor: "pointer",
        marginTop: "20px",
        transition: "1s"
    };

    const scrollWithOffset = (el) => {
        const yCoord = el.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = window.innerHeight * 0.08;
        window.scrollTo({ top: yCoord - yOffset, behavior: 'smooth' });
    }

    if (isHover) {
        style.background = "var(--secondary-color)"
        style.borderColor = "var(--secondary-color)"
    } else {
        style.background = "transparent"
        style.borderColor = props.color
    }

    if (props.url.charAt(0) !== "#") {
        return (
            <Link to={props.url} style={style}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                {props.text}
            </Link>
        );
    } else {
        return (
            <HashLink smooth to={props.url} scroll={el => scrollWithOffset(el)} style={style}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}>
                {props.text}
            </HashLink>
        );
    }
}