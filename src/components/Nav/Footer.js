import React from 'react';
import '../../styles/footer.css'

export default function Footer() {
	return (
		<section className="footer">
			<h4>About Me</h4>
			<p>A McMaster University Computer Science CO-OP student with a passion for coding and learning.</p>
			<div className="icons">
				<a href="https://www.facebook.com/jeremysampl/" target="_blank" rel="noreferrer"><i className="fa fa-facebook"></i></a>
				<a href="https://instagram.com/jeremysampl/" target="_blank" rel="noreferrer"><i className="fa fa-instagram"></i></a>
				<a href="https://www.linkedin.com/in/jeremysampl/" target="_blank" rel="noreferrer"><i className="fa fa-linkedin"></i></a>
				<a href="https://github.com/jeremysampl" target="_blank" rel="noreferrer"><i className="fa fa-github"></i></a>
			</div>
			<p>This website was completely made by myself using HTML, CSS and JavaScript.</p>
		</section>
	);
}