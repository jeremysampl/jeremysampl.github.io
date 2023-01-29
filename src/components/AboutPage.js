import React from 'react';
import '../styles/about.css';

export default function AboutPage() {
  return (
    <>
        <section class="about-me">
            <h6>About Me</h6>
            <div class="row">
                <div class="about-col">
                    <div class="about-col-margin">
                        <img src="../Images/Misc/Profile Picture.jpg"/>
                        <h1>Jeremy Sampl</h1>
                    </div>
                </div>
                <div class="about-col">
                    <div class="about-col-margin">
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
    </>
  );
}
