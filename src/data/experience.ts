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
	location: string;
	role: string;
	start: ExperienceDate;
	end: ExperienceDate;
	/** Relative to /images/experience/ */
	image: string;
	descriptionTitle?: string;
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

/** Jobs on the Experience page, newest first. */
export const experiences: ExperienceEntry[] = [
	{
		id: 'watering-can-2024',
		anchor: 'watering-can-2024',
		company: 'The Watering Can Flower Market',
		location: 'Lincoln, ON, Canada',
		role: 'Software Developer Co-op',
		start: { month: 5, year: 2024 },
		end: { month: 8, year: 2024 },
		image: 'watering-can-second-coop.jpg',
		descriptionTitle:
			'During my second summer co-op at The Watering Can, I was already familiar with their systems and I truly felt part of the core team! Here is a summary of my second co-op:',
		points: [
			'Maintained and regularly updated their website and 3+ web applications, including implementing new features, fixing bugs, general testing, and much more.',
			[
				'Created new RESTful APIs to modernize and modularize existing APIs to support core functionality of a React-based point of sale (POS) system.',
				'Used object-oriented programming techniques to significantly improve readability, scalability, and maintainability.',
			],
			'Revamped complex MySQL query structures and leveraged strategic indexing in a large relational database, resulting in significant efficiency improvements.',
			'Facilitated the smooth deployment of new features and patches to production by conducting extensive testing and incorporating user feedback.',
			'Consistently monitored a ticketing system to quickly resolve bugs, discuss potential new features, and track the status of known issues.',
		],
	},
	{
		id: 'watering-can-2023',
		anchor: 'watering-can-2023',
		company: 'The Watering Can Flower Market',
		location: 'Lincoln, ON, Canada',
		role: 'Software Developer Co-op',
		start: { month: 5, year: 2023 },
		end: { month: 8, year: 2023 },
		image: 'watering-can-mossscape-bg.jpg',
		descriptionTitle:
			'During my first 4-month co-op at The Watering Can, I had the opportunity to work on many exciting projects with some extremely talented individuals! Here is a summary of my first co-op at the company:',
		points: [
			[
				'Led the end-to-end development of an extension to their existing custom point of sale (POS) system to support their restaurant operations.',
				'Assumed project ownership and maintained constant communication with staff and management to ensure the system met their needs and exceeded expectations.',
				'Developed a new interactive map that displays table statuses and links tables to their orders.',
				'Integrated WebSocket connections to ensure the data is shown in real-time on all devices simultaneously, cutting down on API calls and improving performance.',
				'Created APIs to handle all requests, fetching and storing any data necessary.',
			],
			[
				'Engineered a new chits application for ordered food and drinks.',
				'Replaced an outdated system with a new lightweight React application, offering significantly improved integration with their pre-existing systems.',
				'Produced a system that processes incoming chits, sending them to the correct screen, and handling the printing of chits to the desired location.',
				'Created seamless data synchronization between all devices, permitting multiple instances of the program to run simultaneously on different screens.',
			],
			[
				'Developed and maintained custom WordPress plugins that extend the functionality of their website and create a more seamless integration with the POS system.',
				'Designed and implemented easy-to-use manager interfaces for intuitive data viewing and system configuration, such as POS device settings and chit printing locations.',
			],
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
