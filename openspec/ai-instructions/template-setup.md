# AI Instructions: Template Setup & Customization

## Overview

This guide helps AI assistants guide users through the initial template customization process. This is the FIRST thing users should do when they start with this template.

## Template Philosophy

This is a **production-ready React Native template** with:
- Pre-configured architecture (Atomic Design, Context API, WatermelonDB)
- Placeholder values that need customization
- AI instruction blocks throughout the codebase
- OpenSpec integration for spec-driven development

## When to Use This Guide

Use this guide when:
- User just cloned/downloaded the template
- User asks "how do I customize this template?"
- User asks "how do I change the app name/package name?"
- App fails to build with "component not registered" error
- User needs to prepare the template for their specific app

## Critical Customization Points

### 1. App Identity (HIGHEST PRIORITY)

These files MUST be updated for the app to work correctly:

#### app.json
```json
{
  "name": "AppTemplate",        // ← MUST be valid JS identifier, MUST match MainActivity.kt
  "displayName": "{{APP_NAME}}", // ← User-facing name (shown on home screen)
  "description": "...",          // ← Short description
  "version": "1.0.0",
  "author": "{{AUTHOR_NAME}}"    // ← Developer/company name
}
```

**Critical Rule**: `name` field MUST:
- Be a valid JavaScript identifier (no spaces, no special characters)
- Match exactly what `MainActivity.kt` returns in `getMainComponentName()`
- Match what `AppRegistry.registerComponent()` uses in `index.js`

#### package.json
```json
{
  "name": "app-template",        // ← npm package name (lowercase, hyphens OK)
  "description": "..."           // ← Update to match app
}
```

### 2. Android Package Name (SECOND PRIORITY)

The Android package name is used throughout the Android build system and MUST be:
- All lowercase
- Use dots only (no hyphens, underscores, special characters)
- Follow reverse domain notation (e.g., "com.companyname.appname")
- Consistent across ALL files below

**Files to Update:**

1. **android/app/build.gradle**
   ```gradle
   namespace "com.apptemplate"     // ← Your package name
   applicationId "com.apptemplate" // ← Must match namespace
   ```

2. **android/settings.gradle**
   ```gradle
   rootProject.name = 'AppTemplate' // ← Your app name
   ```

3. **android/app/src/main/res/values/strings.xml**
   ```xml
   <string name="app_name">{{APP_NAME}}</string>
   ```

4. **Directory Structure** (requires manual renaming)
   ```
   android/app/src/main/java/com/visara/
   └── Rename to: android/app/src/main/java/com/yourcompany/yourapp/
   ```

5. **All .kt and .java files in that directory**
   - MainActivity.kt: `package com.visara.app` → `package com.yourcompany.yourapp`
   - MainApplication.kt: Same package update + import statements
   - MemoryModule.java: Package declaration
   - MemoryPackage.java: Package declaration

### 3. Storage & Security IDs

**src/services/storage/mmkv.ts**
```typescript
export const storage = new MMKV({
  id: '{{PACKAGE_NAME}}-storage',        // ← Use your package name
  encryptionKey: '{{PACKAGE_NAME}}-encryption-key',
});
```

**src/services/security/EncryptionService.ts**
```typescript
const ENCRYPTION_KEY_ALIAS = "{{PACKAGE_NAME}}_encryption_key";
```

**⚠️ WARNING**: Changing these AFTER users have installed your app will make their data inaccessible!

### 4. Template Configuration

**template.config.json** - Complete all sections:
```json
{
  "template": {
    "configured": false  // ← Set to true when setup complete
  },
  "project": {
    "name": "...",       // ← Your app name
    "displayName": "...",
    "packageName": "...", // ← Your package name (e.g., com.myapp)
    "description": "..."
  },
  "features": {
    // Enable/disable features as needed
  },
  "branding": {
    // Customize colors and theme
  }
}
```

## Step-by-Step User Guidance

When a user asks to customize the template, guide them through this process:

### Step 1: Gather Information

Ask the user:
1. What is your app's name? (e.g., "TodoMaster", "MyFitnessApp")
2. What is your company/organization name? (e.g., "Acme Inc")
3. What package name do you want? (suggest: com.companyname.appname)

### Step 2: Update Critical Files (in order)

1. **app.json** - Update name, displayName, author
2. **package.json** - Update name, description
3. **android/app/build.gradle** - Update namespace, applicationId
4. **android/settings.gradle** - Update rootProject.name
5. **MainActivity.kt** - Update package declaration and getMainComponentName()
6. **MainApplication.kt** - Update package declaration
7. **strings.xml** - Update app_name
8. **Storage files** - Update MMKV and EncryptionService IDs

### Step 3: Directory Rename (Advanced)

If user wants to rename the Java package directory:
```bash
# From: android/app/src/main/java/com/visara/
# To: android/app/src/main/java/com/yourcompany/yourapp/

# This requires:
# 1. Creating new directory structure
# 2. Moving all .kt and .java files
# 3. Updating package declarations
# 4. Updating imports
```

**Alternative**: Leave directory as-is with AI instruction blocks - users can rename later if needed.

### Step 4: Verification

Have user run:
```bash
npm run typecheck  # Check for TypeScript errors
npm run android    # Build and run on Android
```

Common errors and fixes:
- **"AppTemplate has not been registered"**: app.json name doesn't match MainActivity.kt getMainComponentName()
- **Package errors**: Package name mismatch between build.gradle and Kotlin files
- **Build failures**: Gradle sync needed after package name changes

## Example Conversation Flow

```
User: "I want to customize this template for my todo app"

AI: "Great! Let me help you customize the template. First, I need some information:

1. What's your app's name? (This will be the component name)
2. What do you want displayed on the home screen? (Display name)
3. What's your desired package name? (e.g., com.yourname.todoapp)

Once you provide these, I'll update all the necessary files for you."

User: "Name: TodoMaster, Display: Todo Master, Package: com.acme.todomaster"

AI: "Perfect! I'll now update:
1. app.json with component name 'TodoMaster'
2. Android configuration with package 'com.acme.todomaster'
3. All storage and security identifiers
4. Template configuration

Let me make these changes..."

[Make all the updates]

AI: "All done! Here's what was updated:
- ✅ app.json configured
- ✅ Android build.gradle updated
- ✅ MainActivity configured
- ✅ Storage IDs updated

Next steps:
1. Run `npm run android` to build
2. Verify the app installs with correct name
3. Optionally rename the android/app/src/main/java/com/visara/ directory to match your package

Would you like me to help with anything else?"
```

## Common Pitfalls to Avoid

1. **Don't use special characters** in app.json name field
2. **Don't use uppercase** in Android package names
3. **Don't forget** to update MainActivity.kt's getMainComponentName()
4. **Don't change storage IDs** after users have installed the app
5. **Don't skip** the typecheck before building

## AI Instruction Blocks Reference

Throughout the codebase, you'll find AI instruction blocks like:

```typescript
/* AI-INSTRUCTION-START:identifier
 * Description of what needs customization
 *
 * CUSTOMIZATION REQUIRED:
 * - Specific instructions
 *
 * Example: ...
 * AI-INSTRUCTION-END */
```

**Use these blocks** to understand what needs customization and guide users appropriately.

## Related Documentation

- **openspec/project.md** - Full project documentation and workflows
- **README.md** - User-facing setup instructions
- **template.config.json** - Template configuration schema

## Template Update Strategy

When helping users:
1. **Prioritize correctness** over speed - wrong package names cause hard-to-debug issues
2. **Verify changes** - always run typecheck after updates
3. **Explain constraints** - help users understand why certain rules exist
4. **Provide examples** - show valid package names, component names
5. **Check consistency** - ensure all files use the same values

## Success Criteria

Template setup is complete when:
- ✅ App builds without errors
- ✅ App installs on device/emulator
- ✅ Home screen shows correct app name
- ✅ No "component not registered" errors
- ✅ TypeScript compilation passes
- ✅ User understands what was changed and why
