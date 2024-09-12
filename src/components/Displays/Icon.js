import React, {useState} from "react";

export default function Icon({name, color = undefined, size = undefined, pointer = false,
                                 onClick = () => {}, onMouseEnter = () => {}, onMouseLeave = () => {}, style = {}}) {
    const [isHover, setIsHover] = useState(false);

    return (
        <i
            className={`fa fa-${name}`}
            onClick={onClick}
            onMouseEnter={() => {
                onMouseEnter();
                setIsHover(true);
            }}
            onMouseLeave={() => {
                onMouseLeave();
                setIsHover(false);
            }}
            style={Object.assign({
                fontSize: size,
                color: color,
                cursor: pointer && isHover ? 'pointer' : 'default',
            }, style)}
        ></i>
    );
}