export const coursePrefixes = [
	'COMPSCI',
	'MATH',
	'STATS',
	'PHYSICS',
	'SFWRENG',
	'GERMAN',
	'SUSTAIN',
	'INNOVATE',
] as const;

export type CoursePrefix = (typeof coursePrefixes)[number];

export type GradePoint = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Term = 'fall' | 'winter' | 'spring' | 'summer';

/**
 * McMaster 12-point → 4.0 conversion.
 * Index is the 12-point grade (0 = F, 12 = A+).
 * Source: registrar.mcmaster.ca/exams-grades/grades
 */
export const GPA_4_SCALE = [0, 0.7, 1, 1.3, 1.7, 2, 2.3, 2.7, 3, 3.3, 3.7, 3.9, 4] as const;

/** Index is the 12-point grade (0 = F, 12 = A+). */
export const LETTER_GRADES = ['F', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'] as const;

export type Course = {
	prefix: CoursePrefix;
	code: string;
	name: string;
	/** Weight toward GPA (typically 3 or 6). Use 0 with grade 'COM'. */
	units: number;
	/** Integer 12-point grade, or 'COM' for a completed 0-unit course. */
	grade: GradePoint | 'COM';
	/** Set to 2 to span this term and the next: MT here, full grade and units there. */
	terms?: 2;
	/** Code on the following term when `terms` is 2. Defaults to `code`. */
	nextCode?: string;
};

export type Semester = {
	term: Term;
	courses: Course[];
};

export type AcademicYear = {
	/** Level I–IV */
	level: 1 | 2 | 3 | 4;
	/** First calendar year of the academic year, e.g. 2022 for 2022–2023. */
	startYear: number;
	semesters: Semester[];
};

export const academicYears: AcademicYear[] = [
	{
		level: 1,
		startYear: 2022,
		semesters: [
			{
				term: 'fall',
				courses: [
					{ prefix: 'COMPSCI', code: '1JC3', name: 'Introduction to Computational Thinking', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '1MD3', name: 'Introduction to Programming', units: 3, grade: 12 },
					{ prefix: 'GERMAN', code: '1Z06A', nextCode: '1Z06B', name: 'Beginner\'s Intensive German', units: 6, grade: 12, terms: 2 },
					{ prefix: 'MATH', code: '1B03', name: 'Linear Algebra I', units: 3, grade: 12 },
					{ prefix: 'MATH', code: '1ZA3', name: 'Engineering Mathematics I', units: 3, grade: 12 },
				],
			},
			{
				term: 'winter',
				courses: [
					{ prefix: 'COMPSCI', code: '1DM3', name: 'Discrete Mathematics for Computer Science', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '1XC3', name: 'Development Basics', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '1XD3', name: 'Introduction to Software Design Using Web Programming', units: 3, grade: 12 },
					{ prefix: 'MATH', code: '1ZB3', name: 'Engineering Mathematics II-A', units: 3, grade: 12 },
				],
			},
		],
	},
	{
		level: 2,
		startYear: 2023,
		semesters: [
			{
				term: 'fall',
				courses: [
					{ prefix: 'COMPSCI', code: '2C03', name: 'Data Structures and Algorithms', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '2GA3', name: 'Computer Architecture', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '2LC3', name: 'Logical Reasoning for Computer Science', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '2ME3', name: 'Introduction to Software Development', units: 3, grade: 12 },
					{ prefix: 'SUSTAIN', code: '1S03', name: 'Introduction to Sustainability', units: 3, grade: 12 },
					
				],
			},
			{
				term: 'winter',
				courses: [
					{ prefix: 'COMPSCI', code: '2AC3', name: 'Automata and Computability', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '2DB3', name: 'Databases', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '2SD3', name: 'Concurrent Systems', units: 3, grade: 11 },
					{ prefix: 'COMPSCI', code: '2XC3', name: 'Algorithms and Software Design', units: 3, grade: 12 },
					{ prefix: 'INNOVATE', code: '1Z03', name: 'Artificial Intelligence - Innovative Technologies', units: 3, grade: 12 },
				],
			},
		],
	},
	{
		level: 3,
		startYear: 2024,
		semesters: [
			{
				term: 'fall',
				courses: [
					{ prefix: 'COMPSCI', code: '3MI3', name: 'Principles of Programming Languages', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '3SH3', name: 'Operating Systems', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '4CR3', name: 'Applied Cryptography', units: 3, grade: 12 },
					{ prefix: 'MATH', code: '2X03', name: 'Advanced Calculus I', units: 3, grade: 10 },
					{ prefix: 'STATS', code: '2D03', name: 'Introduction to Probability', units: 3, grade: 12 },
				],
			},
			{
				term: 'winter',
				courses: [
					{ prefix: 'COMPSCI', code: '3AC3', name: 'Algorithms and Complexity', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '3DM3', name: 'Introduction to Data Mining', units: 3, grade: 10 },
					{ prefix: 'COMPSCI', code: '3N03', name: 'Computer Networks and Security', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '3TB3', name: 'Syntax-Based Tools and Compilers', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '4NL3', name: 'Natural Language Processing', units: 3, grade: 11 },
				],
			},
		],
	},
	{
		level: 4,
		startYear: 2025,
		semesters: [
			{
				term: 'fall',
				courses: [
					{ prefix: 'COMPSCI', code: '4AL3', name: 'Applications of Machine Learning', units: 3, grade: 11 },
					{ prefix: 'COMPSCI', code: '4O03', name: 'Linear Optimization', units: 3, grade: 12 },
					{ prefix: 'COMPSCI', code: '4ZP6A', nextCode: '4ZP6B', name: 'Capstone Project', units: 6, grade: 12, terms: 2 },
					{ prefix: 'MATH', code: '2Z03', name: 'Engineering Math III', units: 3, grade: 11 },
					{ prefix: 'PHYSICS', code: '1D03', name: 'Introductory Mechanics', units: 3, grade: 12 },
				],
			},
			{
				term: 'winter',
				courses: [
					{ prefix: 'COMPSCI', code: '4E03', name: 'Performance Analysis of Computer Systems', units: 3, grade: 10 },
					{ prefix: 'MATH', code: '2ZZ3', name: 'Engineering Math IV', units: 3, grade: 12 },
					{ prefix: 'SFWRENG', code: '3S03', name: 'Software Testing', units: 3, grade: 12 },
					{ prefix: 'STATS', code: '2MB3', name: 'Statistical Methods and Applications', units: 3, grade: 10 },
				],
			},
		],
	},
];

export type DisplayGrade = GradePoint | 'COM' | 'MT';

export type DisplayCourse = {
	prefix: CoursePrefix;
	code: string;
	name: string;
	units: number;
	grade: DisplayGrade;
};

export type GpaSummary = {
	units: number;
	gpa12: number | null;
	gpa4: number | null;
};

export type DisplaySemester = {
	term: Term;
	calendarYear: number;
	courses: DisplayCourse[];
	summary: GpaSummary;
};

export type DisplayYear = {
	level: AcademicYear['level'];
	startYear: number;
	semesters: DisplaySemester[];
	summary: GpaSummary;
};

export type Transcript = {
	years: DisplayYear[];
	overall: GpaSummary;
};

const TERM_ORDER: Term[] = ['fall', 'winter', 'spring', 'summer'];

const TERM_LABEL: Record<Term, string> = {
	fall: 'Fall',
	winter: 'Winter',
	spring: 'Spring',
	summer: 'Summer',
};

function semesterCalendarYear(startYear: number, term: Term): number {
	return term === 'fall' ? startYear : startYear + 1;
}

function nextSemester(startYear: number, term: Term): { startYear: number; term: Term } {
	if (term === 'fall') return { startYear, term: 'winter' };
	if (term === 'winter') return { startYear, term: 'spring' };
	if (term === 'spring') return { startYear, term: 'summer' };
	return { startYear: startYear + 1, term: 'fall' };
}

function semesterKey(startYear: number, term: Term): string {
	return `${startYear}:${term}`;
}

export function toGpa4(grade: GradePoint): number {
	return GPA_4_SCALE[grade];
}

export function letterGrade(grade: GradePoint): (typeof LETTER_GRADES)[number] {
	return LETTER_GRADES[grade];
}

export function weightedGpa(courses: DisplayCourse[]): GpaSummary {
	let units = 0;
	let points12 = 0;
	let points4 = 0;

	for (const course of courses) {
		if (course.grade === 'COM' || course.grade === 'MT' || course.units <= 0) continue;
		units += course.units;
		points12 += course.grade * course.units;
		points4 += toGpa4(course.grade) * course.units;
	}

	if (units === 0) {
		return { units: 0, gpa12: null, gpa4: null };
	}

	return {
		units,
		gpa12: points12 / units,
		gpa4: points4 / units,
	};
}

function collectCourses(semesters: DisplaySemester[]): DisplayCourse[] {
	return semesters.flatMap((semester) => semester.courses);
}

export function buildTranscript(years: AcademicYear[] = academicYears): Transcript {
	const buckets = new Map<string, DisplayCourse[]>();
	const meta = new Map<string, { startYear: number; term: Term; level: AcademicYear['level'] }>();

	const ensureBucket = (
		startYear: number,
		term: Term,
		level: AcademicYear['level'],
	): DisplayCourse[] => {
		const key = semesterKey(startYear, term);
		let bucket = buckets.get(key);
		if (!bucket) {
			bucket = [];
			buckets.set(key, bucket);
			meta.set(key, { startYear, term, level });
		}
		return bucket;
	};

	for (const year of years) {
		for (const semester of year.semesters) {
			const bucket = ensureBucket(year.startYear, semester.term, year.level);
			for (const course of semester.courses) {
				if (course.terms === 2 && course.grade !== 'COM') {
					bucket.push({
						prefix: course.prefix,
						code: course.code,
						name: course.name,
						units: 0,
						grade: 'MT',
					});
					const next = nextSemester(year.startYear, semester.term);
					const nextLevel = (next.startYear === year.startYear
						? year.level
						: Math.min(4, year.level + 1)) as AcademicYear['level'];
					ensureBucket(next.startYear, next.term, nextLevel).push({
						prefix: course.prefix,
						code: course.nextCode ?? course.code,
						name: course.name,
						units: course.units,
						grade: course.grade,
					});
					continue;
				}

				bucket.push({
					prefix: course.prefix,
					code: course.code,
					name: course.name,
					units: course.units,
					grade: course.grade,
				});
			}
		}
	}

	const grouped = new Map<number, DisplaySemester[]>();
	const levels = new Map<number, AcademicYear['level']>();

	const keys = [...buckets.keys()].sort((a, b) => {
		const left = meta.get(a)!;
		const right = meta.get(b)!;
		if (left.startYear !== right.startYear) return left.startYear - right.startYear;
		return TERM_ORDER.indexOf(left.term) - TERM_ORDER.indexOf(right.term);
	});

	for (const key of keys) {
		const { startYear, term, level } = meta.get(key)!;
		const courses = buckets.get(key) ?? [];
		if (!courses.length) continue;

		const semester: DisplaySemester = {
			term,
			calendarYear: semesterCalendarYear(startYear, term),
			courses,
			summary: weightedGpa(courses),
		};

		const list = grouped.get(startYear) ?? [];
		list.push(semester);
		grouped.set(startYear, list);
		if (!levels.has(startYear)) levels.set(startYear, level);
	}

	const displayYears: DisplayYear[] = [...grouped.entries()]
		.sort(([a], [b]) => a - b)
		.map(([startYear, semesters]) => ({
			level: levels.get(startYear) ?? 1,
			startYear,
			semesters,
			summary: weightedGpa(collectCourses(semesters)),
		}));

	return {
		years: displayYears,
		overall: weightedGpa(displayYears.flatMap((year) => collectCourses(year.semesters))),
	};
}

export function yearLabel(year: DisplayYear): string {
	return `Year ${year.level} · ${year.startYear}–${year.startYear + 1}`;
}

export function semesterLabel(semester: DisplaySemester): string {
	return `${TERM_LABEL[semester.term]} ${semester.calendarYear}`;
}

export function formatGpa12(value: number): string {
	return value.toFixed(1);
}

export function formatGpa4(value: number, digits = 2): string {
	return value.toFixed(digits);
}

export function formatCourseGpa4(grade: GradePoint): string {
	return formatGpa4(toGpa4(grade), 1);
}
