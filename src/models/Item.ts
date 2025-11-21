import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';

/* AI-INSTRUCTION-START:data-model
 * This is a placeholder data model for demonstration purposes.
 *
 * CUSTOMIZATION REQUIRED:
 * - Replace 'Item' with your domain entity name (e.g., Task, Note, Product, User)
 * - Update table name to match your entity
 * - Add domain-specific fields using @field decorator
 * - Define associations with other models if needed
 * - Update the database schema.ts file accordingly
 *
 * OpenSpec Reference: specs/data-layer/spec.md
 * AI Instructions: openspec/ai-instructions/data-model-creation.md
 * AI-INSTRUCTION-END */

/**
 * Generic Item model placeholder
 *
 * Replace this with your domain-specific entity
 * Example: User, Product, Task, Note, etc.
 */
export class Item extends Model {
	static table = '{{TABLE_NAME}}'; // e.g., 'tasks', 'products', 'users'

	// Define associations with other models here
	// Example: { type: 'belongs_to', key: 'user_id' }
	static associations = {} as const;

	// Core fields - customize based on your requirements
	@field('name') name!: string;
	@field('description') description?: string;
	@field('status') status!: string;

	// Timestamps - keep these for tracking
	@readonly @date('created_at') createdAt!: Date;
	@readonly @date('updated_at') updatedAt!: Date;
}
