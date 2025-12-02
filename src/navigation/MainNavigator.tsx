import React from "react";
import { HomeScreen } from "@screens/Home/HomeScreen";
import { SettingsScreen } from "@screens/Settings/SettingsScreen";
import { SwipeableMainContainer } from "@components/organisms/SwipeableMainContainer";

/* AI-INSTRUCTION-START:main-navigator
 * This is the main navigation structure for your app.
 *
 * CUSTOMIZATION REQUIRED:
 * 1. Add your app's main screens to the swipeable container
 * 2. Customize page transitions and gestures
 * 3. Add additional navigators if needed (Stack, Modal, etc.)
 * 4. Integrate with NavigationContext for state management
 *
 * Current Setup:
 * - Swipeable horizontal navigation between Home and Settings
 * - Gesture-based page switching (swipe left/right)
 * - Syncs with NavigationContext for programmatic navigation
 *
 * OpenSpec Reference: specs/navigation/spec.md
 * AI Instructions: openspec/ai-instructions/navigation-configuration.md
 * AI-INSTRUCTION-END */

export function MainNavigator() {
	return (
		<SwipeableMainContainer
			homePage={<HomeScreen />}
			settingsPage={<SettingsScreen />}
		/>
	);
}
