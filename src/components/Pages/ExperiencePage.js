import React from 'react';
import ExperienceDisplay from '../Containers/ExperienceDisplay';
import Separator from "../Containers/Separator";

export default function ExperiencePage() {
    return (
        <section className="section">
            <h1>Experience</h1>
            <Separator column={true} gap={30}>
                <ExperienceDisplay
                    name="The Watering Can Flower Market"
                    location="Lincoln, ON"
                    title="Software Developer Co-op"
                    start="May 2023"
                    end="August 2023"
                    image="WateringCan-Mossscape-BG.jpg"
                    descriptionTitle="During my first 4-month co-op at The Watering Can, I had the opportunity to work on many exciting projects with some extremely talented individuals! Here is a summary of my first co-op at the company:"
                    points={[
                        [
                            "Led the development of a new point of sale (POS) system for their café.",
                            "Developed a new interactive map that displays table statuses and links tables to their orders.",
                            "Used WebSocket connections to ensure the data is shown in real-time on all devices simultaneously.",
                            "Created APIs to handle all requests, fetching and storing any data necessary.",
                        ],
                        [
                            "Led the development of a new chits application for ordered food and drinks.",
                            "Replaced an outdated system with a new lightweight React.js application, offering significantly improved integration with their pre-existing systems.",
                            "Produced a system that displays and controls incoming chits, printing them to the desired location when ready.",
                            "Created seamless data synchronization between all devices, permitting multiple instances of the program to run simultaneously on different screens.",
                        ],
                        "Developed WordPress plugins to add new features to their website, as well as update existing ones.",
                        "Used languages, libraries and frameworks such as PHP, JavaScript, jQuery, React.js and MySQL.",
                    ]}
                />
                <ExperienceDisplay
                    name="The Watering Can Flower Market"
                    location="Lincoln, ON"
                    title="Software Developer Co-op"
                    start="May 2024"
                    end="August 2024"
                    image="WateringCan-Second-Coop.jpg"
                    descriptionTitle="During my second summer co-op at The Watering Can, I was already familiar with their systems and I truly felt part of the core team! Here is a summary of my second co-op:"
                    points={[
                        "Maintained and regularly updated their website and 3+ web applications, including implementing new features, fixing bugs, general testing, and much more.",
                        [
                            "Created new RESTful APIs to modernize and modularize existing APIs.",
                            "Used object-oriented programming techniques to significantly improve readability, scalability, and maintainability.",
                        ],
                        "Revamped query structures, optimized data storage, and implemented relational tables, resulting in significant efficiency improvements.",
                        "Facilitated the smooth deployment of new features and patches to production by conducting extensive testing and incorporating user feedback.",
                        "Consistently monitored a ticketing system to quickly resolve bugs, discuss potential new features, and track the status of known issues.",
                    ]}
                />
            </Separator>
        </section>
    );
}