import React, { ReactNode } from 'react';

export default function Separator({children, gap = 10, column = false}: { children: ReactNode; gap?: number; column?: boolean }) {
    return (
        <div style={{display: 'flex', flexDirection: column ? 'column' : 'row', gap: gap}}>
            {children}
        </div>
    );
}
