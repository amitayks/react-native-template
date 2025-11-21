# AI Instructions: Theme Customization

## Overview
Guide for customizing the theme system including colors, typography, and design tokens.

## Color Customization

### Update template.config.json
```json
"branding": {
  "theme": {
    "primaryColor": "#6200EE",
    "secondaryColor": "#03DAC6",
    "accentColor": "#FF0266"
  }
}
```

### Apply to src/theme/colors.ts
```typescript
export const lightColors = {
	primary: '#6200EE', // From config
	secondary: '#03DAC6',
	accent: '#FF0266',
	// ... rest of colors
};
```

## Design Tokens

### Spacing (8px grid system)
```typescript
export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
};
```

### Border Radius
```typescript
export const borderRadius = {
	sm: 4,
	md: 8,
	lg: 12,
	xl: 16,
	full: 9999,
};
```

### Typography
```typescript
export const typography = {
	fontSize: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 20,
		xl: 24,
		xxl: 32,
	},
	fontWeight: {
		regular: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
	},
};
```

## Usage in Components
```typescript
const { colors, isDark } = useTheme();

<View style={[styles.container, { backgroundColor: colors.background }]}>
	<Text style={[styles.text, { color: colors.text }]}>Hello</Text>
</View>

const styles = StyleSheet.create({
	container: {
		padding: spacing.lg,
		borderRadius: borderRadius.md,
	},
	text: {
		fontSize: typography.fontSize.md,
		fontWeight: typography.fontWeight.medium,
	},
});
```

## Best Practices
- NEVER hardcode colors - always use theme
- Use design tokens for consistent spacing
- Test in both light and dark modes
- Verify accessibility contrast ratios
- Use semantic color names (not blue/red)

