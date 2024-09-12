import React from 'react';

export default function Spacer(props) {
    return (
        <div style={{ padding: ((Number(props.height) / 2) + "px 0") }}></div>
    );
}