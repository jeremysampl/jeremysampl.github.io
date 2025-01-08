
export default function Row({ children }) {
    return (
        <div className='row' style={children.length > 1 ? {} : {justifyContent: 'center'}}>
            {children}
        </div>
    );
}