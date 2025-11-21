import { appSchema, tableSchema } from "@nozbe/watermelondb";

/* AI-INSTRUCTION-START:database-schema
 * This is the WatermelonDB schema definition for your app's database.
 *
 * CUSTOMIZATION REQUIRED:
 * 1. Update version number when making schema changes
 * 2. Replace the placeholder '{{TABLE_NAME}}' table with your domain entities
 * 3. Add columns based on your Item model fields
 * 4. Create additional tables for other models
 * 5. Set up proper indexes for frequently queried columns
 * 6. Define foreign keys for relationships
 *
 * Schema Migration:
 * - When changing schema, increment version and add migration steps
 * - See WatermelonDB docs: https://watermelondb.dev/docs/Schema/migrations
 *
 * OpenSpec Reference: specs/data-layer/spec.md
 * AI Instructions: openspec/ai-instructions/data-model-creation.md
 * AI-INSTRUCTION-END */

export const schema = appSchema({
	version: 1,
	tables: [
		// Placeholder table - replace with your domain entities
		tableSchema({
			name: "{{TABLE_NAME}}", // e.g., 'tasks', 'products', 'users'
			columns: [
				{ name: "name", type: "string", isIndexed: true },
				{ name: "description", type: "string", isOptional: true },
				{ name: "status", type: "string", isIndexed: true },
				{ name: "created_at", type: "number" },
				{ name: "updated_at", type: "number" },
			],
		}),
		// App settings table - keep this for general app configuration
		tableSchema({
			name: "app_settings",
			columns: [
				{ name: "key", type: "string", isIndexed: true },
				{ name: "value", type: "string" },
				{ name: "updated_at", type: "number" },
			],
		}),
	],
});
