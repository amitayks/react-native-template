import { Icon } from "@components/atoms/Icon";
import { useNavigation, type PageIndex } from "@contexts/NavigationContext";
import { BorderRadius, Spacing, Typography } from "@theme/colors";
import { useTheme } from "@theme/useTheme";
import { useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	type ViewStyle,
	type LayoutChangeEvent,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	interpolate,
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
}

/**
 * BottomNavContainer - Floating bubble navigation bar
 *
 * Features:
 * - Floating pill-shaped design with shadow
 * - Positioned above bottom of screen
 * - Animated sliding indicator that follows page swipes
 * - Active state highlighting
 * - Integrates with NavigationContext for page switching
 */
export function BottomNavContainer({
	style,
	testID,
	scrollProgress,
}: BottomNavContainerProps) {
	const { colors, shadows } = useTheme();
	const { state, dispatch } = useNavigation();

	// Track button positions for indicator animation
	const [buttonLayouts, setButtonLayouts] = useState<
		Array<{ x: number; width: number; height: number }>
	>([]);

	const handlePress = (page: PageIndex) => {
		// Don't manually animate scrollProgress - let PagerView's onPageScroll handle it
		// This prevents the glitch where indicator jumps before page animates
		dispatch({ type: "SET_PAGE", payload: page });
	};

	// Track button layout for indicator positioning
	const handleButtonLayout = (index: number) => (event: LayoutChangeEvent) => {
		const { x, width, height } = event.nativeEvent.layout;
		setButtonLayouts((prev) => {
			const newLayouts = [...prev];
			newLayouts[index] = { x, width, height };
			return newLayouts;
		});
	};

	// Animated style for sliding indicator
	const indicatorStyle = useAnimatedStyle(() => {
		if (buttonLayouts.length < 2) {
			return { opacity: 0 };
		}

		const progress = scrollProgress.value;
		const button0 = buttonLayouts[0];
		const button1 = buttonLayouts[1];

		// Interpolate position and width between the two buttons
		const translateX = interpolate(
			progress,
			[0, 1],
			[button0.x, button1.x],
		);

		const width = interpolate(
			progress,
			[0, 1],
			[button0.width, button1.width],
		);

		const height = interpolate(
			progress,
			[0, 1],
			[button0.height, button1.height],
		);

		return {
			transform: [{ translateX }],
			width,
			height,
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
			{/* Animated sliding indicator */}
			<Animated.View
				style={[
					styles.indicator,
					{
						backgroundColor: "rgba(255, 255, 255, 0.15)",
					},
					indicatorStyle,
				]}
			/>

			{/* Navigation buttons */}
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
							color={isActive ? colors.text : colors.textSecondary}
						/>
						<Text
							style={[
								styles.label,
								{
									color: isActive ? colors.text : colors.textSecondary,
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
		bottom: Spacing.xl,
		left: "15%",
		right: "15%",
		height: 72,
		borderRadius: BorderRadius.full,
		borderWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingHorizontal: Spacing.md,
	},
	indicator: {
		position: "absolute",
		borderRadius: BorderRadius.full,
		left: 0,
		top: 0,
		bottom: 0,
		marginVertical: 8,
	},
	button: {
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		borderRadius: BorderRadius.full,
		alignItems: "center",
		justifyContent: "center",
		minWidth: 80,
		gap: 4,
		zIndex: 1,
	},
	label: {
		fontSize: Typography.fontSize.xs,
		fontWeight: Typography.fontWeight.medium,
		marginTop: 2,
	},
});
