import { toastConfig } from "@components/atoms/ToastNotification";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { NavigationProvider } from "@contexts/NavigationContext";
import { SettingsProvider, useSettings } from "@contexts/SettingsContext";
import { ToastProvider } from "@contexts/ToastContext";
import { useDatabase } from "@hooks/useDatabase";
import { RootNavigator } from "@navigation/RootNavigator";
import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

/* AI-INSTRUCTION-START:app-providers
 * This is the root App component with provider setup.
 *
 * CUSTOMIZATION:
 * - Add your custom Context providers here
 * - Import and wrap additional providers as needed
 * - Keep providers in logical order (outer to inner)
 *
 * Example:
 * <YourProvider>
 *   <AppContent />
 * </YourProvider>
 *
 * OpenSpec Reference: specs/app-structure/spec.md
 * AI Instructions: openspec/ai-instructions/context-creation.md
 * AI-INSTRUCTION-END */

/**
 * AppContent - Main app content after providers are ready
 * Must be inside providers to access context
 */
function AppContent(): React.JSX.Element {
	const colorScheme = useColorScheme();
	const { state } = useSettings();

	// Initialize database
	const { isReady: dbReady } = useDatabase();

	/* AI-INSTRUCTION-START:app-initialization
	 * Add your app initialization logic here:
	 * - Initialize services
	 * - Load cached data
	 * - Set up analytics
	 * - Configure crash reporting
	 *
	 * Example:
	 * useEffect(() => {
	 *   YourService.initialize();
	 * }, []);
	 * AI-INSTRUCTION-END */

	return (
		<>
			<StatusBar
				barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
				backgroundColor="transparent"
				translucent
			/>
			<RootNavigator />
			<Toast config={toastConfig} />
		</>
	);
}

function App(): React.JSX.Element {
	return (
		<ErrorBoundary>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<SafeAreaProvider>
					<ToastProvider>
						<SettingsProvider>
							<NavigationProvider>
								<AppContent />
							</NavigationProvider>
						</SettingsProvider>
					</ToastProvider>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</ErrorBoundary>
	);
}

export default App;
