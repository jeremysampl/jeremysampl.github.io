import React from 'react';
import '../../styles/footer.css';
import Icon from '../displays/Icon';

const SOCIAL_LINKS = [
	{ name: 'linkedin', url: 'https://www.linkedin.com/in/jeremysampl/' },
	{ name: 'github', url: 'https://github.com/jeremysampl' },
	{ name: 'instagram', url: 'https://instagram.com/jeremysampl/' },
	{ name: 'facebook', url: 'https://www.facebook.com/jeremysampl/' },
] as const;

export default function Footer() {
	return (
		<section className="footer">
			<h4>Jeremy Sampl</h4>
			<p>A recent McMaster University computer science graduate with a passion for coding and learning.</p>
			<div className="icons">
				{SOCIAL_LINKS.map(({ name, url }) => (
					<a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name}>
						<Icon name={name} />
					</a>
				))}
			</div>
		</section>
	);
}
