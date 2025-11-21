# AI Instructions: Data Model Creation

## Overview
This guide provides instructions for creating WatermelonDB data models in the Based Native App template.

## Prerequisites
- Understand WatermelonDB decorators (`@field`, `@readonly`, `@date`, `@relation`)
- Know the app's domain entities
- Have database schema planning ready

## Step-by-Step Process

### 1. Define the Model Class

**Location**: `src/models/YourModel.ts`

```typescript
import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, relation } from '@nozbe/watermelondb/decorators';

export class YourModel extends Model {
	static table = 'your_table_name';

	// Define associations with other models
	static associations = {
		// Example: one-to-many relationship
		// related_items: { type: 'has_many', foreignKey: 'your_model_id' }
	} as const;

	// Define fields with decorators
	@field('title') title!: string;
	@field('description') description?: string; // Optional field
	@field('status') status!: string;
	@field('is_active') isActive!: boolean;
	@field('count') count!: number;

	// Timestamps - always include these
	@readonly @date('created_at') createdAt!: Date;
	@readonly @date('updated_at') updatedAt!: Date;
}
```

### 2. Update Database Schema

**Location**: `src/services/database/schema.ts`

```typescript
export const schema = appSchema({
	version: 1, // Increment when making changes to existing DB
	tables: [
		tableSchema({
			name: 'your_table_name',
			columns: [
				{ name: 'title', type: 'string', isIndexed: true }, // Index frequently queried fields
				{ name: 'description', type: 'string', isOptional: true },
				{ name: 'status', type: 'string', isIndexed: true },
				{ name: 'is_active', type: 'boolean' },
				{ name: 'count', type: 'number' },
				{ name: 'created_at', type: 'number' },
				{ name: 'updated_at', type: 'number' },
			],
		}),
		// ... other tables
	],
});
```

### 3. Register Model

**Location**: `src/services/database/database.ts`

```typescript
import { YourModel } from '@models/YourModel';

export const database = new Database({
	adapter,
	modelClasses: [
		YourModel, // Add your model here
		Item,
		AppSettings,
	],
});
```

### 4. Create Repository (Optional but Recommended)

**Location**: `src/services/database/YourModelRepository.ts`

```typescript
import { database } from './database';
import type { YourModel } from '@models/YourModel';

export class YourModelRepository {
	private collection = database.get<YourModel>('your_table_name');

	async getAll(): Promise<YourModel[]> {
		return await this.collection.query().fetch();
	}

	async getById(id: string): Promise<YourModel | null> {
		try {
			return await this.collection.find(id);
		} catch {
			return null;
		}
	}

	async create(data: {
		title: string;
		description?: string;
		status: string;
		isActive: boolean;
		count: number;
	}): Promise<YourModel> {
		return await database.write(async () => {
			return await this.collection.create((record) => {
				record.title = data.title;
				record.description = data.description;
				record.status = data.status;
				record.isActive = data.isActive;
				record.count = data.count;
			});
		});
	}

	async update(
		id: string,
		data: Partial<{
			title: string;
			description: string;
			status: string;
			isActive: boolean;
			count: number;
		}>,
	): Promise<YourModel> {
		const record = await this.collection.find(id);
		return await database.write(async () => {
			return await record.update((r) => {
				if (data.title !== undefined) r.title = data.title;
				if (data.description !== undefined) r.description = data.description;
				if (data.status !== undefined) r.status = data.status;
				if (data.isActive !== undefined) r.isActive = data.isActive;
				if (data.count !== undefined) r.count = data.count;
			});
		});
	}

	async delete(id: string): Promise<void> {
		const record = await this.collection.find(id);
		await database.write(async () => {
			await record.markAsDeleted();
		});
	}

	// Add query methods
	async getByStatus(status: string): Promise<YourModel[]> {
		return await this.collection
			.query(Q.where('status', status))
			.fetch();
	}

	async getActive(): Promise<YourModel[]> {
		return await this.collection
			.query(Q.where('is_active', true))
			.fetch();
	}
}

export const yourModelRepository = new YourModelRepository();
```

## Best Practices

### Field Types
- **string**: Text data (name, description, etc.)
- **number**: Integers, floats, timestamps
- **boolean**: True/false flags
- Use appropriate types for your data

### Indexing
- Index fields used in `where` clauses
- Index fields used for sorting
- Don't over-index (slows writes)

### Naming Conventions
- Table names: lowercase, plural, snake_case (`tasks`, `user_profiles`)
- Model class: PascalCase, singular (`Task`, `UserProfile`)
- Fields: camelCase in TypeScript, snake_case in database
- Foreign keys: `{model}_id` (e.g., `user_id`, `task_id`)

### Relationships
```typescript
// One-to-many: User has many Tasks
// In Task model:
static associations = {
	user: { type: 'belongs_to', key: 'user_id' }
} as const;

@relation('users', 'user_id') user!: Relation<User>;

// Many-to-many: Tasks and Tags
// Create join table: task_tags
// With task_id and tag_id columns
```

### Migrations
When changing schema of existing database:
1. Increment schema version
2. Add migration steps
3. Test migration thoroughly

```typescript
// src/services/database/migrations.ts
export const migrations = schemaMigrations({
	migrations: [
		{
			toVersion: 2,
			steps: [
				addColumns({
					table: 'your_table_name',
					columns: [
						{ name: 'new_field', type: 'string', isOptional: true },
					],
				}),
			],
		},
	],
});
```

## Common Patterns

### Soft Delete
```typescript
@field('deleted_at') deletedAt?: number;

async softDelete(id: string): Promise<void> {
	const record = await this.collection.find(id);
	await database.write(async () => {
		await record.update((r) => {
			r.deletedAt = Date.now();
		});
	});
}
```

### Timestamps
```typescript
// Always include created_at and updated_at
// WatermelonDB handles updated_at automatically
@readonly @date('created_at') createdAt!: Date;
@readonly @date('updated_at') updatedAt!: Date;
```

### Enums/Status Fields
```typescript
// Define type for type safety
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

@field('status') status!: TaskStatus;

// Validate in create/update
if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
	throw new Error('Invalid status');
}
```

## Checklist
- [ ] Model class created in `src/models/`
- [ ] Table schema added to `schema.ts`
- [ ] Model registered in `database.ts`
- [ ] Repository created (if needed)
- [ ] Fields have appropriate types
- [ ] Frequently queried fields are indexed
- [ ] Timestamps included
- [ ] Associations defined correctly
- [ ] Schema version incremented (if modifying existing)
- [ ] Migration added (if modifying existing)

## OpenSpec Reference
- See `specs/data-layer/spec.md` for requirements
- Create proposal for new entities: `openspec/changes/add-{entity}/`

## Example Use in Components
```typescript
import { yourModelRepository } from '@services/database/YourModelRepository';

function MyComponent() {
	const [items, setItems] = useState<YourModel[]>([]);

	useEffect(() => {
		loadItems();
	}, []);

	async function loadItems() {
		const data = await yourModelRepository.getAll();
		setItems(data);
	}

	async function handleCreate() {
		await yourModelRepository.create({
			title: 'New Item',
			status: 'pending',
			isActive: true,
			count: 0,
		});
		await loadItems();
	}

	return (
		// ... render items
	);
}
```

---

**Remember**: Test database changes thoroughly. Migrations are one-way operations!
