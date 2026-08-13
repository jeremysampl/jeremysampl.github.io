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
		image: 'WateringCan-Second-Coop.jpg',
		descriptionTitle:
			'During my second summer co-op at The Watering Can, I was already familiar with their systems and I truly felt part of the core team! Here is a summary of my second co-op:',
		points: [
			'Maintained and regularly updated their website and 3+ web applications, including implementing new features, fixing bugs, general testing, and much more.',
			[
				'Created new RESTful APIs to modernize and modularize existing APIs.',
				'Used object-oriented programming techniques to significantly improve readability, scalability, and maintainability.',
			],
			'Revamped query structures, optimized data storage, and implemented relational tables, resulting in significant efficiency improvements.',
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
		image: 'WateringCan-Mossscape-BG.jpg',
		descriptionTitle:
			'During my first 4-month co-op at The Watering Can, I had the opportunity to work on many exciting projects with some extremely talented individuals! Here is a summary of my first co-op at the company:',
		points: [
			[
				'Led the development of a new point of sale (POS) system for their café.',
				'Developed a new interactive map that displays table statuses and links tables to their orders.',
				'Used WebSocket connections to ensure the data is shown in real-time on all devices simultaneously.',
				'Created APIs to handle all requests, fetching and storing any data necessary.',
			],
			[
				'Led the development of a new chits application for ordered food and drinks.',
				'Replaced an outdated system with a new lightweight React.js application, offering significantly improved integration with their pre-existing systems.',
				'Produced a system that displays and controls incoming chits, printing them to the desired location when ready.',
				'Created seamless data synchronization between all devices, permitting multiple instances of the program to run simultaneously on different screens.',
			],
			'Developed WordPress plugins to add new features to their website, as well as update existing ones.',
			'Used languages, libraries and frameworks such as PHP, JavaScript, jQuery, React.js and MySQL.',
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
