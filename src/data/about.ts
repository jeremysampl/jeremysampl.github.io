export type AboutPoint = string;

export type AboutEntry = {
	title: string;
	organization: string;
	location: string;
	dateRange: string;
	detail?: string;
	points: AboutPoint[];
};

export type SpokenLanguage = {
	name: string;
	level: string;
};

export const aboutIntro = {
	name: 'Jeremy Sampl',
	photo: '/images/misc/profile-picture.jpg',
};

export const education: AboutEntry = {
	title: 'Bachelor of Applied Science, Honours Computer Science',
	organization: 'McMaster University',
	location: 'Hamilton, ON, Canada',
	dateRange: 'September 2022 – April 2026',
	detail: 'GPA: 3.96/4.0',
	points: [
		'Named to the Provost\'s Honour Roll for achieving a mark of 90% or higher in every course across an entire academic year.',
	],
};

export const leadership: AboutEntry = {
	title: 'Academic Manager',
	organization: 'McMaster Computer Science Society',
	location: 'Hamilton, ON, Canada',
	dateRange: 'January 2025 – April 2026',
	points: [
		'Planned and delivered 5+ study sessions each semester for lower-year students in demanding courses.',
		'Led group instruction for up to 50 students and offered one-on-one help, with grade improvements of up to 25%.',
	],
};

export const spokenLanguages: SpokenLanguage[] = [
	{ name: 'English', level: 'Native' },
	{ name: 'French', level: 'Fluent' },
];
