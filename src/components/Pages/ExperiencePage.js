import React, { useEffect } from 'react';
import ExperienceDisplay from '../Containers/ExperienceDisplay';
import useIsMobile from '../../Hooks/useIsMobile';

export default function ExperiencePage() {
    const isMobile = useIsMobile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="section">
            <h1>Experience</h1>
            <ExperienceDisplay
                name="The Watering Can Flower Market"
                title="Software Developer CO-OP"
                start="May 2023"
                end="August 2023"
                image="WateringCan-Mossscape-BG.jpg"
            >
                <div style={{textAlign: 'left'}}>
                    <h3 style={{fontSize: isMobile ? 20 : 24}}>During my 4-month co-op at The Watering Can, I had the opportunity to work on many exciting projects with some extremely talented individuals! Here is a summary of my time at the company:</h3>
                    <ul style={{margin: '10px 10px 10px 30px', fontSize: isMobile ? 18 : 22, gap: 10, display: 'flex', flexDirection: 'column'}}>
                        <li>Led the development of a new point of sale (POS) system for their café.
                            <ul style={{marginLeft: 30}}>
                                <li>Developed a new interactive map that displays table statuses and links tables to their orders.</li>
                                <li>Used WebSocket connections to ensure the data is shown in real-time on all devices simultaneously.</li>
                                <li>Created APIs to handle all requests, fetching and storing any data necessary.</li>
                            </ul>
                        </li>
                        <li>Led the development of a new chits application for ordered food and drinks.
                            <ul style={{marginLeft: 30}}>
                                <li>Replaced an outdated system with a new lightweight React application, offering significantly improved integration with their pre-existing systems.</li>
                                <li>Produced a system that displays and controls incoming chits, printing them to the desired location when ready.</li>
                                <li>Created seamless data syncronization between all devices, permitting multiple instances of the program to run simultaneously.</li>
                            </ul>
                        </li>
                        <li>Developed WordPress plugins to add new features to their website, as well as update existing ones.</li>
                        <li>Used languages, libraries and frameworks such as PHP, JavaScript, jQuery, React and MySQL.</li>
                    </ul>
                </div>
            </ExperienceDisplay>
        </section>
    );
}