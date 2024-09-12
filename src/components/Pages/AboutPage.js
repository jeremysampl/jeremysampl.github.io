import React from 'react';
import '../../styles/about.css';

export default function AboutPage() {
    return (
        <section className="about-me">
            <h1>About Me</h1>
            <div className="row">
                <div className="about-col">
                    <div className="about-col-margin">
                        <img src="/Images/Misc/Profile Picture.jpg" alt="LinkedIn profile icon"/>
                        <h2>Jeremy Sampl</h2>
                    </div>
                </div>
                <div className="about-col">
                    <div className="about-col-margin">
                        <h3>
                            Hello there! My name is Jeremy Sampl and I am a current undergraduate computer science student at McMaster University in Hamilton, Ontario, Canada.<br/><br/>
                            I'd consider myself to be an extremely motivated individual with a passion for coding and learning.
                            This can be easily seen through my impressive 4.0 GPA and my many personal projects, which I highly encourage you to check out!<br/><br/>
                            I hope to be able to help push computing to its limits in order to further improve user experience and the overall usefulness
                            of computers in an ever-increasing tech future.
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
