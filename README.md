# Based Native App Template

> A production-ready React Native template with AI-guided customization, comprehensive component library, and OpenSpec integration.

Build mobile apps **10x faster** with a battle-tested foundation, clean architecture, and intelligent AI assistance.

## ✨ Features

- ⚡️ **React Native 0.81.4** with New Architecture (JSI enabled)
- 🎨 **Atomic Design System** - Complete component library (atoms → molecules → organisms)
- 🎭 **Theme System** - Light/dark modes with design tokens
- 📦 **WatermelonDB** - Reactive, performant local database
- 🧭 **Navigation** - Bottom tabs with stack navigation ready
- 🤖 **AI-Guided Development** - OpenSpec integration for spec-driven workflows
- 🔧 **Modular Features** - Enable/disable features via configuration
- 📱 **Production Ready** - Performance optimized, tested patterns
- 🎯 **TypeScript Strict Mode** - Full type safety
- 🛠️ **Modern Tooling** - Biome for linting/formatting

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- NPM >= 9
- React Native development environment ([setup guide](https://reactnative.dev/docs/environment-setup))
- For iOS: Xcode 14+ and CocoaPods
- For Android: Android Studio and JDK 17

### Installation

1. **Clone the template**

```bash
git clone https://github.com/amitayks/react-native-template.git your-app-name
cd your-app-name
```

2. **Install dependencies**

```bash
npm install
```

3. **iOS: Install pods**

```bash
cd ios && pod install && cd ..
```

4. **Run the app**

```bash
# iOS
npm run ios

# Android
npm run android
```

5. **Setup wizard will launch automatically** on first run
   - Answer questions about your app
   - Or provide a pre-configured `template.config.json`
   - Wizard customizes the template for your project

## 📁 Project Structure

```
src/
├── components/          # UI Components (Atomic Design)
│   ├── atoms/          # Basic building blocks (Button, Icon, etc.)
│   ├── molecules/      # Simple combinations (SearchBar, etc.)
│   ├── organisms/      # Complex components (SettingsDrawer, etc.)
│   └── templates/      # Page-level templates
├── contexts/           # React Context providers
│   ├── SettingsContext.tsx
│   ├── NavigationContext.tsx
│   └── ToastContext.tsx
├── hooks/              # Custom React hooks
├── models/             # WatermelonDB models
│   ├── Item.ts        # Generic placeholder model
│   └── AppSettings.ts # App settings model
├── navigation/         # Navigation configuration
│   ├── RootNavigator.tsx
│   ├── MainNavigator.tsx
│   └── OnboardingNavigator.tsx
├── screens/            # Screen components
│   ├── Home/          # Home screen
│   ├── Settings/      # Settings screen
│   └── Onboarding/    # Onboarding flow
├── services/           # Business logic & services
│   ├── database/      # Database setup & repositories
│   ├── storage/       # MMKV key-value storage
│   ├── security/      # Encryption services
│   └── performance/   # Performance monitoring
├── theme/              # Design system
│   ├── colors.ts      # Color palette & design tokens
│   └── useTheme.ts    # Theme hook
├── utils/              # Utility functions
│   ├── animations/    # Animation configurations
│   ├── constants/     # App constants
│   ├── device/        # Device utilities
│   └── templateConfig.ts # Template configuration utility
└── shared-types/       # TypeScript type definitions

openspec/               # OpenSpec integration
├── project.md         # Project context & conventions
├── AGENTS.md          # AI assistant instructions
├── specs/             # Feature specifications
├── changes/           # Change proposals
└── ai-instructions/   # Detailed AI guidance docs

template.config.json   # Template configuration
```

## 🎨 Component Library

### Atoms (Basic Building Blocks)
- **Button** - Multiple variants (primary, secondary, text, icon, ghost)
- **Icon** - Material Design icons
- **Badge** - Status badges
- **ProgressBar** - Animated progress indicator
- **LabelTag** - Tags for categorization
- **ToastNotification** - Toast messages

### Molecules (Simple Combinations)
- **SearchBar** - Search input with icon
- **BottomNavContainer** - Generic bottom nav wrapper
- **DateSectionHeader** - Section headers for lists
- **ProcessingIndicator** - Processing status display
- **AnimatedBottomNav** - Animated bottom navigation

### Organisms (Complex Components)
- **SettingsDrawer** - Full-featured settings panel
- **HorizontalPageContainer** - Swipeable page container
- **ErrorBoundary** - Error handling wrapper

### Templates
- **OnboardingTemplate** - Multi-step onboarding flow

## 🔧 Configuration

### template.config.json

The heart of the template system. Controls project configuration, features, branding, and more.

```json
{
  "project": {
    "name": "{{APP_NAME}}",
    "packageName": "{{PACKAGE_NAME}}",
    "description": "{{APP_DESCRIPTION}}"
  },
  "features": {
    "ml": { "enabled": false },
    "camera": { "enabled": false },
    "search": { "enabled": false }
  },
  "branding": {
    "theme": {
      "primaryColor": "{{PRIMARY_COLOR}}",
      "secondaryColor": "{{SECONDARY_COLOR}}"
    }
  }
}
```

Placeholders `{{LIKE_THIS}}` are replaced during setup wizard.

### Feature Flags

Enable/disable modular features:

```typescript
import { isFeatureEnabled } from '@utils/templateConfig';

if (isFeatureEnabled('camera')) {
  // Camera feature code
}
```

## 🤖 AI-Guided Development

This template integrates with OpenSpec for spec-driven development with AI assistance.

### AI Instruction Blocks

Throughout the code, you'll find instruction blocks:

```typescript
/* AI-INSTRUCTION-START:instruction-id
 * Instructions for AI on how to customize this section
 * Detailed guidance in openspec/ai-instructions/instruction-id.md
 * OpenSpec Reference: specs/feature/spec.md
 * AI-INSTRUCTION-END */
```

These guide AI assistants (like Claude Code, GitHub Copilot, etc.) on proper customization.

### Working with AI

1. **AI reads** `openspec/project.md` for project context
2. **AI checks** `template.config.json` for configuration
3. **AI follows** instructions in `openspec/AGENTS.md`
4. **AI uses** OpenSpec for creating change proposals
5. **AI refers** to `openspec/ai-instructions/` for detailed guidance

### Example: Adding a Feature

```bash
# AI creates proposal
openspec/changes/add-user-profile/
├── proposal.md    # What and why
├── tasks.md       # Implementation checklist
└── specs/         # Delta changes to requirements
```

## 📱 Screens

### Home Screen
- Minimal functional placeholder
- Replace with your app's main functionality
- Uses Atomic Design components
- Theme-aware styling

### Settings Screen
- Theme selection (light/dark/system)
- Clear cache
- Delete all data
- Legal links (privacy, terms, licenses)
- App version display

### Onboarding
- Multi-step onboarding flow
- Permission requests
- Feature highlights
- Skip/complete functionality

## 🗄️ Database

### WatermelonDB
- Reactive, performant SQLite database
- JSI-powered for New Architecture
- Lazy loading and optimistic updates

### Models
- **Item** - Generic placeholder model (replace with your entities)
- **AppSettings** - Key-value app settings

### Usage
```typescript
import { database } from '@services/database/database';

const items = await database.get<Item>('{{TABLE_NAME}}').query().fetch();
```

## 🎭 Theming

### Design Tokens
```typescript
import { spacing, borderRadius, typography } from '@theme/colors';

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,        // 24px
    borderRadius: borderRadius.md, // 8px
  },
  text: {
    fontSize: typography.fontSize.md, // 16px
    fontWeight: typography.fontWeight.semibold, // 600
  },
});
```

### Theme Hook
```typescript
import { useTheme } from '@theme/useTheme';

function MyComponent() {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello</Text>
    </View>
  );
}
```

## 🔐 Release Signing Setup (Android)

Before building production releases, you MUST configure a release keystore:

### 1. Generate Release Keystore (One-Time Setup)

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore \
  -alias app-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**You will be prompted for:**
- Keystore password (remember this!)
- Your name
- Organizational unit
- Organization name
- City/Locality
- State/Province
- Two-letter country code

### 2. Update Keystore Configuration

Edit `android/gradle.properties` and update these values:

```properties
APP_UPLOAD_STORE_FILE=release.keystore
APP_UPLOAD_KEY_ALIAS=app-key-alias
APP_UPLOAD_STORE_PASSWORD=your_password_here
APP_UPLOAD_KEY_PASSWORD=your_password_here
```

### 3. Security Best Practices

**CRITICAL:**
- ✅ Keep the keystore file (`release.keystore`) backed up securely
- ✅ Never commit `gradle.properties` with real passwords to Git
- ✅ Use environment variables for CI/CD pipelines
- ⚠️ If you lose the keystore, you cannot update your published app
- ⚠️ Add `gradle.properties` to `.gitignore` if storing real passwords

**For CI/CD, use environment variables:**
```bash
export APP_UPLOAD_STORE_PASSWORD=$KEYSTORE_PASSWORD
export APP_UPLOAD_KEY_PASSWORD=$KEY_PASSWORD
```

## 🧪 Scripts

```bash
# Development
npm start              # Start Metro bundler
npm run android        # Run on Android (debug)
npm run ios            # Run on iOS (debug)

# Build
npm run apk            # Build Android APK (debug)
npm run aab            # Build Android App Bundle (release - REQUIRES KEYSTORE)

# Code Quality
npm run typecheck      # TypeScript type checking
npm run lint           # Lint code with Biome
npm run lint:fix       # Fix linting issues
npm run format         # Format code
npm test               # Run tests
```

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React Native | 0.81.4 | Core framework |
| React | 19.1.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| WatermelonDB | 0.28.0 | Database |
| React Navigation | 7.x | Navigation |
| Reanimated | 3.19.2 | Animations |
| MMKV | 3.3.3 | Key-value storage |
| Biome | 2.2.5 | Linter/Formatter |

**Full dependency list**: See `package.json`

**⚠️ Important**: Do NOT update package versions without testing thoroughly!

## 🏗️ Architecture

### Atomic Design
Components follow Atomic Design methodology for maximum reusability and maintainability.

### State Management
- React Context + useReducer for global state
- Local state for UI state
- WatermelonDB observables for reactive data

### Separation of Concerns
- **Components**: UI only, no business logic
- **Hooks**: Reusable logic
- **Services**: Business logic, API calls, data manipulation
- **Contexts**: Global state management
- **Repositories**: Database access layer

## 🚧 Customization Workflows

### Adding a Screen

1. Create screen component in `src/screens/YourScreen/`
2. Add to navigation in `src/navigation/MainNavigator.tsx`
3. Follow HomeScreen.tsx pattern
4. Add AI instruction blocks for future customization

### Creating a Data Model

1. Define model in `src/models/YourModel.ts`
2. Update schema in `src/services/database/schema.ts`
3. Register in `src/services/database/database.ts`
4. Create repository (optional but recommended)

See `openspec/ai-instructions/` for detailed guides.

## 📖 Documentation

- **openspec/project.md** - Comprehensive project context & conventions
- **openspec/AGENTS.md** - OpenSpec workflow guide
- **openspec/ai-instructions/** - Detailed customization guides
- **template.config.json** - Configuration schema

## 🤝 Contributing

This is a template repository. Once you clone it, it's yours to customize!

If you want to contribute improvements back to the template:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Credits

Built with:
- React Native
- WatermelonDB
- React Navigation
- And many other amazing open-source projects

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
cd android && ./gradlew clean && cd ..
cd ios && pod install && cd ..
npm start -- --reset-cache
```

### Type Errors
```bash
npm run typecheck
```

### Linting Issues
```bash
npm run lint:fix
```

### Database Issues
```bash
# Clear app data and restart
# iOS: Delete app and reinstall
# Android: Settings → Apps → Your App → Clear Data
```

## 📞 Support

- **Documentation**: [openspec/project.md](openspec/project.md)
- **Issues**: [GitHub Issues](https://github.com/amitayks/react-native-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/amitayks/react-native-template/discussions)

---

**Built with ❤️ for the React Native community**

Start building your app today! 🚀
