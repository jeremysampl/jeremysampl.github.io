import React from 'react';

export default function Separator({children, gap = 10, column = false}) {
    return (
        <div style={{display: 'flex', flexDirection: column ? 'column' : 'row', gap: gap}}>
            {children}
        </div>
    );
}