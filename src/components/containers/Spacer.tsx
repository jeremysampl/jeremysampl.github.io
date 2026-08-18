
export default function Spacer(props: { height: string | number }) {
    return (
        <div style={{ padding: ((Number(props.height) / 2) + "px 0") }}></div>
    );
}
