import { ReactNode } from 'react';

export default function Row({ children }: { children: ReactNode & { length?: number } }) {
    return (
        <div className='row' style={children.length > 1 ? {} : {justifyContent: 'center'}}>
            {children}
        </div>
    );
}
