# Project Context: Based Native App Template

## Purpose

The Based Native App Template is a production-ready React Native template designed to dramatically accelerate mobile app development. It combines a comprehensive component library, robust architecture patterns, and AI-guided customization through OpenSpec integration.

### Goals
- Provide a clean, well-architected starting point for React Native apps
- Eliminate boilerplate setup and common architectural decisions
- Enable AI-assisted development through spec-driven workflows
- Support rapid customization while maintaining code quality
- Include best practices for performance, scalability, and maintainability

## Tech Stack

### Core Framework
- **React Native**: 0.81.4 with New Architecture (JSI enabled)
- **React**: 19.1.0 (latest)
- **TypeScript**: 5.9.3 (strict mode enabled)
- **Node**: >=18, NPM: >=9

### Navigation
- **@react-navigation/native**: 7.1.18
- **@react-navigation/bottom-tabs**: 7.4.8
- **@react-navigation/stack**: 7.4.9
- Simple bottom tab navigation (Home + Settings)
- Stack navigation for onboarding flow

### State Management
- **React Context API** with useReducer pattern
- No external state management libraries (Redux, MobX, Zustand)
- Contexts:
  - `SettingsContext`: Theme, preferences, app settings
  - `NavigationContext`: Navigation state management
  - `ToastContext`: Toast notifications

### Database & Storage
- **@nozbe/watermelondb**: 0.28.0 - Reactive SQLite database with JSI
- **react-native-mmkv**: 3.3.3 - Fast key-value storage
- **react-native-keychain**: 10.0.0 - Secure credential storage

### UI & Styling
- **Atomic Design Pattern**: atoms → molecules → organisms → templates
- **react-native-reanimated**: 3.19.2 - Performant animations
- **react-native-gesture-handler**: 2.28.0 - Gesture system
- **react-native-paper**: 5.14.5 (icons only)
- **react-native-vector-icons**: 10.3.0
- **react-native-safe-area-context**: 5.6.1
- **Theme System**: Design tokens with light/dark modes

### Utilities
- **@shopify/flash-list**: 2.1.0 - Optimized list rendering
- **react-native-fs**: 2.20.0 - File system access
- **react-native-device-info**: 14.1.1 - Device information
- **react-native-permissions**: 5.4.2 - Permission management
- **react-native-quick-crypto**: 0.7.17 - Cryptography
- **@notifee/react-native**: 9.1.8 - Local notifications

### Development Tools
- **@biomejs/biome**: 2.2.5 - Linter & Formatter (replaces ESLint/Prettier)
- **Jest**: 30.2.0 - Testing framework
- **@testing-library/react-native**: 13.3.3 - Component testing

## Project Conventions

### Code Style

#### Formatting
- **Formatter**: Biome (configured in `biome.json`)
- **Indentation**: Tabs
- **Quotes**: Double quotes
- **Line Length**: 120 characters recommended
- **Semicolons**: Required
- **Trailing Commas**: ES5 style

#### Naming Conventions
- **Components**: PascalCase (`Button.tsx`, `SettingsDrawer.tsx`)
- **Hooks**: camelCase with "use" prefix (`useTheme`, `useSettings`)
- **Contexts**: PascalCase with "Context" suffix (`SettingsContext`, `ToastContext`)
- **Types/Interfaces**: PascalCase (`ButtonProps`, `SettingsState`, `Theme`)
- **Constants**: UPPER_SNAKE_CASE in `utils/constants/`
- **Files**: Match component name exactly
- **Functions**: camelCase (`handlePress`, `calculateTotal`)

#### TypeScript Conventions
- Strict mode enabled in `tsconfig.json`
- Explicit function return types preferred
- Interface over type for object definitions
- Const assertions for immutable data
- Enum-like unions: `type Theme = "light" | "dark" | "system"`
- Avoid `any` - use `unknown` if type is truly unknown

### Architecture Patterns

#### Atomic Design
Components are organized by complexity:
- **atoms/**: Basic building blocks (Button, Icon, Badge, ProgressBar)
- **molecules/**: Simple combinations (SearchBar, BottomNavContainer, DateSectionHeader)
- **organisms/**: Complex components (SettingsDrawer, HorizontalPageContainer)
- **templates/**: Page-level templates (OnboardingTemplate)

#### State Management Pattern
- Use React Context + useReducer for global state
- Keep state as local as possible
- Context structure:
  ```typescript
  // 1. Define types
  interface State { ... }
  type Action = | { type: 'ACTION_ONE' } | { type: 'ACTION_TWO' };

  // 2. Create reducer
  function reducer(state: State, action: Action): State { ... }

  // 3. Create context
  const Context = createContext<{ state: State; dispatch: Dispatch<Action> }>(undefined);

  // 4. Create provider
  export function Provider({ children }) { ... }

  // 5. Create custom hook
  export function useContextName() { ... }
  ```

#### Component Patterns
- Functional components only (no class components)
- Use hooks for logic reuse
- `useCallback` for event handlers passed to children
- `useMemo` for expensive computations
- Props interface for all components
- Export named exports (not default) for components

#### File Organization
- One component per file
- Co-locate styles with components using `StyleSheet.create()`
- Index files for barrel exports
- Keep related files together

### Testing Strategy

#### Test Structure
- Unit tests for utilities and hooks
- Component tests for UI components
- Integration tests for user workflows
- Use `@testing-library/react-native` for component tests

#### Test Naming
- Test files: `ComponentName.test.tsx`
- Describe blocks: Component/function name
- Test cases: "should [expected behavior] when [condition]"

#### Coverage Goals
- Critical paths: 100%
- Utilities: 90%+
- Components: 70%+
- Overall: 60%+

### Git Workflow

#### Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `refactor/*`: Code improvements

#### Commit Conventions
- Use conventional commits format
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Format: `type(scope): message`
- Examples:
  - `feat(theme): add dark mode support`
  - `fix(navigation): resolve back button behavior`
  - `docs(readme): update installation instructions`

## Domain Context

### Template System
This is a **template project** designed to be cloned and customized. It uses several systems to enable rapid customization:

#### Placeholder System
Code contains placeholders that are replaced during setup:
- `{{APP_NAME}}` - Application name
- `{{APP_DISPLAY_NAME}}` - Display name on device
- `{{PACKAGE_NAME}}` - Android package name
- `{{BUNDLE_ID}}` - iOS bundle identifier
- `{{TABLE_NAME}}` - Database table names
- `{{PRIMARY_COLOR}}` - Theme primary color
- And more...

#### AI Instruction System
Special comment blocks guide AI assistants:
```typescript
/* AI-INSTRUCTION-START:instruction-id
 * Instructions for AI on how to customize this section
 * AI-INSTRUCTION-END */
```

These blocks:
- Mark customization points in the code
- Reference detailed instructions in `openspec/ai-instructions/`
- Reference OpenSpec requirements
- Guide AI assistants on proper customization approach

#### Feature Flag System
The `template.config.json` file controls:
- Which modular features are enabled/disabled
- Project metadata and branding
- Domain-specific configuration
- OpenSpec integration settings

#### OpenSpec Integration
- Spec-driven development workflow
- AI-guided customization
- Change proposals for new features
- Documentation of requirements and scenarios

### Current Entities

#### Item (Placeholder Model)
- Generic placeholder for domain entities
- Replace with actual business entities
- Located in `src/models/Item.ts`
- Database table: `{{TABLE_NAME}}`

#### AppSettings
- Application-wide settings storage
- Key-value pairs in database
- Used for persistent configuration
- Located in `src/models/AppSettings.ts`

## Important Constraints

### Technical Constraints
- **React Native Version**: Must stay on 0.81.4 until dependencies support 0.82+
- **New Architecture**: JSI is enabled, all code must be JSI-compatible
- **No Web Support**: This is a native mobile template only
- **TypeScript Required**: No JavaScript files, strict TypeScript
- **Minimum iOS**: 13.0
- **Minimum Android**: API 24 (Android 7.0)

### Design Constraints
- **Atomic Design**: Must follow atom → molecule → organism → template hierarchy
- **Theme System**: All colors must come from theme, no hardcoded colors
- **Design Tokens**: Use spacing, borderRadius, etc. from `theme/colors.ts`
- **Accessibility**: All interactive elements must be accessible

### Performance Constraints
- **Bundle Size**: Keep bundle size reasonable (< 50MB)
- **Startup Time**: App should launch in < 3 seconds
- **Memory**: Keep memory usage under 200MB on average
- **Lists**: Use FlashList for all lists with > 50 items
- **Images**: Optimize all images, use appropriate formats

### Template Constraints
- **No Domain Logic**: Template must remain domain-agnostic
- **Placeholder Values**: All customizable values must use `{{PLACEHOLDER}}` format
- **AI Instructions**: All customization points must have AI instruction blocks
- **Documentation**: All patterns must be documented for AI assistants
- **Package Versions**: Do NOT change package version numbers without testing

## External Dependencies

### Required Services
None - This template is designed to work offline and doesn't require external services.

### Optional Services
Users can integrate:
- **Analytics**: Firebase, Mixpanel, Amplitude
- **Crash Reporting**: Sentry, Crashlytics
- **Backend**: Any REST API, GraphQL, Firebase
- **Authentication**: Auth0, Firebase Auth, custom
- **Cloud Storage**: AWS S3, Google Cloud Storage, Firebase Storage

### Native Modules
- **Custom Native Modules**: Located in `src/native-modules/`
- **Turbo Modules**: Specs in `src/specs/`
- **Platform Code**: `android/` and `ios/` directories

## Template-Specific Conventions

### Adding New Features
1. Check if feature should be modular (optional)
2. If modular, add to `template.config.json` features section
3. Add AI instruction blocks at entry points
4. Create OpenSpec proposal if significant
5. Document in relevant AI instruction file
6. Test with feature enabled AND disabled

### Customizing for a Project
1. Run setup wizard (triggered automatically on first load)
2. Answer questions or provide config file
3. Wizard replaces placeholders
4. Wizard removes disabled features
5. Generate first OpenSpec change as example
6. Start building domain-specific features

### Working with AI Assistants
1. AI reads `openspec/project.md` (this file) first
2. AI checks `template.config.json` for configuration
3. AI follows instructions in `openspec/AGENTS.md`
4. AI uses spec-driven approach via OpenSpec
5. AI refers to `openspec/ai-instructions/` for detailed guidance
6. AI creates proposals for significant changes

### AI Instruction Reference

All AI instruction blocks in the codebase reference these files:

- **data-model-creation.md**: Creating WatermelonDB models and database schema
- **screen-generation.md**: Creating new screens following template patterns
- **theme-customization.md**: Customizing colors, fonts, and design tokens
- **navigation-configuration.md**: Adding screens to navigation
- **context-creation.md**: Creating new Context providers
- **settings-configuration.md**: Adding new app settings
- **feature-flags.md**: Working with the feature flag system
- **component-creation.md**: Creating atoms, molecules, organisms following Atomic Design

## Example Customization Workflows

### Workflow 1: Adding a New Screen

```markdown
## Goal
Add a "Profile" screen to the app

## Steps
1. **Create Screen Component**
   - File: `src/screens/Profile/ProfileScreen.tsx`
   - Follow HomeScreen.tsx pattern
   - Add AI instruction blocks for customization points
   - Use theme system for styling

2. **Add to Navigation**
   - Update `src/navigation/MainNavigator.tsx`
   - Add tab to bottom navigator
   - Choose appropriate icon
   - Add to type definitions

3. **Create Context (if needed)**
   - File: `src/contexts/ProfileContext.tsx`
   - Follow SettingsContext.tsx pattern
   - Add to App.tsx providers

4. **Add Data Model (if needed)**
   - File: `src/models/Profile.ts`
   - Update `src/services/database/schema.ts`
   - Update `src/services/database/database.ts`
   - Increment schema version if modifying existing DB

5. **Create OpenSpec Proposal**
   - `openspec/changes/add-profile-screen/proposal.md`
   - Document requirements, scenarios, implementation

6. **Test**
   - Navigation works
   - Data persists
   - Theme applies correctly
   - Follows template patterns
```

### Workflow 2: Customizing the Theme

```markdown
## Goal
Apply custom brand colors to the template

## Steps
1. **Update template.config.json**
   ```json
   "branding": {
     "theme": {
       "primaryColor": "#6200EE",
       "secondaryColor": "#03DAC6",
       "accentColor": "#FF0266"
     }
   }
   ```

2. **Apply to theme/colors.ts**
   - Update `colors.primary`, `colors.secondary`, `colors.accent`
   - Update derived colors if needed
   - Test in both light and dark modes

3. **Verify Application**
   - Check all buttons use primary color
   - Check accents and highlights
   - Verify contrast ratios for accessibility
   - Test throughout app screens

4. **Update Assets**
   - App icon with new colors
   - Splash screen
   - Any branded images
```

### Workflow 3: Creating a Data Model

```markdown
## Goal
Add a "Task" model for a todo app

## Steps
1. **Define Model**
   ```typescript
   // src/models/Task.ts
   export class Task extends Model {
     static table = 'tasks';

     @field('title') title!: string;
     @field('completed') completed!: boolean;
     @field('due_date') dueDate?: number;

     @readonly @date('created_at') createdAt!: Date;
     @readonly @date('updated_at') updatedAt!: Date;
   }
   ```

2. **Update Schema**
   ```typescript
   // src/services/database/schema.ts
   tableSchema({
     name: 'tasks',
     columns: [
       { name: 'title', type: 'string', isIndexed: true },
       { name: 'completed', type: 'boolean', isIndexed: true },
       { name: 'due_date', type: 'number', isOptional: true },
       { name: 'created_at', type: 'number' },
       { name: 'updated_at', type: 'number' },
     ],
   })
   ```

3. **Register Model**
   ```typescript
   // src/services/database/database.ts
   import { Task } from '@models/Task';

   modelClasses: [Task, AppSettings]
   ```

4. **Create Repository**
   ```typescript
   // src/services/database/TaskRepository.ts
   export class TaskRepository {
     async getAllTasks() { ... }
     async createTask(data) { ... }
     async updateTask(id, data) { ... }
     async deleteTask(id) { ... }
   }
   ```

5. **Update Schema Version**
   - Increment version in schema.ts
   - Add migration if modifying existing database
```

---

## Quick Reference

### Path Aliases
```typescript
@components/* → ./src/components/*
@screens/* → ./src/screens/*
@services/* → ./src/services/*
@contexts/* → ./src/contexts/*
@models/* → ./src/models/*
@hooks/* → ./src/hooks/*
@utils/* → ./src/utils/*
@shared-types/* → ./src/shared-types/*
@native-modules/* → ./src/native-modules/*
@specs/* → ./src/specs/*
@theme/* → ./src/theme/*
@navigation/* → ./src/navigation/*
```

### Common Commands
```bash
# Development
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios            # Run on iOS

# Build
npm run apk            # Build Android APK
npm run aab            # Build Android Bundle

# Code Quality
npm run typecheck      # TypeScript checking
npm run lint           # Lint with Biome
npm run lint:fix       # Fix linting issues
npm run format         # Format code
npm test               # Run tests

# Template
npm run wizard         # Run setup wizard
npm run validate-config # Validate template.config.json
```

### Key Files
- `template.config.json` - Template configuration
- `openspec/project.md` - This file (project context)
- `openspec/AGENTS.md` - AI assistant instructions
- `src/theme/colors.ts` - Design tokens
- `src/services/database/schema.ts` - Database schema
- `src/navigation/RootNavigator.tsx` - App navigation
- `package.json` - Dependencies (DO NOT change versions without testing)

---

**Remember**: This is a template. Everything marked with `{{PLACEHOLDERS}}` or AI instruction blocks is meant to be customized for your specific project. Follow the OpenSpec workflow for significant changes.
