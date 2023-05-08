import React, { useEffect } from 'react';

export default function ExperiencePage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

	const style = {
		marginBottom: "80vh"
	};

    return (
        <section className="section">
            <h1 style={style}>Coming Soon...</h1>
        </section>
    );
}