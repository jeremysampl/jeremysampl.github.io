import React, { useEffect } from 'react';
import ThreeBox from '../Containers/ThreeBox';
import Spacer from '../Containers/Spacer';

export default function ContactPage() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [])

	return (
		<section className="section">
			<h1>Contact Me</h1>
			<p>Here are a few ways to contact me. The best way to contact me is via email or LinkedIn.</p>
			<ThreeBox
				boxes = {[
					{ title: "Email", icon: "envelope", description: "jeremysampl@live.com", url: "mailto:jeremysampl@live.com" },
					{ title: "LinkedIn", icon: "linkedin", description: "https://www.linkedin.com/in/jeremysampl/", url: "https://www.linkedin.com/in/jeremysampl/" },
					{ title: "Phone", icon: "phone", description: "Please contact me through other means first." }
				]}
			/>

			<Spacer height="30"/>

			<h1>Other Socials</h1>
			<p>Other ways to get to know me:</p>
			<ThreeBox
				boxes = {[
					{ title: "Facebook", icon: "facebook", description: "https://www.facebook.com/jeremysampl/", url: "https://www.facebook.com/jeremysampl/" },
					{ title: "Instagram", icon: "instagram", description: "https://instagram.com/jeremysampl/", url: "https://instagram.com/jeremysampl/" },
					{ title: "GitHub", icon: "github", description: "https://github.com/jeremysampl/", url: "https://github.com/jeremysampl/" }
				]}
			/>
		</section>
	);
}
