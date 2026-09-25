export type TechnologyCategory = 'languages' | 'frameworks' | 'tools' | 'testing' | 'other';

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
	| 'bash'
	| 'xaml'
	| 'arduino'
	| 'app-inventor'
	| 'django'
	| 'wordpress'
	| 'react'
	| 'nextjs'
	| 'nodejs'
	| 'express'
	| 'jquery'
	| 'electron'
	| 'tailwindcss'
	| 'redux'
	| 'zustand'
	| 'linux'
	| 'git'
	| 'mysql'
	| 'postgresql'
	| 'sqlite'
	| 'rest-apis'
	| 'cicd'
	| 'docker'
	| 'websocket'
	| 'redis'
	| 'yjs'
	| 'jwt'
	| 'nginx'
	| 'cursor'
	| 'codex'
	| 'playwright'
	| 'vitest'
	| 'pytest'
	| 'phaser'
	| 'blockly'
	| 'woocommerce'
	| 'sharp'
	| 'ffmpeg';

export type TechnologyChild = {
	id: TechnologyId;
	description?: string;
};

export type TechnologyItem = {
	id: TechnologyId;
	featured?: boolean;
	subtitle?: string;
	description?: string;
	children?: Omit<TechnologyItem, 'children'>[];
};

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
	{ id: 'python', name: 'Python', category: 'languages', icon: 'python.png' },
	{ id: 'php', name: 'PHP', category: 'languages', icon: 'php.svg' },
	{ id: 'html', name: 'HTML', category: 'languages', icon: 'html.png' },
	{ id: 'css', name: 'CSS', category: 'languages', icon: 'css.png' },
	{ id: 'javascript', name: 'JavaScript', category: 'languages', icon: 'javascript.png' },
	{ id: 'typescript', name: 'TypeScript', category: 'languages', icon: 'typescript.svg' },
	{ id: 'java', name: 'Java', category: 'languages', icon: 'java.png' },
	{ id: 'csharp', name: 'C#', category: 'languages', icon: 'c-sharp.png' },
	{ id: 'c', name: 'C', category: 'languages', icon: 'c.png' },
	{ id: 'bash', name: 'Bash', category: 'languages', icon: 'bash.svg' },
	{ id: 'xaml', name: 'XAML', category: 'languages', icon: 'xaml.png' },
	{ id: 'arduino', name: 'Arduino', category: 'languages', icon: 'arduino.svg', iconPadding: 5 },
	{ id: 'app-inventor', name: 'MIT App Inventor', category: 'languages', icon: 'app-inventor.png' },

	// Libraries & frameworks
	{ id: 'django', name: 'Django', category: 'frameworks', icon: 'django.svg' },
	{ id: 'wordpress', name: 'WordPress', category: 'frameworks', icon: 'wordpress.svg' },
	{ id: 'react', name: 'React', category: 'frameworks', icon: 'react.png' },
	{ id: 'nextjs', name: 'Next.js', category: 'frameworks', icon: 'next-js.svg' },
	{ id: 'nodejs', name: 'Node.js', category: 'frameworks', icon: 'node-js.svg' },
	{ id: 'express', name: 'Express', category: 'frameworks', icon: 'express.svg' },
	{ id: 'jquery', name: 'jQuery', category: 'frameworks', icon: 'jquery.png' },
	{ id: 'electron', name: 'Electron', category: 'frameworks', icon: 'electron.svg' },
	{ id: 'tailwindcss', name: 'Tailwind CSS', category: 'other', icon: 'tailwind-css.svg' },
	{ id: 'redux', name: 'Redux', category: 'frameworks', icon: 'redux.svg' },
	{ id: 'zustand', name: 'Zustand', category: 'frameworks', icon: 'zustand.svg' },

	// Tools
	{ id: 'linux', name: 'Linux', category: 'tools', icon: 'linux.svg' },
	{ id: 'git', name: 'Git', category: 'tools', icon: 'git.svg' },
	{ id: 'mysql', name: 'MySQL', category: 'tools', icon: 'mysql.png' },
	{ id: 'postgresql', name: 'PostgreSQL', category: 'tools', icon: 'postgresql.svg' },
	{ id: 'sqlite', name: 'SQLite', category: 'tools', icon: 'sqlite.svg' },
	{ id: 'rest-apis', name: 'REST APIs', category: 'tools', faIcon: 'exchange' },
	{ id: 'cicd', name: 'CI/CD', category: 'tools', faIcon: 'refresh' },
	{ id: 'docker', name: 'Docker', category: 'tools', icon: 'docker.svg' },
	{ id: 'websocket', name: 'WebSocket', category: 'tools', icon: 'websocket.webp' },
	{ id: 'redis', name: 'Redis', category: 'tools', icon: 'redis.svg' },
	{ id: 'yjs', name: 'Yjs', category: 'tools', icon: 'yjs.png' },
	{ id: 'jwt', name: 'JSON Web Tokens', category: 'tools', icon: 'jwt.svg' },
	{ id: 'nginx', name: 'nginx', category: 'tools', icon: 'nginx.svg' },
	{ id: 'cursor', name: 'Cursor', category: 'tools', icon: 'cursor.svg' },
	{ id: 'codex', name: 'Codex', category: 'tools', icon: 'openai.svg' },

	// Testing
	{ id: 'playwright', name: 'Playwright', category: 'testing', icon: 'playwright.svg' },
	{ id: 'vitest', name: 'Vitest', category: 'testing', icon: 'vitest.svg' },
	{ id: 'pytest', name: 'pytest', category: 'testing', icon: 'pytest.svg' },

	// Other
	{ id: 'phaser', name: 'Phaser', category: 'other', icon: 'phaser.png' },
	{ id: 'blockly', name: 'Blockly', category: 'other', icon: 'blockly.svg' },
	{ id: 'woocommerce', name: 'WooCommerce', category: 'other', icon: 'woocommerce.svg' },
	{ id: 'sharp', name: 'Sharp', category: 'other', icon: 'sharp.svg' },
	{ id: 'ffmpeg', name: 'FFmpeg', category: 'other', icon: 'ffmpeg.svg' },
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

export function technologyItemsHasTechnology(technologyItems: TechnologyItem[], technologyId: TechnologyId): boolean {
	return technologyItems.some((technologyItem) =>
		technologyItem.id === technologyId || technologyItem.children?.some((child) => child.id === technologyId)
	);
}