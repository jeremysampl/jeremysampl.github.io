export type TechnologyCategory = 'languages' | 'frameworks' | 'tools' | 'other';

export type TechnologyId =
	| 'python'
	| 'php'
	| 'html'
	| 'css'
	| 'javascript'
	| 'typescript'
	| 'java'
	| 'csharp'
	| 'c'
	| 'xaml'
	| 'arduino'
	| 'app-inventor'
	| 'django'
	| 'wordpress'
	| 'react'
	| 'nextjs'
	| 'nodejs'
	| 'jquery'
	| 'electron'
	| 'mysql'
	| 'postgresql'
	| 'rest-apis'
	| 'git'
	| 'cicd'
	| 'docker'
	| 'websocket'
	| 'redis'
	| 'yjs'
	| 'phaser'
	| 'tailwindcss'
	| 'blockly'
	| 'woocommerce';

export type Technology = {
	id: TechnologyId;
	name: string;
	category: TechnologyCategory;
	/** File in /images/languages/ */
	icon?: string;
	/** Font Awesome 4 name, if there is no image */
	faIcon?: string;
	iconPadding?: number;
};

/** Names and icons for each technology. The home wheel only shows the subset in skills.ts. */
export const technologies: Technology[] = [
	// Languages
	{ id: 'python', name: 'Python', category: 'languages', icon: 'Python.png' },
	{ id: 'php', name: 'PHP', category: 'languages', icon: 'PHP.svg' },
	{ id: 'html', name: 'HTML', category: 'languages', icon: 'HTML.png' },
	{ id: 'css', name: 'CSS', category: 'languages', icon: 'CSS.png' },
	{ id: 'javascript', name: 'JavaScript', category: 'languages', icon: 'JavaScript.png' },
	{ id: 'typescript', name: 'TypeScript', category: 'languages', icon: 'TypeScript.svg' },
	{ id: 'java', name: 'Java', category: 'languages', icon: 'Java.png' },
	{ id: 'csharp', name: 'C#', category: 'languages', icon: 'C Sharp.png' },
	{ id: 'c', name: 'C', category: 'languages', icon: 'C.png' },
	{ id: 'xaml', name: 'XAML', category: 'languages', icon: 'XAML.png' },
	{ id: 'arduino', name: 'Arduino', category: 'languages', icon: 'Arduino.svg', iconPadding: 5 },
	{ id: 'app-inventor', name: 'MIT App Inventor', category: 'languages', icon: 'App Inventor.png' },

	// Libraries & Frameworks
	{ id: 'django', name: 'Django', category: 'frameworks', icon: 'Django.svg' },
	{ id: 'wordpress', name: 'WordPress', category: 'frameworks', icon: 'WordPress.svg' },
	{ id: 'react', name: 'React', category: 'frameworks', icon: 'React.png' },
	{ id: 'nextjs', name: 'Next.js', category: 'frameworks', icon: 'Next.js.svg' },
	{ id: 'nodejs', name: 'Node.js', category: 'frameworks', icon: 'Node.js.svg' },
	{ id: 'jquery', name: 'jQuery', category: 'frameworks', icon: 'jQuery.png' },
	{ id: 'electron', name: 'Electron', category: 'frameworks', icon: 'Electron.svg' },

	// Databases & Tools
	{ id: 'mysql', name: 'MySQL', category: 'tools', icon: 'MySQL.png' },
	{ id: 'postgresql', name: 'PostgreSQL', category: 'tools', icon: 'PostgreSQL.svg' },
	{ id: 'rest-apis', name: 'REST APIs', category: 'tools', faIcon: 'exchange' },
	{ id: 'git', name: 'Git', category: 'tools', icon: 'Git.svg' },
	{ id: 'cicd', name: 'CI/CD', category: 'tools', faIcon: 'refresh' },
	{ id: 'docker', name: 'Docker', category: 'tools', icon: 'Docker.svg' },
	{ id: 'websocket', name: 'WebSocket', category: 'tools', icon: 'WebSocket.webp' },
	{ id: 'redis', name: 'Redis', category: 'tools', icon: 'Redis.svg' },
	{ id: 'yjs', name: 'Yjs', category: 'tools', icon: 'Yjs.png' },

	// Other
	{ id: 'phaser', name: 'Phaser', category: 'other', icon: 'Phaser.png' },
	{ id: 'tailwindcss', name: 'Tailwind CSS', category: 'other', icon: 'Tailwind CSS.svg' },
	{ id: 'blockly', name: 'Blockly', category: 'other', icon: 'Blockly.svg' },
	{ id: 'woocommerce', name: 'WooCommerce', category: 'other', icon: 'WooCommerce.svg' },
];

export function getTechnology(id: TechnologyId): Technology {
	const technology = technologies.find((entry) => entry.id === id);

	if (!technology) {
		throw new Error(`Unknown technology id: ${id}`);
	}

	return technology;
}

export function technologyIconSrc(technology: Technology): string | undefined {
	return technology.icon ? `/images/languages/${technology.icon}` : undefined;
}
