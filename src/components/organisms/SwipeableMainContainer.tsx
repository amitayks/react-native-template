import { type PageIndex, useNavigation } from "@contexts/NavigationContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import PagerView, {
	type PagerViewOnPageScrollEventData,
	type PagerViewOnPageSelectedEventData,
} from "react-native-pager-view";
import { useSharedValue } from "react-native-reanimated";
import { BottomNavContainer } from "@components/molecules/BottomNavContainer";

interface SwipeableMainContainerProps {
	/** Content for page 0 (Home) */
	homePage: React.ReactNode;
	/** Content for page 1 (Settings) */
	settingsPage: React.ReactNode;
	style?: ViewStyle;
	testID?: string;
}

/**
 * SwipeableMainContainer enables horizontal swipe navigation between Home and Settings pages
 *
 * Features:
 * - Native PagerView for smooth, performant swiping
 * - Syncs with NavigationContext for state management
 * - Supports both swipe gestures and programmatic navigation
 */
export function SwipeableMainContainer({
	homePage,
	settingsPage,
	style,
	testID,
}: SwipeableMainContainerProps) {
	const { state, dispatch } = useNavigation();
	const pagerRef = useRef<PagerView>(null);
	const [currentPageLocal, setCurrentPageLocal] = useState(state.currentPage);

	// Shared value for smooth indicator animation (0 = Home, 1 = Settings)
	const scrollProgress = useSharedValue(state.currentPage);

	// Sync external navigation state with pager
	useEffect(() => {
		if (pagerRef.current && state.currentPage !== currentPageLocal) {
			pagerRef.current.setPage(state.currentPage);
			setCurrentPageLocal(state.currentPage);
			// Don't set scrollProgress.value here - let onPageScroll handle it
			// This prevents the indicator from jumping before the page animation starts
		}
	}, [state.currentPage, currentPageLocal]);

	// Handle real-time scroll tracking for smooth indicator animation
	const handlePageScroll = useCallback(
		(event: { nativeEvent: PagerViewOnPageScrollEventData }) => {
			const { position, offset } = event.nativeEvent;
			// Calculate precise scroll progress (0.0 to 1.0)
			scrollProgress.value = position + offset;
		},
		[scrollProgress],
	);

	// Handle page selection from PagerView
	const handlePageSelected = useCallback(
		(event: { nativeEvent: PagerViewOnPageSelectedEventData }) => {
			const newPage = event.nativeEvent.position as PageIndex;
			setCurrentPageLocal(newPage);

			// Update navigation state if page changed
			if (newPage !== state.currentPage) {
				dispatch({ type: "SET_PAGE", payload: newPage });
			}
		},
		[state.currentPage, dispatch],
	);

	return (
		<View style={[styles.container, style]} testID={testID}>
			{/* Native PagerView for optimal performance */}
			<PagerView
				ref={pagerRef}
				style={styles.pagerView}
				initialPage={state.currentPage}
				onPageScroll={handlePageScroll}
				onPageSelected={handlePageSelected}
				orientation="horizontal"
				overdrag={Platform.OS === "ios"}
				overScrollMode={Platform.OS === "android" ? "always" : "never"}
				offscreenPageLimit={1}
				pageMargin={0}
				scrollEnabled={true}
			>
				{/* Page 0: Home */}
				<View key="home" style={styles.page} collapsable={false}>
					{homePage}
				</View>

				{/* Page 1: Settings */}
				<View key="settings" style={styles.page} collapsable={false}>
					{settingsPage}
				</View>
			</PagerView>

			{/* Floating Bottom Navigation Bar with animated indicator */}
			<BottomNavContainer
				testID={`${testID}-nav`}
				scrollProgress={scrollProgress}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	pagerView: {
		flex: 1,
	},
	page: {
		flex: 1,
		width: "100%",
	},
});
