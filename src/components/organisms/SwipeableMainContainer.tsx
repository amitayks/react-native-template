import { type PageIndex, useNavigation } from "@contexts/NavigationContext";
import { useCallback, useEffect, useRef } from "react";
import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import PagerView, {
	type PagerViewOnPageSelectedEventData,
} from "react-native-pager-view";
import Animated, {
	useSharedValue,
	useEvent,
	useHandler,
} from "react-native-reanimated";
import { BottomNavContainer } from "@components/molecules/BottomNavContainer";

/**
 * Animated PagerView for worklet-based scroll handling.
 * This allows onPageScroll to run on UI thread, syncing with gestures.
 */
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

/**
 * Custom hook for handling PagerView scroll events as worklets (UI thread).
 * This solves timing issues between gesture handlers and scroll events.
 * @see https://github.com/callstack/react-native-pager-view/blob/master/example/src/ReanimatedOnPageScrollExample.tsx
 */
function usePagerScrollHandler(
	handlers: { onPageScroll?: (event: { offset: number; position: number }) => void },
	dependencies?: unknown[]
) {
	const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);

	return useEvent(
		(event: { eventName: string; offset: number; position: number }) => {
			"worklet";
			const { onPageScroll } = handlers;
			if (onPageScroll && event.eventName.endsWith("onPageScroll")) {
				onPageScroll(event);
			}
		},
		["onPageScroll"],
		doDependenciesDiffer
	);
}

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
 * - Draggable bottom nav indicator with bidirectional sync
 *
 * ## Indicator Drag Implementation
 *
 * The bottom nav indicator can be dragged to switch pages. The key to smooth coordination
 * is running both gesture handlers and scroll events on the **same UI thread** using worklets:
 *
 * 1. **AnimatedPagerView**: Created via `Animated.createAnimatedComponent(PagerView)`
 * 2. **usePagerScrollHandler**: Custom hook that wraps scroll events as worklets
 * 3. **UI thread sync**: Both pan gesture and scroll handler run on UI thread,
 *    so `isIndicatorDragging` flag checks work reliably without bridge timing issues
 * 4. **Cleanup**: `onPageSelected` clears the drag flag when transition completes
 *
 * @see https://github.com/callstack/react-native-pager-view/blob/master/example/src/ReanimatedOnPageScrollExample.tsx
 */
export function SwipeableMainContainer({
	homePage,
	settingsPage,
	style,
	testID,
}: SwipeableMainContainerProps) {
	const { state, dispatch } = useNavigation();
	const pagerRef = useRef<PagerView>(null);
	const currentPageLocalRef = useRef(state.currentPage);

	// Shared value for smooth indicator animation (0 = Home, 1 = Settings)
	const scrollProgress = useSharedValue(state.currentPage);

	// Track if indicator is being dragged (shared value for instant sync between threads)
	const isIndicatorDragging = useSharedValue(false);

	// Track the target page after a drag snap (to filter out conflicting scroll events)
	const dragSnapTarget = useSharedValue(-1); // -1 means no active drag snap

	// Sync external navigation state with pager
	useEffect(() => {
		if (pagerRef.current && state.currentPage !== currentPageLocalRef.current) {
			pagerRef.current.setPage(state.currentPage);
			currentPageLocalRef.current = state.currentPage;
			// Don't set scrollProgress.value here - let onPageScroll handle it
			// This prevents the indicator from jumping before the page animation starts
		}
	}, [state.currentPage]);

	/**
	 * Worklet-based scroll handler - runs on UI thread for perfect sync with gestures.
	 * This eliminates timing issues between drag gestures and scroll events.
	 */
	const scrollHandler = usePagerScrollHandler({
		onPageScroll: (e) => {
			"worklet";
			// Skip while indicator is being dragged
			if (isIndicatorDragging.value) {
				return;
			}

			const newProgress = e.offset + e.position;

			// If we have an active drag snap target, only accept events near that target
			// This filters out the "catch-up" events from PagerView animation
			if (dragSnapTarget.value !== -1) {
				const distanceToTarget = Math.abs(newProgress - dragSnapTarget.value);
				if (distanceToTarget > 0.1) {
					return; // Ignore events far from target
				}
			}

			scrollProgress.value = newProgress;
		},
	});

	/** Handles page selection - clears drag flag and syncs navigation state */
	const handlePageSelected = useCallback(
		(event: { nativeEvent: PagerViewOnPageSelectedEventData }) => {
			const newPage = event.nativeEvent.position as PageIndex;
			currentPageLocalRef.current = newPage;
			isIndicatorDragging.value = false;
			dragSnapTarget.value = -1; // Clear drag snap target

			if (newPage !== state.currentPage) {
				dispatch({ type: "SET_PAGE", payload: newPage });
			}
		},
		[state.currentPage, dispatch, isIndicatorDragging, dragSnapTarget],
	);

	/** Called when indicator drag ends - jumps page to target (no animation to avoid glitch) */
	const handleIndicatorDragEnd = useCallback(
		(page: PageIndex) => {
			if (pagerRef.current) {
				// Use setPageWithoutAnimation to avoid scroll events that cause glitches
				pagerRef.current.setPageWithoutAnimation(page);
			}
		},
		[],
	);

	return (
		<View style={[styles.container, style]} testID={testID}>
			{/* AnimatedPagerView for worklet-based scroll handling */}
			<AnimatedPagerView
				ref={pagerRef}
				style={styles.pagerView}
				initialPage={state.currentPage}
				onPageScroll={scrollHandler}
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
			</AnimatedPagerView>

			{/* Floating Bottom Navigation Bar with animated indicator */}
			<BottomNavContainer
				testID={`${testID}-nav`}
				scrollProgress={scrollProgress}
				isIndicatorDragging={isIndicatorDragging}
				dragSnapTarget={dragSnapTarget}
				onIndicatorDragEnd={handleIndicatorDragEnd}
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
