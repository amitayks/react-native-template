import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@components/atoms/Button";
import { Icon } from "@components/atoms/Icon";
import { Spacing, Typography } from "@theme/colors";
import { useTheme } from "@theme/useTheme";
import { useSettings } from "@contexts/SettingsContext";
import { useToast } from "@contexts/ToastContext";
import {
	requestPermission,
	PermissionType,
	PermissionStatus,
	openSettings,
} from "@utils/permissions";

/* AI-INSTRUCTION-START:onboarding-customization
 * Minimal Onboarding Screen
 *
 * CUSTOMIZATION:
 * - Replace {{APP_NAME}} with your app's display name
 * - Update the description to match your app's purpose
 * - Change the icon to match your app's branding
 * - Modify permission requests based on your app's needs
 *
 * This is a single-page onboarding that requests necessary permissions
 * when the user taps "Get Started"
 *
 * AI-INSTRUCTION-END */

export function OnboardingScreen() {
	const { colors } = useTheme();
	const { dispatch } = useSettings();
	const { showError, showWarning, showInfo } = useToast();

	const handleGetStarted = async () => {
		// Request necessary permissions
		try {
			// 1. Request Storage Read permission (REQUIRED)
			const storageReadResult = await requestPermission(
				PermissionType.STORAGE_READ,
			);

			if (storageReadResult.status === PermissionStatus.BLOCKED) {
				showError(
					"Storage permission is permanently blocked. Please enable it in Settings.",
					{
						action: { text: "Open Settings", onPress: openSettings },
					},
				);
				return;
			}

			if (storageReadResult.status !== PermissionStatus.GRANTED) {
				showError("Storage access is required. Please grant permission.");
				return;
			}

			// 2. Request Storage Write permission (REQUIRED)
			const storageWriteResult = await requestPermission(
				PermissionType.STORAGE_WRITE,
			);

			if (storageWriteResult.status === PermissionStatus.BLOCKED) {
				showError(
					"Storage permission is permanently blocked. Please enable it in Settings to use {{APP_NAME}}.",
					{
						action: { text: "Open Settings", onPress: openSettings },
					},
				);
				return;
			}

			if (storageWriteResult.status !== PermissionStatus.GRANTED) {
				showError("Storage access is required. Please grant permission.");
				return;
			}

			// 3. Request Notifications permission (optional - warn but continue)
			const notificationsResult = await requestPermission(
				PermissionType.NOTIFICATIONS,
			);

			if (notificationsResult.status === PermissionStatus.BLOCKED) {
				showWarning(
					"Notifications are permanently blocked. You won't see progress updates.",
					{
						action: { text: "Open Settings", onPress: openSettings },
					},
				);
			} else if (notificationsResult.status === PermissionStatus.DENIED) {
				showInfo(
					"You won't receive notifications, but {{APP_NAME}} will work normally.",
				);
			}

			// All required permissions granted, complete onboarding
			dispatch({ type: "SET_ONBOARDING_COMPLETED", payload: true });
		} catch (error) {
			console.error("Permission request failed:", error);
			showError("Failed to request permissions. Please try again.");
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<View style={styles.content}>
				{/* App Icon */}
				<View
					style={[
						styles.iconContainer,
						{ backgroundColor: colors.buttonPrimary },
					]}
				>
					<Icon
						name="application"
						size={80}
						color={colors.buttonPrimaryText}
					/>
				</View>

				{/* App Name */}
				<Text style={[styles.title, { color: colors.text }]}>
					{`Welcome to {{APP_NAME}}`}
				</Text>

				{/* Description */}
				<Text style={[styles.description, { color: colors.textSecondary }]}>
					Get started with your new app
				</Text>
			</View>

			{/* Continue Button */}
			<View style={styles.footer}>
				<Button onPress={handleGetStarted} variant="primary" size="large">
					Get Started
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: Spacing.xl,
		paddingVertical: Spacing.xxl,
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: Spacing.xl,
	},
	iconContainer: {
		width: 140,
		height: 140,
		borderRadius: 70,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: Spacing.lg,
	},
	title: {
		fontSize: Typography.fontSize.xxxl,
		fontWeight: Typography.fontWeight.bold,
		textAlign: "center",
	},
	description: {
		fontSize: Typography.fontSize.lg,
		textAlign: "center",
		lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
	},
	footer: {
		paddingBottom: Spacing.xl,
	},
});
