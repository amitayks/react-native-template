import { Button } from "@components/atoms/Button";
import { Icon } from "@components/atoms/Icon";
import { useSettings, type Theme } from "@contexts/SettingsContext";
import { Spacing, Typography } from "@theme/colors";
import { useTheme } from "@theme/useTheme";
import { useCallback, useState, type ReactNode } from "react";
import {
	Alert,
	LayoutChangeEvent,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DeviceInfo from "react-native-device-info";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

/* AI-INSTRUCTION-START:settings-screen
 * This is the full-page settings screen for your application.
 *
 * CUSTOMIZATION REQUIRED:
 * 1. Add your app-specific settings toggles and options
 * 2. Implement handlers for settings changes
 * 3. Add settings sections relevant to your app
 * 4. Integrate with your SettingsContext for state management
 *
 * OpenSpec Reference: specs/screens/spec.md
 * AI Instructions: openspec/ai-instructions/settings-configuration.md
 * AI-INSTRUCTION-END */

interface CollapsibleSectionProps {
	title: string;
	children: ReactNode;
	defaultExpanded?: boolean;
}

function CollapsibleSection({
	title,
	children,
	defaultExpanded = true,
}: CollapsibleSectionProps) {
	const { colors } = useTheme();
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	// Animated values (use shared values for reactive animations)
	const contentHeight = useSharedValue(1000); // Start with large value to allow initial measurement
	const rotation = useSharedValue(defaultExpanded ? 180 : 0);
	const height = useSharedValue(defaultExpanded ? 1 : 0);

	// Toggle section
	const toggleSection = useCallback(() => {
		const newExpandedState = !isExpanded;
		setIsExpanded(newExpandedState);

		// Animate chevron rotation
		rotation.value = withTiming(newExpandedState ? 180 : 0, {
			duration: 300,
		});

		// Animate content height
		height.value = withTiming(newExpandedState ? 1 : 0, {
			duration: 300,
		});
	}, [isExpanded, rotation, height]);

	// Measure content height
	const handleContentLayout = useCallback(
		(event: LayoutChangeEvent) => {
			const { height: measuredHeight } = event.nativeEvent.layout;
			contentHeight.value = measuredHeight;
		},
		[contentHeight],
	);

	// Animated styles
	const chevronAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}));

	const contentAnimatedStyle = useAnimatedStyle(() => ({
		maxHeight: height.value * contentHeight.value,
		opacity: height.value,
	}));

	return (
		<View style={styles.section}>
			{/* Section Title with Chevron */}
			<TouchableOpacity
				style={styles.sectionHeader}
				onPress={toggleSection}
				activeOpacity={0.7}
			>
				<Text style={[styles.sectionTitle, { color: colors.text }]}>
					{title}
				</Text>
				<Animated.View style={chevronAnimatedStyle}>
					<Icon name="chevron-down" size="small" color={colors.textSecondary} />
				</Animated.View>
			</TouchableOpacity>

			{/* Hidden measurement container - always renders to measure content */}
			<View
				style={{
					position: "absolute",
					opacity: 0,
					pointerEvents: "none",
					zIndex: -1,
				}}
				onLayout={handleContentLayout}
			>
				{children}
			</View>

			{/* Collapsible Content */}
			<Animated.View style={[styles.collapsibleContent, contentAnimatedStyle]}>
				{children}
			</Animated.View>
		</View>
	);
}

export function SettingsScreen() {
	const { colors } = useTheme();
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
	const handleThemeChange = useCallback(
		(theme: Theme) => {
			settingsDispatch({ type: "SET_THEME", payload: theme });
		},
		[settingsDispatch],
	);

	// Handle Clear Cache
	const handleClearCache = useCallback(async () => {
		Alert.alert(
			"Clear Cache",
			"This will remove temporary files and cached data. Your photos and processed metadata will not be affected.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Clear",
					style: "destructive",
					onPress: async () => {
						try {
							/* AI-INSTRUCTION-START:cache-clearing
							 * Implement cache clearing logic for your app:
							 * - Clear temporary files
							 * - Clear cached images/data
							 * - Reset any in-memory caches
							 * AI-INSTRUCTION-END */
							console.log("Clearing cache...");
							await new Promise((resolve) => setTimeout(resolve, 500));
							console.log("Cache cleared successfully");
						} catch (error) {
							console.error("Failed to clear cache:", error);
						}
					},
				},
			],
		);
	}, []);

	// Handle Delete All Data
	const handleDeleteAllData = useCallback(async () => {
		Alert.alert(
			"Delete All Data",
			"This will permanently delete all processed metadata, app data, and reset permissions. Your original photos will not be affected. This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
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
							await new Promise((resolve) => setTimeout(resolve, 500));
							console.log("All data deleted successfully");
						} catch (error) {
							console.error("Failed to delete data:", error);
						}
					},
				},
			],
		);
	}, [settingsDispatch]);

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
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.background }]}
			edges={["top"]}
		>
			{/* Header */}
			<View style={styles.header}>
				<Text style={[styles.headerTitle, { color: colors.text }]}>
					Settings
				</Text>
			</View>

			{/* Content */}
			<ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
				{/* AI-INSTRUCTION-START:settings-sections
				 * Add your custom settings sections here
				 * Example:
				 * <View style={styles.section}>
				 *   <Text style={[styles.sectionTitle, { color: colors.text }]}>
				 *     Notifications
				 *   </Text>
				 *   <View style={styles.settingRow}>
				 *     <View style={styles.settingInfo}>
				 *       <Text style={[styles.settingLabel, { color: colors.text }]}>
				 *         Enable Notifications
				 *       </Text>
				 *     </View>
				 *     <Switch value={notifications} onValueChange={onNotificationsToggle} />
				 *   </View>
				 * </View>
				 * AI-INSTRUCTION-END */}

				{/* Appearance Section */}
				<CollapsibleSection title="Appearance" defaultExpanded={true}>
					<View style={styles.themeButtons}>
						<Button
							variant={
								settingsState.theme === "light" ? "primary" : "secondary"
							}
							size="small"
							onPress={() => handleThemeChange("light")}
							icon={<Icon name="white-balance-sunny" size="small" />}
							style={styles.themeButton}
						>
							Light
						</Button>
						<Button
							variant={settingsState.theme === "dark" ? "primary" : "secondary"}
							size="small"
							onPress={() => handleThemeChange("dark")}
							icon={<Icon name="weather-night" size="small" />}
							style={styles.themeButton}
						>
							Dark
						</Button>
						<Button
							variant={
								settingsState.theme === "system" ? "primary" : "secondary"
							}
							size="small"
							onPress={() => handleThemeChange("system")}
							icon={<Icon name="cellphone" size="small" />}
							style={styles.themeButton}
						>
							System
						</Button>
					</View>
				</CollapsibleSection>

				{/* Data Management Section */}
				<CollapsibleSection title="Data Management" defaultExpanded={false}>
					<Button
						variant="secondary"
						size="medium"
						onPress={handleClearCache}
						icon={<Icon name="broom" size="small" />}
						style={styles.actionButton}
					>
						Clear Cache
					</Button>

					<View style={{ marginTop: Spacing.sm }}>
						<Button
							variant="secondary"
							size="medium"
							onPress={handleDeleteAllData}
							icon={<Icon name="delete-forever" size="small" />}
							style={styles.actionButton}
						>
							Delete All Data
						</Button>
					</View>
				</CollapsibleSection>

				{/* Legal Section */}
				<View style={styles.lastSection}>
					<CollapsibleSection title="Legal" defaultExpanded={false}>
						<TouchableOpacity
							style={styles.legalRow}
							onPress={handlePrivacyPolicyPress}
						>
							<Text style={[styles.legalLabel, { color: colors.text }]}>
								Privacy Policy
							</Text>
							<Icon
								name="chevron-right"
								size="small"
								color={colors.textSecondary}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.legalRow}
							onPress={handleTermsOfServicePress}
						>
							<Text style={[styles.legalLabel, { color: colors.text }]}>
								Terms of Service
							</Text>
							<Icon
								name="chevron-right"
								size="small"
								color={colors.textSecondary}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.legalRow}
							onPress={handleLicensesPress}
						>
							<Text style={[styles.legalLabel, { color: colors.text }]}>
								Open Source Licenses
							</Text>
							<Icon
								name="chevron-right"
								size="small"
								color={colors.textSecondary}
							/>
						</TouchableOpacity>

						<View style={styles.versionRow}>
							<Text
								style={[styles.versionLabel, { color: colors.textSecondary }]}
							>
								Version {appVersion}
							</Text>
						</View>
					</CollapsibleSection>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.md,
	},
	headerTitle: {
		fontSize: Typography.fontSize.xxl,
		fontWeight: Typography.fontWeight.bold,
	},
	content: {
		flex: 1,
		paddingHorizontal: Spacing.md,
	},
	section: {
		// marginBottom: Spacing.xl,
	},
	lastSection: {
		marginBottom: Spacing.xxl,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: Spacing.md,
		paddingVertical: Spacing.md,
		// paddingHorizontal: Spacing.sm,
	},
	sectionTitle: {
		fontSize: Typography.fontSize.lg,
		fontWeight: Typography.fontWeight.bold,
	},
	collapsibleContent: {
		paddingHorizontal: Spacing.md,
		marginBottom: Spacing.sm,
		overflow: "hidden",
	},
	themeButtons: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	themeButton: {
		flex: 1,
	},
	actionButton: {
		width: "100%",
	},
	legalRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: Spacing.sm,
	},
	legalLabel: {
		fontSize: Typography.fontSize.md,
	},
	versionRow: {
		alignItems: "center",
		paddingVertical: Spacing.md,
		marginTop: Spacing.sm,
	},
	versionLabel: {
		fontSize: Typography.fontSize.sm,
	},
});
