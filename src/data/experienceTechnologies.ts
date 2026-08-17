import type { TechnologyItem } from '../components/containers/TechnologyChips';
import type { ExperienceId } from './experience';
import type { TechnologyId } from './technologies';

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

export const experienceTechnologies: Record<ExperienceId, TechnologyItem[]> = {
	'watering-can-2024': [
		{
			id: 'react',
			featured: true,
			description: `Developed and maintained features for 3+ React applications, ensuring seamless integration
				with existing systems and providing an intuitive and efficient experience for staff.`,
			children: [
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
	'watering-can-2023': [
		{
			id: 'react',
			featured: true,
			description: `Developed and extended multiple React applications (the POS system and a new chits application)
				to replace outdated systems with modern, efficient solutions that integrate seamlessly with existing
				systems.`,
			children: [
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
};
