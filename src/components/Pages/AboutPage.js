import React, { useEffect } from 'react';
import '../../styles/about.css';

export default function AboutPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
      }, []);

    return (
        <section className="about-me">
            <h1>About Me</h1>
            <div className="row">
                <div className="about-col">
                    <div className="about-col-margin">
                        <img src="%PUBLIC_URL%/Images/Misc/Profile Picture.jpg" alt="LinkedIn profile icon"/>
                        <h2>Jeremy Sampl</h2>
                    </div>
                </div>
                <div className="about-col">
                    <div className="about-col-margin">
                        <h3>
                            Hello there! My name is Jeremy Sampl and I am a current undergraduate computer science student at McMaster University.<br/><br/>
                            I'd consider myself to be an extremely motivated individual with a passion for coding and learning.
                            As I attend my first year, I am very excited to start my career as a professional developer and acquire an abundance of new
                            knowledge through academic learning and first-hand experience.<br/><br/>
                            I hope to be able to help push computing to its limits in order to further improve user experience and the overall usefulness
                            of computers in an ever-increasing tech future.
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
