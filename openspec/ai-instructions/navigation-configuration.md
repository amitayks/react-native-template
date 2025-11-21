# AI Instructions: Navigation Configuration

## Overview
Guide for configuring and extending the navigation system.

## Adding Tab Screens

Edit `src/navigation/MainNavigator.tsx`:
```typescript
<Tab.Screen
	name="NewScreen"
	component={NewScreen}
	options={{
		tabBarIcon: ({ color, size }) => (
			<Icon name="icon-name" color={color} size={size} />
		),
		tabBarLabel: "Label",
	}}
/>
```

## Stack Navigation

For drill-down navigation, use Stack:
```typescript
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function YourNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="List" component={ListScreen} />
			<Stack.Screen name="Detail" component={DetailScreen} />
		</Stack.Navigator>
	);
}
```

## Type Safety
Update param lists:
```typescript
export type MainTabParamList = {
	Home: undefined;
	Settings: undefined;
	NewScreen: { id: string }; // With params
};
```

## Best Practices
- Keep navigation hierarchy simple
- Use tab navigation for top-level screens
- Use stack for drill-down flows
- Type all route params
- Test deep linking if implemented

