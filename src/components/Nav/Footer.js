import React from 'react';
import '../../styles/footer.css'
import Icon from "../Displays/Icon";

export default function Footer() {
	return (
		<section className="footer">
			<h4>About Me</h4>
			<p>A McMaster University Computer Science Co-op student with a passion for coding and learning.</p>
			<div className="icons">
				{
					[
						["facebook", "https://www.facebook.com/jeremysampl/"],
						["instagram", "https://instagram.com/jeremysampl/"],
						["linkedin", "https://www.linkedin.com/in/jeremysampl/"],
						["github", "https://github.com/jeremysampl"],
					].map(([name, url]) => <a href={url} target="_blank" rel="noreferrer"><Icon name={name} pointer={true}/></a>)
				}
			</div>
			<p>This website was completely made by myself using React.js.</p>
		</section>
	);
}