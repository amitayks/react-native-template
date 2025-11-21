import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "@screens/Home/HomeScreen";
import { SettingsScreen } from "@screens/Settings/SettingsScreen";
import { Icon } from "@components/atoms/Icon";
import { useTheme } from "@theme/useTheme";

/* AI-INSTRUCTION-START:main-navigator
 * This is the main navigation structure for your app.
 *
 * CUSTOMIZATION REQUIRED:
 * 1. Add your app's main screens to the tab navigator
 * 2. Configure tab bar icons and labels
 * 3. Add additional navigators if needed (Stack, Drawer, etc.)
 * 4. Customize tab bar styling to match your brand
 *
 * Current Setup:
 * - Bottom Tab Navigator with Home and Settings
 * - Theme-aware styling
 * - Icon-based navigation
 *
 * OpenSpec Reference: specs/navigation/spec.md
 * AI Instructions: openspec/ai-instructions/navigation-configuration.md
 * AI-INSTRUCTION-END */

export type MainTabParamList = {
	Home: undefined;
	Settings: undefined;
	/* AI-INSTRUCTION-START:tab-params
	 * Add your additional screens here:
	 * Example:
	 * Profile: { userId: string };
	 * Notifications: undefined;
	 * AI-INSTRUCTION-END */
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
	const { colors } = useTheme();

	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.textSecondary,
				tabBarStyle: {
					backgroundColor: colors.surface,
					borderTopColor: colors.border,
					borderTopWidth: 1,
				},
				/* AI-INSTRUCTION-START:tab-bar-options
				 * Customize tab bar appearance here:
				 * - Style, positioning, animations
				 * - Badge notifications
				 * - Custom tab bar component
				 * AI-INSTRUCTION-END */
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Icon name="home" color={color} size={size} />
					),
					tabBarLabel: "Home",
				}}
			/>

			{/* AI-INSTRUCTION-START:additional-tabs
			 * Add your additional tab screens here:
			 * Example:
			 * <Tab.Screen
			 *   name="Profile"
			 *   component={ProfileScreen}
			 *   options={{
			 *     tabBarIcon: ({ color, size }) => (
			 *       <Icon name="account" color={color} size={size} />
			 *     ),
			 *     tabBarLabel: "Profile",
			 *   }}
			 * />
			 * AI-INSTRUCTION-END */}

			<Tab.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Icon name="cog" color={color} size={size} />
					),
					tabBarLabel: "Settings",
				}}
			/>
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	/* AI-INSTRUCTION-START:navigator-styles
	 * Add custom styles for your navigator here if needed
	 * AI-INSTRUCTION-END */
});
