import useIsMobile from "../../Hooks/useIsMobile"

export default function ExperienceDisplay({name, location, title, start, end, image, descriptionTitle, points, children}) {
    const isMobile = useIsMobile(900);

    const styles = {
        wrapper: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%',
            border: '5px solid #000',
            borderRadius: 10,
            overflow: 'hidden',
        },
        left: {
            width: isMobile? '100%' : '40%',
            margin: 'auto',
        },
        right: {
            width: isMobile ? '100%' : '60%',
            borderLeft: isMobile ? '' : '5px solid black',
            borderTop: isMobile ? '5px solid black' : '',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        image: {
            width: 'calc(100% - 10px)',
            border: '5px transparent solid',
        },
    }

    function structurePoints(point, depth = 1) {
        let currPoint;
        let subPoints = [];

        if (Array.isArray(point)) {
            if (!point.length) {
                return;
            }

            currPoint = point[0];
            subPoints = point.slice(1);
        } else {
            currPoint = point;
        }

        return <li>
            {currPoint}
            {subPoints.length ?
                <ul style={{marginLeft: 10 * depth + 20}}>
                    {subPoints.map(point => structurePoints(point, depth + 1))}
                </ul>
            : ''}
        </li>;
    }

    return <>
        <div style={styles.wrapper}>
            <div style={styles.left}>
                <img style={styles.image} src={'/Images/Experience/' + image} alt="Company Logo"/>
                <div>
                    <h2 style={{marginTop: 0, paddingBottom: 0}}>{name}</h2>
                    <h4>{location}</h4>
                    <h3 style={{marginTop: 10}}>{title}</h3>
                    <h4 style={{marginBottom: 10}}>{start} - {end}</h4>
                </div>
            </div>
            <div style={styles.right}>
                {descriptionTitle ? <h3 style={{fontSize: isMobile ? 20 : 24}}>{descriptionTitle}</h3> : ''}
                <ul style={{
                    margin: '10px 10px 10px 30px',
                    fontSize: isMobile ? 18 : 22,
                    gap: 10,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {points.map(point => structurePoints(point))}
                </ul>
                {children}
            </div>
        </div>
    </>
}