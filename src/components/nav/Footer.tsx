import React from 'react';
import '../../styles/footer.css'
import Icon from "../displays/Icon";

export default function Footer() {
	return (
		<section className="footer">
			<h4>Jeremy Sampl</h4>
			<p>A recent McMaster University computer science graduate with a passion for coding and learning.</p>
			<div className="icons">
				{
					[
						["linkedin", "https://www.linkedin.com/in/jeremysampl/"],
						["github", "https://github.com/jeremysampl"],
						["instagram", "https://instagram.com/jeremysampl/"],
						["facebook", "https://www.facebook.com/jeremysampl/"],
					].map(([name, url]) => <a href={url} target="_blank" rel="noreferrer"><Icon name={name} pointer={true}/></a>)
				}
			</div>
		</section>
	);
}
