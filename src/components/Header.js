import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

export default function Header() {
  return (
    <section class="header" id="header">
        <nav>
            <Link to="/"><img src="../Images/Misc/JS Logo.png" alt="Logo"/></Link>
            <h1>Jeremy Sampl</h1>
            <div class="nav-links" id="navLinks">
                <i class="fa fa-times" onClick={hideMenu}></i>
                <ul>
                    <li><Link to="/">HOME</Link></li>
                    <li><Link to="/about">ABOUT</Link></li>
                    <li><Link to="/projects">PROJECTS</Link></li>
                    <li><Link to="/experience">EXPERIENCE</Link></li>
                    <li><Link to="/contact">CONTACT</Link></li>
                </ul>
            </div>
            <i class="fa fa-bars" onClick={showMenu}></i>
        </nav>
    </section>
  );
}

function showMenu() {
    document.getElementById("navLinks").style.transform = "translateX(0)";
}

function hideMenu() {
    document.getElementById("navLinks").style.transform = "translateX(100%)";
}