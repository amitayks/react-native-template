import { SettingsDrawer } from "@components/organisms/SettingsDrawer";
import { useSettings, type Theme } from "@contexts/SettingsContext";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";

/* AI-INSTRUCTION-START:settings-screen
 * This is the settings screen wrapper for your application.
 *
 * CUSTOMIZATION REQUIRED:
 * 1. Add your app-specific settings toggles and options
 * 2. Implement handlers for settings changes
 * 3. Add settings sections relevant to your app
 * 4. Integrate with your SettingsContext for state management
 *
 * The SettingsDrawer component provides the UI, while this screen
 * manages the business logic and state updates.
 *
 * OpenSpec Reference: specs/screens/spec.md
 * AI Instructions: openspec/ai-instructions/settings-configuration.md
 * AI-INSTRUCTION-END */

export function SettingsScreen() {
	const { state: settingsState, dispatch: settingsDispatch } = useSettings();

	// Get app version
	const appVersion = DeviceInfo.getVersion();

	/* AI-INSTRUCTION-START:settings-handlers
	 * Add handlers for your custom settings here.
	 *
	 * Example:
	 * const handleNotificationToggle = useCallback((enabled: boolean) => {
	 *   settingsDispatch({ type: 'TOGGLE_NOTIFICATIONS', payload: enabled });
	 * }, [settingsDispatch]);
	 * AI-INSTRUCTION-END */

	// Handle theme change
	const handleThemeChange = useCallback((theme: Theme) => {
		settingsDispatch({ type: "SET_THEME", payload: theme });
	}, [settingsDispatch]);

	// Handle Clear Cache
	const handleClearCache = useCallback(async () => {
		try {
			/* AI-INSTRUCTION-START:cache-clearing
			 * Implement cache clearing logic for your app:
			 * - Clear temporary files
			 * - Clear cached images/data
			 * - Reset any in-memory caches
			 * AI-INSTRUCTION-END */
			console.log("Clearing cache...");
			await new Promise(resolve => setTimeout(resolve, 500));
			console.log("Cache cleared successfully");
		} catch (error) {
			console.error("Failed to clear cache:", error);
		}
	}, []);

	// Handle Delete All Data
	const handleDeleteAllData = useCallback(async () => {
		try {
			/* AI-INSTRUCTION-START:data-deletion
			 * Implement complete data deletion for your app:
			 * - Clear all WatermelonDB data
			 * - Clear MMKV storage
			 * - Reset any app-specific state
			 * - Clear user preferences
			 * - Reset app to initial state
			 * AI-INSTRUCTION-END */
			console.log("Deleting all data...");
			settingsDispatch({ type: "RESET_SETTINGS" });
			await new Promise(resolve => setTimeout(resolve, 500));
			console.log("All data deleted successfully");
		} catch (error) {
			console.error("Failed to delete data:", error);
		}
	}, [settingsDispatch]);

	// Handle drawer close
	const handleDrawerClose = useCallback(() => {
		console.log("Settings drawer closed");
	}, []);

	// Legal section handlers
	const handlePrivacyPolicyPress = useCallback(() => {
		/* AI-INSTRUCTION-START:privacy-policy
		 * Open your privacy policy (webview or external browser)
		 * AI-INSTRUCTION-END */
		console.log("Privacy Policy pressed");
	}, []);

	const handleTermsOfServicePress = useCallback(() => {
		/* AI-INSTRUCTION-START:terms-of-service
		 * Open your terms of service (webview or external browser)
		 * AI-INSTRUCTION-END */
		console.log("Terms of Service pressed");
	}, []);

	const handleLicensesPress = useCallback(() => {
		/* AI-INSTRUCTION-START:licenses
		 * Open licenses screen showing third-party licenses
		 * AI-INSTRUCTION-END */
		console.log("Licenses pressed");
	}, []);

	return (
		<SettingsDrawer
			visible={true}
			onClose={handleDrawerClose}
			theme={settingsState.theme}
			onThemeChange={handleThemeChange}
			onClearCache={handleClearCache}
			onDeleteAllData={handleDeleteAllData}
			appVersion={appVersion}
			onPrivacyPolicyPress={handlePrivacyPolicyPress}
			onTermsOfServicePress={handleTermsOfServicePress}
			onLicensesPress={handleLicensesPress}
			style={styles.container}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
