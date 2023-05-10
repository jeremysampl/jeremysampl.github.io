import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header.css';

export default function Header() {
    return (
        <section className="header" id="header">
            <nav>
                <Link to="/"><img src="/Images/Misc/JS Logo.png" alt="Logo"/></Link>
                <h1>Jeremy Sampl</h1>
                <div className="nav-links" id="navLinks">
                    <i className="fa fa-times" onClick={hideMenu}></i>
                    <ul>
                        <li><Link to="/" onClick={hideMenu}>HOME</Link></li>
                        <li><Link to="/about" onClick={hideMenu}>ABOUT</Link></li>
                        <li><Link to="/projects" onClick={hideMenu}>PROJECTS</Link></li>
                        <li><Link to="/experience" onClick={hideMenu}>EXPERIENCE</Link></li>
                        <li><Link to="/contact" onClick={hideMenu}>CONTACT</Link></li>
                    </ul>
                </div>
                <i className="fa fa-bars" onClick={showMenu}></i>
            </nav>
        </section>
    );
}

function showMenu() {
    document.getElementById("navLinks").style.transform = "translateX(0)";
}

function hideMenu() {
    if (window.screen.width <= 700) {
        document.getElementById("navLinks").style.transform = "translateX(100%)";
    }
}