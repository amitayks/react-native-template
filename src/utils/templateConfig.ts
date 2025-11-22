import templateConfig from '../../template.config.json';

/* AI-INSTRUCTION-START:template-config
 * Template configuration utility for reading and managing feature flags.
 *
 * This utility provides access to template.config.json settings throughout the app.
 * Use this to conditionally enable/disable features, access branding config, etc.
 *
 * CUSTOMIZATION:
 * - Add helper functions for your custom config sections
 * - Implement config validation if needed
 * - Add type safety for config values
 *
 * OpenSpec Reference: specs/template-system/spec.md
 * AI Instructions: openspec/ai-instructions/feature-flags.md
 * AI-INSTRUCTION-END */

/**
 * Template configuration interface
 */
export interface TemplateConfig {
	template: {
		version: string;
		configured: boolean;
		configuredAt: string | null;
	};
	project: {
		name: string;
		displayName: string;
		packageName: string;
		bundleId: string;
		description: string;
		version: string;
	};
	features: {
		[key: string]: {
			enabled: boolean;
			includes?: string[];
			dependencies?: string[];
			files?: string[];
		};
	};
	branding: {
		theme: {
			primaryColor: string;
			secondaryColor: string;
			accentColor: string;
		};
		typography: {
			fontFamily: string;
		};
		logo: {
			path: string;
		};
	};
	domain: {
		context: string;
		primaryEntity: string;
		entities: Array<{
			name: string;
			table: string;
			fields: string[];
		}>;
	};
	openspec: {
		enabled: boolean;
		specs: Record<string, string>;
		aiInstructions: Record<string, string>;
	};
	wizard: {
		mode: 'interactive' | 'file';
		configFile: string | null;
		steps: string[];
	};
	metadata: {
		templateSource: string;
		docs: string;
		createdBy: string;
		license: string;
	};
}

/**
 * Get the full template configuration
 *
 * Note: The template.config.json may contain additional properties for documentation
 * (like $comment fields) that are not part of the TypeScript interface.
 * These are filtered out at runtime and don't affect type safety.
 */
export function getTemplateConfig(): TemplateConfig {
	return templateConfig as unknown as TemplateConfig;
}

/**
 * Check if the template has been configured
 */
export function isTemplateConfigured(): boolean {
	return templateConfig.template.configured;
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(featureName: string): boolean {
	const features = templateConfig.features as unknown as Record<string, { enabled: boolean }>;
	const feature = features[featureName];
	return feature?.enabled ?? false;
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): string[] {
	const features = templateConfig.features as unknown as Record<string, { enabled: boolean }>;
	return Object.entries(features)
		.filter(([key, feature]) => key !== 'comment' && typeof feature === 'object' && feature.enabled)
		.map(([name]) => name);
}

/**
 * Get project information
 */
export function getProjectInfo() {
	return templateConfig.project;
}

/**
 * Get branding configuration
 */
export function getBrandingConfig() {
	return templateConfig.branding;
}

/**
 * Get domain configuration
 */
export function getDomainConfig() {
	return templateConfig.domain;
}

/**
 * Check if template needs setup wizard
 * (template is not configured or has placeholder values)
 */
export function needsSetupWizard(): boolean {
	if (!templateConfig.template.configured) {
		return true;
	}

	// Check for placeholder values that weren't replaced
	const projectName = templateConfig.project.name;
	if (projectName.includes('{{') || projectName.includes('}}')) {
		return true;
	}

	return false;
}

/**
 * Get OpenSpec configuration
 */
export function getOpenSpecConfig() {
	return templateConfig.openspec;
}

/**
 * Get wizard configuration
 */
export function getWizardConfig() {
	return templateConfig.wizard;
}

/* AI-INSTRUCTION-START:template-config-helpers
 * Add your custom helper functions here:
 *
 * Example:
 * export function getApiConfig() {
 *   return templateConfig.api;
 * }
 *
 * export function isDebugMode(): boolean {
 *   return templateConfig.app.debugMode;
 * }
 * AI-INSTRUCTION-END */
