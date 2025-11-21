import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { Item } from '@models/Item';
import { AppSettings } from '@models/AppSettings';

/* AI-INSTRUCTION-START:database-setup
 * WatermelonDB database configuration and initialization.
 *
 * CUSTOMIZATION REQUIRED:
 * 1. Import your domain model classes (replace Item with your models)
 * 2. Add model classes to the modelClasses array
 * 3. Configure adapter options if needed (migrations, etc.)
 *
 * The JSI adapter is enabled for better performance with React Native New Architecture.
 *
 * OpenSpec Reference: specs/data-layer/spec.md
 * AI Instructions: openspec/ai-instructions/data-model-creation.md
 * AI-INSTRUCTION-END */

const adapter = new SQLiteAdapter({
	schema,
	jsi: true, // JSI for better performance with New Architecture
	onSetUpError: (error) => {
		console.error('Database setup error:', error);
	},
});

export const database = new Database({
	adapter,
	modelClasses: [
		Item, // Replace with your domain models
		AppSettings,
	],
});
