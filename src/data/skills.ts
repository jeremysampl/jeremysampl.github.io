import { ProjectId, projects, getProject, projectHref, projectThumbnailSrc } from './projects';
import { ExperienceId, getExperience, experienceDateRange, experienceHref, experiences } from './experience';
import {
	TechnologyCategory,
	TechnologyId,
	getTechnology,
	technologyIconSrc,
	technologyItemsHasTechnology,
} from './technologies';
import {
	type CourseId,
	type EducationId,
	educationName,
	courseId,
	courseHref,
	getCourse,
} from './courses';

export type SkillCategory = TechnologyCategory;

/**
 * Extra places a skill was used, besides projects that already list it.
 */
export type SkillUsage =
	| { kind: 'experience'; experienceId: ExperienceId }
	| { kind: 'course'; educationId: EducationId; courseId: CourseId }
	| { kind: 'site' }
	| { kind: 'general'; label: string; faIcon?: string };

export type SkillDefinition = {
	technologyId: TechnologyId;
	usages?: SkillUsage[];
};

export type Skill = {
	technologyId: TechnologyId;
	name: string;
	category: SkillCategory;
	icon?: string;
	iconSrc?: string;
	faIcon?: string;
	usages: ResolvedSkillUsageSource[];
};

type ResolvedSkillUsageSource =
	| { kind: 'project'; projectId: ProjectId }
	| SkillUsage;

export type ResolvedSkillUsage = {
	key: string;
	kind: 'project' | 'experience' | 'course' | 'site' | 'general';
	label: string;
	sublabel?: string;
	href?: string;
	thumbnail?: string;
	faIcon?: string;
};

export function resolveSkillUsage(usage: ResolvedSkillUsageSource): ResolvedSkillUsage {
	switch (usage.kind) {
		case 'project': {
			const project = getProject(usage.projectId);
			return {
				key: `project-${project.id}`,
				kind: 'project',
				label: project.name,
				sublabel: project.title,
				href: projectHref(project.id),
				thumbnail: projectThumbnailSrc(project.id),
			};
		}
		case 'experience': {
			const experience = getExperience(usage.experienceId);
			return {
				key: `experience-${experience.id}`,
				kind: 'experience',
				label: experience.company,
				sublabel: `${experience.role} · ${experienceDateRange(experience)}`,
				href: experienceHref(experience.id),
				thumbnail: `/images/experience/${experience.image}`,
			};
		}
		case 'site':
			return {
				key: 'site',
				kind: 'site',
				label: 'This website',
				href: '/',
				thumbnail: '/images/misc/js-logo.svg'
			};
		case 'course': {
			const course = getCourse(usage.educationId, usage.courseId);
			return {
				key: `course-${usage.educationId}-${usage.courseId}`,
				kind: 'course',
				label: educationName(usage.educationId),
				sublabel: `${course.prefix} ${course.code} · ${course.name}`,
				href: courseHref(usage.educationId, usage.courseId),
			};
		}
		case 'general':
			return {
				key: `general-${usage.label}`,
				kind: 'general',
				label: usage.label,
				faIcon: usage.faIcon,
			};
	}
}

function buildSkill(definition: SkillDefinition): Skill {
	const technology = getTechnology(definition.technologyId);
	const projectUsages = projects
		.filter((project) => technologyItemsHasTechnology(project.technologies, definition.technologyId))
		.map((project) => ({ kind: 'project' as const, projectId: project.id }));
	const experienceUsages = experiences
		.filter((experience) => technologyItemsHasTechnology(experience.technologies, definition.technologyId))
		.map((experience) => ({ kind: 'experience' as const, experienceId: experience.id }));
	const extraUsages = definition.usages ?? [];
	const courseUsages = extraUsages.filter((usage) => usage.kind === 'course');
	const otherUsages = extraUsages.filter(
		(usage) => usage.kind !== 'experience' && usage.kind !== 'course',
	);

	return {
		technologyId: technology.id,
		name: technology.name,
		category: technology.category,
		icon: technology.icon,
		iconSrc: technologyIconSrc(technology),
		faIcon: technology.faIcon,
		// Experience, then projects, then courses, then site/general.
		usages: [...experienceUsages, ...projectUsages, ...courseUsages, ...otherUsages],
	};
}

export const skillCategories: { id: SkillCategory | 'all'; label: string }[] = [
	{ id: 'all', label: 'All' },
	{ id: 'languages', label: 'Languages' },
	{ id: 'frameworks', label: 'Libraries & frameworks' },
	{ id: 'tools', label: 'Tools' },
];

/** Skills on the home page wheel. Other techs can still live in technologies.ts. */
const skillDefinitions: SkillDefinition[] = [
	// Languages
	{
		technologyId: 'python',
		usages: [
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '1MD3') },
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '2C03') },
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '2XC3') },
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '3TB3') },
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '4CR3') },
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '4NL3') },
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '4AL3') },
		],
	},
	{ technologyId: 'php' },
	{
		technologyId: 'html',
		usages: [
			{ kind: 'site' },
		],
	},
	{
		technologyId: 'css',
		usages: [
			{ kind: 'site' },
		],
	},
	{ technologyId: 'javascript' },
	{ technologyId: 'typescript', usages: [{ kind: 'site' }] },
	{
		technologyId: 'java',
		usages: [
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '2C03') },
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '2ME3') },
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('SFWRENG', '3S03') },
		],
	},
	{
		technologyId: 'bash',
		usages: [
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '1XC3') },
			{ kind: 'general', label: 'Scripts for personal projects', faIcon: 'terminal' },
		],
	},

	// Libraries & frameworks
	{ technologyId: 'django' },
	{ technologyId: 'wordpress' },
	{
		technologyId: 'react',
		usages: [
			{ kind: 'site' },
		],
	},
	{ technologyId: 'nextjs' },
	{ technologyId: 'nodejs' },
	{ technologyId: 'express' },
	{ technologyId: 'jquery' },
	{ technologyId: 'electron' },
	{ technologyId: 'tailwindcss' },
	{ technologyId: 'redux' },
	{ technologyId: 'zustand' },

	// Tools
	{
		technologyId: 'linux',
		usages: [
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '1XC3') },
			{ kind: 'course', educationId: 'mcmaster', courseId: courseId('COMPSCI', '3SH3') },
			{ kind: 'general', label: 'My primary everyday operating system', faIcon: 'desktop' },
		],
	},
	{
		technologyId: 'git',
		usages: [{ kind: 'general', label: 'Version control on every project & co-op', faIcon: 'cog' }],
	},
	{ technologyId: 'mysql' },
	{ technologyId: 'postgresql' },
	{ technologyId: 'rest-apis' },
	{ technologyId: 'cicd' },
	{ technologyId: 'docker' },
	{ technologyId: 'websocket' },
	{ technologyId: 'redis' },
	{ technologyId: 'yjs' },
	{
		technologyId: 'cursor',
		usages: [
			{ kind: 'general', label: 'Personal projects to improve development efficiency', faIcon: 'code' },
		],
	},
	{
		technologyId: 'codex',
		usages: [
			{ kind: 'general', label: 'Personal projects to improve development efficiency', faIcon: 'code' },
		],
	},
];

export const skills: Skill[] = skillDefinitions.map(buildSkill);
