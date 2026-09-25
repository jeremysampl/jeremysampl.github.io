import type { TechnologyId, TechnologyItem } from "./technologies";

export type ExperienceId = 'watering-can-2024' | 'watering-can-2023';

/** Nested bullets: first item is the parent, the rest are children. */
export type ExperiencePoint = string | ExperiencePoint[];

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type ExperienceDate = {
	year: number;
	/** 1-12 */
	month?: Month;
};

export type ExperienceEntry = {
	id: ExperienceId;
	/** id of the matching card, for hash links */
	anchor: string;
	company: string;
	companyUrl?: string;
	location: string;
	mapUrl?: string;
	role: string;
	start: ExperienceDate;
	end: ExperienceDate;
	/** Relative to /images/experience/ */
	image: string;
	descriptionTitle?: string;
	technologies: TechnologyItem[];
	points: ExperiencePoint[];
};

const MONTHS_LONG = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
] as const;

const MONTHS_SHORT = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
] as const;

export type DateRangeStyle = 'long' | 'short';

function monthName(month: Month, style: DateRangeStyle): string {
	return (style === 'long' ? MONTHS_LONG : MONTHS_SHORT)[month - 1];
}

function formatExperienceDate(date: ExperienceDate, style: DateRangeStyle): string {
	if (date.month == null) {
		return String(date.year);
	}

	return `${monthName(date.month, style)} ${date.year}`;
}

const wateringCanSharedDetails = {
	company: 'The Watering Can Flower Market',
	companyUrl: 'https://thewateringcan.ca/',
	location: 'Lincoln, ON, Canada',
	mapUrl: 'https://www.google.com/maps/search/?api=1&query=The+Watering+Can+Flower+Market,+Vineland,+ON',
	role: 'Software Developer – Co-op',
};

const sharedWateringCanTechnologies = Object.fromEntries(Object.entries({
	php: {
		featured: true,
		description: `Used for all server-side features, plugins, and API endpoints for company systems.`,
	},
	wordpress: {
		featured: true,
		description: `Backbone for the company\'s operations, hosting their website, online storefront, and internal tools.
			Built and/or maintained 10+ custom plugins, adding extra functionality, easy-to-use manager interfaces for intuitive
			data viewing and system configuration, and reliable integration with their POS system.`,
		children: [
			{
				id: 'woocommerce',
				description: 'WordPress plugin for the company\'s online storefront. Heavy integration with the custom POS system.'
			},
		],
	},
	mysql: {
		featured: true,
		description: `Persistence for all data required by the company\'s operations, including orders, POS configurations, and
			much more. Wrote complex queries, optimized schema design, and performed strategic indexing, to enhance system performance and reliability.`,
	},
	jquery: {
		featured: true,
		description: `Used for all interactive functionality on the WordPress plugins I created and maintained, such
			as manager interfaces to control POS configurations.`,
	},
	cicd: {
		description: `Automated deployment and verification steps for shipping new features and bug fixes to production
			through GitHub Actions.`,
	},
	git: {
		description: 'Version control for all custom WordPress plugins and internal React applications.',
	},
}).map(([key, value]) => [key, { id: key, ...value }])) as Record<TechnologyId, TechnologyItem>;

/** Jobs on the Experience page, newest first. */
export const experiences: ExperienceEntry[] = [
	{
		id: 'watering-can-2023',
		anchor: 'watering-can-2023',
		...wateringCanSharedDetails,
		start: { month: 5, year: 2023 },
		end: { month: 8, year: 2023 },
		image: 'watering-can-coop.jpg',
		descriptionTitle:
			'During my first 4-month co-op at The Watering Can, I had the opportunity to work on a major project that had a significant impact on the company\'s operations! Here is a summary of my accomplishments during the term:',
		technologies: [
			{
				id: 'react',
				featured: true,
				description: `Developed and extended multiple React applications (the POS system and a new chits application)
					to replace outdated systems with modern, efficient solutions that integrate seamlessly with existing
					systems.`,
				children: [
					{
						id: 'redux',
						description: 'State management for the React applications.',
					},
					{ id: 'javascript' },
					{ id: 'html' },
					{ id: 'css' },
				],
			},
			sharedWateringCanTechnologies.jquery,
			sharedWateringCanTechnologies.php,
			sharedWateringCanTechnologies.wordpress,
			sharedWateringCanTechnologies.mysql,
			{
				id: 'websocket',
				featured: true,
				description: `Real-time synchronization for POS table statuses/orders as well as chits across every screen in
					the kitchen.`,
			},
			{
				id: 'electron',
				featured: true,
				description: `Desktop delivery for the React chits application running on kitchen screens. Paired with automated
					over-the-air updates, enabling rapid deployment of new features and bug fixes.`,
			},
			sharedWateringCanTechnologies.cicd,
			sharedWateringCanTechnologies.git,
		],
		points: [
			[
				'Led the end-to-end development of an extension to their existing custom point of sale (POS) system to better integrate their restaurant and retail operations across a single unified platform.',
				'Assumed project ownership and maintained constant communication with staff and management to ensure the system met their needs and exceeded expectations.',
				'Engineered custom WordPress plugins using PHP and jQuery to create intuitive interfaces for POS device configurations, permitting managers to easily configure and administer POS devices, including modifying their interface, items they can sell, and much more.',
				'Developed a jQuery library for managers to design and organize table layout maps in WordPress to display on the React POS system, providing staff with an interactive and straightforward way to view and manage table orders and statuses.',
				'Implemented WebSocket communication to synchronize the data, including table orders and statuses, in real-time on all devices, ensuring consistent, up-to-date information as well as simultaneously cutting down on API calls and improving performance.',
				'Built APIs in PHP to handle all requests, including ensuring proper authentication as well as fetching and storing any data necessary from a MySQL database, securely bridging the gap between the React POS system and the WordPress backend.',
			],
			[
				'Engineered a chits application for ordered food and drinks, providing a streamlined and efficient way to process and manage restaurant orders.',
				'Replaced an outdated system with a new lightweight React application, offering seamless integration with the aforementioned POS system.',
				'Architected a pipeline where ordered food and drinks on the POS system are automatically sent to the correct chit screen or printer in real-time, ensuring that orders are processed efficiently and accurately according to their configuration in the WordPress backend.',
				'Designed a notification system using WebSocket connections to alert staff when a table is ready to be served, improving overall productivity and catering to one of many highly-requested features from staff.',
				'Packaged and distributed the application with Electron, implementing a GitHub Actions CI/CD pipeline to automate over-the-air updates.',
			],
		],
	},
	{
		id: 'watering-can-2024',
		anchor: 'watering-can-2024',
		...wateringCanSharedDetails,
		start: { month: 5, year: 2024 },
		end: { month: 8, year: 2024 },
		image: 'watering-can-mossscape-bg.jpg',
		descriptionTitle:
			'During my second summer co-op at The Watering Can, I was already quite familiar with their systems and I truly felt part of the core team! Here is a summary of my second term:',
		technologies: [
			{
				id: 'react',
				featured: true,
				description: `Developed and maintained features for 3+ React applications, ensuring seamless integration
					with existing systems and providing an intuitive and efficient experience for staff.`,
				children: [
					{
						id: 'redux',
						description: 'State management for the React applications.',
					},
					{ id: 'javascript' },
					{ id: 'html' },
					{ id: 'css' },
				],
			},
			sharedWateringCanTechnologies.jquery,
			sharedWateringCanTechnologies.php,
			sharedWateringCanTechnologies.wordpress,
			sharedWateringCanTechnologies.mysql,
			{
				id: 'rest-apis',
				featured: true,
				description: 'Developed new REST endpoints to modernize and modularize legacy APIs.',
			},
			sharedWateringCanTechnologies.cicd,
			sharedWateringCanTechnologies.git,
		],
		points: [
			'Developed and/or maintained 10+ custom plugins using PHP and jQuery to power key features of a WordPress website and 3+ React applications, ensuring seamless integration across all components and preserving a unified system.',
			[
				'Built new RESTful APIs in PHP to modernize and modularize legacy APIs to support core functionality of a React-based point of sale (POS) system.',
				'Applied object-oriented programming techniques to significantly improve readability, scalability, and maintainability.',
			],
			'Optimized complex MySQL query structures, leveraged strategic indexing, and implemented lookup tables in a large relational database to improve load times by up to 80% in some cases.',
			'Integrated third-party APIs such as Google Recaptcha to enhance security and user experience on their website.',
		],
	},
];

export function getExperience(id: ExperienceId): ExperienceEntry {
	const experience = experiences.find((entry) => entry.id === id);

	if (!experience) {
		throw new Error(`Unknown experience id: ${id}`);
	}

	return experience;
}

/** Start/end range, e.g. "May - Aug 2023" or "2023 - 2024". */
export function experienceDateRange(
	experience: ExperienceEntry,
	style: DateRangeStyle = 'short'
): string {
	const { start, end } = experience;
	const sameYear = start.year === end.year;

	if (start.month != null && end.month != null && sameYear) {
		return `${monthName(start.month, style)} – ${monthName(end.month, style)} ${start.year}`;
	}

	if (start.month == null && end.month == null) {
		return sameYear ? `${start.year}` : `${start.year} – ${end.year}`;
	}

	return `${formatExperienceDate(start, style)} – ${formatExperienceDate(end, style)}`;
}

export function experienceHref(id: ExperienceId): string {
	return `/experience#${getExperience(id).anchor}`;
}
