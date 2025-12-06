import { Icon } from "@components/atoms/Icon";
import { useNavigation, type PageIndex } from "@contexts/NavigationContext";
import { BorderRadius, Spacing, Typography } from "@theme/colors";
import { useTheme } from "@theme/useTheme";
import trigger from "@mhpdev/react-native-haptics";
import { useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	type ViewStyle,
	type LayoutChangeEvent,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useAnimatedStyle,
	interpolate,
	runOnJS,
	useSharedValue,
	type SharedValue,
} from "react-native-reanimated";

interface NavButton {
	icon: string;
	page: PageIndex;
	label: string;
}

const navButtons: NavButton[] = [
	{ icon: "home", page: 0, label: "Home" },
	{ icon: "cog", page: 1, label: "Settings" },
];

interface BottomNavContainerProps {
	style?: ViewStyle;
	testID?: string;
	/** Scroll progress from PagerView (0.0 = Home, 1.0 = Settings) */
	scrollProgress: SharedValue<number>;
	/** Flag to indicate indicator is being dragged (prevents onPageScroll interference) */
	isIndicatorDragging: SharedValue<boolean>;
	/** Target page after drag snap (-1 when not active) */
	dragSnapTarget: SharedValue<number>;
	/** Called when indicator drag ends, with the target page to snap to */
	onIndicatorDragEnd?: (page: PageIndex) => void;
}

/**
 * BottomNavContainer - Floating bubble navigation bar with draggable indicator
 *
 * Features:
 * - Floating pill-shaped design with shadow
 * - Animated sliding indicator that follows page swipes
 * - **Draggable indicator**: Pan gesture allows dragging the indicator to switch pages
 * - Active state highlighting for current page
 * - Integrates with NavigationContext for page switching
 *
 * ## Indicator Drag Behavior
 *
 * The indicator can be dragged horizontally to switch pages:
 * - Requires 10px minimum drag distance (allows taps to pass through to buttons)
 * - Indicator position updates in real-time during drag
 * - On release, snaps to nearest page (0 or 1 based on 0.5 threshold)
 * - Sets `isIndicatorDragging` flag to coordinate with SwipeableMainContainer
 *
 * @see SwipeableMainContainer for the scroll protection implementation
 */
export function BottomNavContainer({
	style,
	testID,
	scrollProgress,
	isIndicatorDragging,
	dragSnapTarget,
	onIndicatorDragEnd,
}: BottomNavContainerProps) {
	const { colors, shadows } = useTheme();
	const { state, dispatch } = useNavigation();

	const [buttonLayouts, setButtonLayouts] = useState<
		Array<{ x: number; width: number; height: number }>
	>([]);
	const dragStartProgress = useSharedValue(0);

	const handlePress = (page: PageIndex) => {
		trigger.impact("light");
		dispatch({ type: "SET_PAGE", payload: page });
	};

	const handleDragEnd = (targetPage: PageIndex) => {
		if (onIndicatorDragEnd) {
			onIndicatorDragEnd(targetPage);
		} else {
			dispatch({ type: "SET_PAGE", payload: targetPage });
		}
	};

	/** Pan gesture for dragging the indicator between nav buttons */
	const panGesture = Gesture.Pan()
		.minDistance(10)
		.onStart(() => {
			isIndicatorDragging.value = true;
			dragStartProgress.value = scrollProgress.value;
		})
		.onUpdate((event) => {
			if (buttonLayouts.length < 2) return;

			const button0X = buttonLayouts[0].x;
			const button1X = buttonLayouts[1].x;
			const totalDistance = button1X - button0X;
			if (totalDistance <= 0) return;

			const progressDelta = event.translationX / totalDistance;
			const newProgress = dragStartProgress.value + progressDelta;
			scrollProgress.value = Math.max(0, Math.min(1, newProgress));
		})
		.onEnd(() => {
			const targetPage: PageIndex = scrollProgress.value >= 0.5 ? 1 : 0;
			const startPage: PageIndex = dragStartProgress.value >= 0.5 ? 1 : 0;
			scrollProgress.value = targetPage;
			dragSnapTarget.value = targetPage; // Set target for scroll event filtering

			// If returning to same page, clear flags now (onPageSelected may not fire)
			if (targetPage === startPage) {
				isIndicatorDragging.value = false;
				dragSnapTarget.value = -1;
			}

			runOnJS(handleDragEnd)(targetPage);
		});

	const handleButtonLayout = (index: number) => (event: LayoutChangeEvent) => {
		const { x, width, height } = event.nativeEvent.layout;
		setButtonLayouts((prev) => {
			const newLayouts = [...prev];
			newLayouts[index] = { x, width, height };
			return newLayouts;
		});
	};

	const indicatorStyle = useAnimatedStyle(() => {
		if (buttonLayouts.length < 2) {
			return { opacity: 0 };
		}

		const progress = scrollProgress.value;
		const [button0, button1] = buttonLayouts;

		return {
			transform: [{ translateX: interpolate(progress, [0, 1], [button0.x, button1.x]) }],
			width: interpolate(progress, [0, 1], [button0.width, button1.width]),
			opacity: 1,
		};
	});

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: colors.surface,
					borderColor: colors.border,
				},
				shadows.lg,
				style,
			]}
			testID={testID}
		>
			{/* Draggable indicator */}
			<GestureDetector gesture={panGesture}>
				<Animated.View
					style={[
						styles.indicator,
						{ backgroundColor: colors.navIndicator },
						indicatorStyle,
					]}
				/>
			</GestureDetector>

			{navButtons.map((button, index) => {
				const isActive = state.currentPage === button.page;
				return (
					<TouchableOpacity
						key={button.page}
						style={styles.button}
						onPress={() => handlePress(button.page)}
						onLayout={handleButtonLayout(index)}
						activeOpacity={0.7}
						testID={`${testID}-${button.label.toLowerCase()}`}
					>
						<Icon
							name={button.icon}
							size="medium"
							color={isActive ? colors.buttonPrimary : colors.textSecondary}
						/>
						<Text
							style={[
								styles.label,
								{
									color: isActive ? colors.buttonPrimary : colors.textSecondary,
								},
							]}
						>
							{button.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: Spacing.lg,
		alignSelf: "center",
		height: 60,
		borderRadius: BorderRadius.full,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 3,
		gap: 8,
	},
	indicator: {
		position: "absolute",
		borderRadius: BorderRadius.full,
		left: 0,
		top: 3,
		bottom: 3,
		zIndex: 2, // Above buttons to receive pan gesture
	},
	button: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.xs,
		borderRadius: BorderRadius.full,
		alignItems: "center",
		justifyContent: "center",
		minWidth: 90,
		zIndex: 1,
	},
	label: {
		fontSize: Typography.fontSize.xs,
		fontWeight: Typography.fontWeight.medium,
	},
});
