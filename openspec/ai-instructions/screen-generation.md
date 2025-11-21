# AI Instructions: Screen Generation

## Overview
Guidelines for creating new screens in the Based Native App template following established patterns.

## Screen Structure
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@theme/useTheme';
import { spacing } from '@theme/colors';

export function YourScreen() {
	const { colors } = useTheme();

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<View style={styles.content}>
				<Text style={[styles.title, { color: colors.text }]}>
					Screen Title
				</Text>
				{/* Content here */}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		padding: spacing.lg,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: spacing.md,
	},
});
```

## Key Patterns
1. Use `SafeAreaView` from react-native-safe-area-context
2. Get colors from `useTheme()` hook
3. Use spacing tokens from `@theme/colors`
4. StyleSheet.create() for all styles
5. Named export (not default)

## Navigation Integration
Add to `src/navigation/MainNavigator.tsx`:
```typescript
<Tab.Screen
	name="YourScreen"
	component={YourScreen}
	options={{
		tabBarIcon: ({ color, size }) => (
			<Icon name="icon-name" color={color} size={size} />
		),
	}}
/>
```

## Best Practices
- Keep screens thin - move logic to hooks/services
- Use Context for global state
- Use local state for UI state
- Follow Atomic Design for components
- Add AI instruction blocks for customization points

