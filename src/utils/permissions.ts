import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import type { Permission } from "react-native-permissions";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";

/**
 * Permission Types
 */
export enum PermissionType {
	CAMERA = "CAMERA",
	PHOTO_LIBRARY = "PHOTO_LIBRARY",
	STORAGE_READ = "STORAGE_READ",
	STORAGE_WRITE = "STORAGE_WRITE",
	NOTIFICATIONS = "NOTIFICATIONS",
}

/**
 * Permission Status
 */
export enum PermissionStatus {
	GRANTED = "GRANTED",
	DENIED = "DENIED",
	BLOCKED = "BLOCKED",
	UNAVAILABLE = "UNAVAILABLE",
}

/**
 * Permission Result
 */
export interface PermissionResult {
	status: PermissionStatus;
	canRequest: boolean;
	message: string;
}

/**
 * Map permission type to platform-specific permission
 */
function getPermission(type: PermissionType): Permission | string | null {
	if (Platform.OS === "android") {
		const androidVersion = Platform.Version as number;

		switch (type) {
			case PermissionType.CAMERA:
				return PermissionsAndroid.PERMISSIONS.CAMERA;
			case PermissionType.PHOTO_LIBRARY:
				// Android 13+ uses scoped storage
				return androidVersion >= 33
					? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
					: PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
			case PermissionType.STORAGE_READ:
				// Android 13+ uses scoped storage
				return androidVersion >= 33
					? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
					: PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
			case PermissionType.STORAGE_WRITE:
				// Android 13+ doesn't need WRITE permission for scoped storage
				// Files are automatically writable in app-specific directory
				return androidVersion >= 33
					? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES // Just need read access
					: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
			case PermissionType.NOTIFICATIONS:
				return PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
		}
	}

	// iOS permissions
	switch (type) {
		case PermissionType.CAMERA:
			return PERMISSIONS.IOS.CAMERA;
		case PermissionType.PHOTO_LIBRARY:
			return PERMISSIONS.IOS.PHOTO_LIBRARY;
		case PermissionType.NOTIFICATIONS:
			// Notifications permission not available in react-native-permissions for iOS
			// Use notifee library for notification permissions
			return null;
		default:
			return null;
	}
}

/**
 * Get user-friendly permission name
 */
function getPermissionName(type: PermissionType): string {
	switch (type) {
		case PermissionType.CAMERA:
			return "Camera";
		case PermissionType.PHOTO_LIBRARY:
			return "Photo Library";
		case PermissionType.STORAGE_READ:
			return "Storage Access";
		case PermissionType.STORAGE_WRITE:
			return "Storage Access";
		case PermissionType.NOTIFICATIONS:
			return "Notifications";
	}
}

/* AI-INSTRUCTION-START:permission-rationale
 * Permission rationale messages
 *
 * CUSTOMIZATION REQUIRED:
 * Replace these generic messages with your app-specific rationale
 * Explain clearly why your app needs each permission
 *
 * Note: These messages are shown to users when requesting permissions
 * Make them specific to your app's actual functionality
 *
 * AI-INSTRUCTION-END */

/**
 * Get permission rationale message
 */
function getPermissionRationale(type: PermissionType): string {
	const appName = "{{APP_NAME}}"; // Replace with getProjectInfo().displayName from templateConfig

	switch (type) {
		case PermissionType.CAMERA:
			return `${appName} needs camera access to capture photos and videos.`;
		case PermissionType.PHOTO_LIBRARY:
			return `${appName} needs access to your photo library to view and manage your media.`;
		case PermissionType.STORAGE_READ:
			return `${appName} needs storage access to read files and media from your device.`;
		case PermissionType.STORAGE_WRITE:
			return `${appName} needs storage access to save files and data on your device.`;
		case PermissionType.NOTIFICATIONS:
			return `${appName} uses notifications to keep you informed about important updates.`;
	}
}

/**
 * Check permission status
 */
export async function checkPermission(
	type: PermissionType,
): Promise<PermissionResult> {
	const permission = getPermission(type);

	if (!permission) {
		return {
			status: PermissionStatus.UNAVAILABLE,
			canRequest: false,
			message: `${getPermissionName(type)} permission is not available on this platform.`,
		};
	}

	try {
		if (Platform.OS === "android") {
			if (typeof permission === "string") {
				const result = await PermissionsAndroid.check(permission as any);
				if (result) {
					return {
						status: PermissionStatus.GRANTED,
						canRequest: false,
						message: `${getPermissionName(type)} access is granted.`,
					};
				}
				return {
					status: PermissionStatus.DENIED,
					canRequest: true,
					message: `${getPermissionName(type)} access is required.`,
				};
			}
		}

		// iOS - use react-native-permissions
		if (typeof permission === "string") {
			const result = await check(permission as any);
			switch (result) {
				case RESULTS.GRANTED:
					return {
						status: PermissionStatus.GRANTED,
						canRequest: false,
						message: `${getPermissionName(type)} access is granted.`,
					};
				case RESULTS.DENIED:
					return {
						status: PermissionStatus.DENIED,
						canRequest: true,
						message: `${getPermissionName(type)} access is required.`,
					};
				case RESULTS.BLOCKED:
					return {
						status: PermissionStatus.BLOCKED,
						canRequest: false,
						message: `${getPermissionName(type)} access is blocked. Please enable it in Settings.`,
					};
				case RESULTS.UNAVAILABLE:
					return {
						status: PermissionStatus.UNAVAILABLE,
						canRequest: false,
						message: `${getPermissionName(type)} is not available on this device.`,
					};
				default:
					return {
						status: PermissionStatus.DENIED,
						canRequest: true,
						message: `${getPermissionName(type)} access is required.`,
					};
			}
		}

		// Fallback if none of the conditions above matched
		return {
			status: PermissionStatus.DENIED,
			canRequest: true,
			message: "Could not determine permission status.",
		};
	} catch (error) {
		console.error(`Error checking ${type} permission:`, error);
		return {
			status: PermissionStatus.DENIED,
			canRequest: true,
			message: "Could not check permission status.",
		};
	}
}

/**
 * Request permission
 */
export async function requestPermission(
	type: PermissionType,
	showRationale = true,
): Promise<PermissionResult> {
	const permission = getPermission(type);

	console.log(`[Permissions] Requesting ${type}, permission string: ${permission}`);

	if (!permission) {
		return {
			status: PermissionStatus.UNAVAILABLE,
			canRequest: false,
			message: `${getPermissionName(type)} permission is not available on this platform.`,
		};
	}

	try {
		if (Platform.OS === "android") {
			if (typeof permission === "string") {
				console.log(`[Permissions] Calling PermissionsAndroid.request for ${permission}`);

				const result = await PermissionsAndroid.request(permission as any, {
					title: `${getPermissionName(type)} Permission`,
					message: getPermissionRationale(type),
					buttonNeutral: "Ask Me Later",
					buttonNegative: "Cancel",
					buttonPositive: "OK",
				});

				console.log(`[Permissions] Android request result for ${type}: ${result}`);

				if (result === PermissionsAndroid.RESULTS.GRANTED) {
					return {
						status: PermissionStatus.GRANTED,
						canRequest: false,
						message: `${getPermissionName(type)} access is granted.`,
					};
				}
				if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
					return {
						status: PermissionStatus.BLOCKED,
						canRequest: false,
						message: `${getPermissionName(type)} access is blocked. Please enable it in Settings.`,
					};
				}
				return {
					status: PermissionStatus.DENIED,
					canRequest: true,
					message: `${getPermissionName(type)} access was denied.`,
				};
			}
		}

		// iOS
		if (showRationale) {
			// Show rationale before requesting on iOS
			return new Promise((resolve) => {
				Alert.alert(
					`${getPermissionName(type)} Permission`,
					getPermissionRationale(type),
					[
						{
							text: "Cancel",
							style: "cancel",
							onPress: () => {
								resolve({
									status: PermissionStatus.DENIED,
									canRequest: true,
									message: `${getPermissionName(type)} access was denied.`,
								});
							},
						},
						{
							text: "Allow",
							onPress: async () => {
								const result = await request(permission as any);
								resolve(mapIOSResultToPermissionResult(type, result));
							},
						},
					],
				);
			});
		}

		const result = await request(permission as any);
		return mapIOSResultToPermissionResult(type, result);
	} catch (error) {
		console.error(`Error requesting ${type} permission:`, error);
		return {
			status: PermissionStatus.DENIED,
			canRequest: true,
			message: "Could not request permission.",
		};
	}
}

/**
 * Map iOS permission result to PermissionResult
 */
function mapIOSResultToPermissionResult(
	type: PermissionType,
	result: string,
): PermissionResult {
	switch (result) {
		case RESULTS.GRANTED:
			return {
				status: PermissionStatus.GRANTED,
				canRequest: false,
				message: `${getPermissionName(type)} access is granted.`,
			};
		case RESULTS.DENIED:
			return {
				status: PermissionStatus.DENIED,
				canRequest: true,
				message: `${getPermissionName(type)} access was denied.`,
			};
		case RESULTS.BLOCKED:
			return {
				status: PermissionStatus.BLOCKED,
				canRequest: false,
				message: `${getPermissionName(type)} access is blocked. Please enable it in Settings.`,
			};
		default:
			return {
				status: PermissionStatus.DENIED,
				canRequest: true,
				message: `${getPermissionName(type)} access was denied.`,
			};
	}
}

/**
 * Open app settings
 */
export async function openSettings(): Promise<void> {
	try {
		await Linking.openSettings();
	} catch (error) {
		console.error("Error opening settings:", error);
		Alert.alert(
			"Cannot Open Settings",
			"Please open your device Settings app manually and grant the necessary permissions.",
		);
	}
}

/**
 * Show permission denied alert with option to open settings
 */
export function showPermissionDeniedAlert(
	type: PermissionType,
	onCancel?: () => void,
): void {
	const appName = "{{APP_NAME}}";
	Alert.alert(
		`${getPermissionName(type)} Access Required`,
		`${appName} needs ${getPermissionName(type).toLowerCase()} access to function properly. Please grant permission in Settings.`,
		[
			{
				text: "Cancel",
				style: "cancel",
				onPress: onCancel,
			},
			{
				text: "Open Settings",
				onPress: openSettings,
			},
		],
	);
}

/**
 * Request multiple permissions
 */
export async function requestMultiplePermissions(
	types: PermissionType[],
): Promise<Map<PermissionType, PermissionResult>> {
	const results = new Map<PermissionType, PermissionResult>();

	for (const type of types) {
		const result = await requestPermission(type);
		results.set(type, result);
	}

	return results;
}

/**
 * Check if all required permissions are granted
 */
export async function checkAllPermissions(
	types: PermissionType[],
): Promise<boolean> {
	for (const type of types) {
		const result = await checkPermission(type);
		if (result.status !== PermissionStatus.GRANTED) {
			return false;
		}
	}
	return true;
}

/**
 * Get graceful degradation message for denied permission
 */
export function getGracefulDegradationMessage(
	type: PermissionType,
): string | null {
	const appName = "{{APP_NAME}}";
	switch (type) {
		case PermissionType.CAMERA:
			return "You can still use the app, but you won't be able to capture photos from within the app.";
		case PermissionType.PHOTO_LIBRARY:
			return `Without photo library access, ${appName} cannot access your photos. Please grant permission to use this feature.`;
		case PermissionType.STORAGE_READ:
			return `Without storage access, ${appName} cannot read files from your device. Please grant permission to use this feature.`;
		case PermissionType.STORAGE_WRITE:
			return `Without storage access, ${appName} cannot save data. Some features will be disabled until permission is granted.`;
		case PermissionType.NOTIFICATIONS:
			return "You won't receive notifications, but the app will continue to work normally.";
	}
}
