import useIsMobile from "../../Hooks/useIsMobile"

export default function ExperienceDisplay({name, location, title, start, end, image, children}) {
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
        },
        image: {
            width: 'calc(100% - 10px)',
            border: '5px transparent solid',
        },

    }

    return <>
        <div style={styles.wrapper}>
            <div style={styles.left}>
                <img style={styles.image} src={'/Images/Experience/' + image} alt="Company Logo"/>
                <div style={styles.underImage}>
                    <h2 style={{marginTop: 0, paddingBottom: 0}}>{name}</h2>
                    <h4>{location}</h4>
                    <h3 style={{marginTop: 10}}>{title}</h3>
                    <h4 style={{marginBottom: 10}}>{start} - {end}</h4>
                </div>
            </div>
            <div style={styles.right}>
                {children}
            </div>
        </div>    
    </>
}