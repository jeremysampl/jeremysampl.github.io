import { ProjectId, projects, projectHasTechnology, getProject, projectHref, projectThumbnailSrc } from './projects';
import { ExperienceId, getExperience, experienceDateRange, experienceHref } from './experience';
import {
	TechnologyCategory,
	TechnologyId,
	getTechnology,
	technologyIconSrc,
} from './technologies';

export type SkillCategory = TechnologyCategory;

/**
 * Extra places a skill was used, besides projects that already list it.
 */
export type SkillUsage =
	| { kind: 'experience'; experienceId: ExperienceId }
	| { kind: 'site' }
	| { kind: 'general'; label: string };

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
	kind: 'project' | 'experience' | 'site' | 'general';
	label: string;
	sublabel?: string;
	href?: string;
	thumbnail?: string;
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
			};
		}
		case 'site':
			return {
				key: 'site',
				kind: 'site',
				label: 'This website',
				href: '/',
			};
		case 'general':
			return {
				key: `general-${usage.label}`,
				kind: 'general',
				label: usage.label,
			};
	}
}

function buildSkill(definition: SkillDefinition): Skill {
	const technology = getTechnology(definition.technologyId);
	const projectUsages = projects
		.filter((project) => projectHasTechnology(project, definition.technologyId))
		.map((project) => ({ kind: 'project' as const, projectId: project.id }));

	return {
		technologyId: technology.id,
		name: technology.name,
		category: technology.category,
		icon: technology.icon,
		iconSrc: technologyIconSrc(technology),
		faIcon: technology.faIcon,
		usages: [...projectUsages, ...(definition.usages ?? [])],
	};
}

export const skillCategories: { id: SkillCategory | 'all'; label: string }[] = [
	{ id: 'all', label: 'All' },
	{ id: 'languages', label: 'Languages' },
	{ id: 'frameworks', label: 'Libraries & Frameworks' },
	{ id: 'tools', label: 'Databases & Tools' },
];

/** Skills on the home page wheel. Other techs can still live in technologies.ts. */
const skillDefinitions: SkillDefinition[] = [
	// Languages
	{ technologyId: 'python' },
	{
		technologyId: 'php',
		usages: [
			{ kind: 'experience', experienceId: 'watering-can-2024' },
			{ kind: 'experience', experienceId: 'watering-can-2023' },
		],
	},
	{
		technologyId: 'html',
		usages: [
			{ kind: 'site' },
			{ kind: 'experience', experienceId: 'watering-can-2024' },
			{ kind: 'experience', experienceId: 'watering-can-2023' },
		],
	},
	{
		technologyId: 'css',
		usages: [
			{ kind: 'site' },
			{ kind: 'experience', experienceId: 'watering-can-2024' },
			{ kind: 'experience', experienceId: 'watering-can-2023' },
		],
	},
	{
		technologyId: 'javascript',
		usages: [
			{ kind: 'site' },
			{ kind: 'experience', experienceId: 'watering-can-2024' },
			{ kind: 'experience', experienceId: 'watering-can-2023' },
		],
	},
	{ technologyId: 'typescript', usages: [{ kind: 'site' }] },
	{ technologyId: 'java' },

	// Libraries & Frameworks
	{
		technologyId: 'django',
		usages: [{ kind: 'general', label: 'Personal Python web app projects' }],
	},
	{
		technologyId: 'wordpress',
		usages: [
			{ kind: 'experience', experienceId: 'watering-can-2024' },
			{ kind: 'experience', experienceId: 'watering-can-2023' },
		],
	},
	{
		technologyId: 'react',
		usages: [
			{ kind: 'site' },
			{ kind: 'experience', experienceId: 'watering-can-2024' },
			{ kind: 'experience', experienceId: 'watering-can-2023' },
		],
	},
	{
		technologyId: 'nextjs',
		usages: [{ kind: 'general', label: 'Personal full-stack projects' }],
	},
	{
		technologyId: 'nodejs',
		usages: [{ kind: 'general', label: 'Backend services & tooling' }],
	},
	{
		technologyId: 'jquery',
		usages: [
			{ kind: 'experience', experienceId: 'watering-can-2024' },
			{ kind: 'experience', experienceId: 'watering-can-2023' },
		],
	},
	{
		technologyId: 'electron',
		usages: [{ kind: 'experience', experienceId: 'watering-can-2023' }],
	},

	// Databases & Tools
	{
		technologyId: 'mysql',
		usages: [
			{ kind: 'experience', experienceId: 'watering-can-2024' },
			{ kind: 'experience', experienceId: 'watering-can-2023' },
		],
	},
	{
		technologyId: 'postgresql',
		usages: [{ kind: 'general', label: 'Personal database-driven projects' }],
	},
	{
		technologyId: 'rest-apis',
		usages: [{ kind: 'experience', experienceId: 'watering-can-2024' }],
	},
	{
		technologyId: 'git',
		usages: [{ kind: 'general', label: 'Version control on every project & co-op' }],
	},
	{
		technologyId: 'cicd',
		usages: [
			{ kind: 'experience', experienceId: 'watering-can-2024' },
			{ kind: 'experience', experienceId: 'watering-can-2023' },
		],
	},
	{
		technologyId: 'docker',
		usages: [{ kind: 'general', label: 'Containerized personal projects' }],
	},
	{
		technologyId: 'websocket',
		usages: [{ kind: 'experience', experienceId: 'watering-can-2023' }],
	},
	{
		technologyId: 'redis',
		usages: [{ kind: 'general', label: 'Caching & realtime experimentation' }],
	},
];

export const skills: Skill[] = skillDefinitions.map(buildSkill);
