import React, { useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import trigger from "@mhpdev/react-native-haptics";
import { useTheme } from "@theme/useTheme";
import { Spacing } from "@theme/colors";
import { Button } from "@components/atoms/Button";
import {
	TrueSheetModal,
	type TrueSheetModalRef,
} from "@components/organisms/TrueSheetModal";

const spacing = Spacing;

/* AI-INSTRUCTION-START:home-screen
 * This is the main home screen of your application.
 *
 * CUSTOMIZATION REQUIRED:
 * 1. Replace placeholder content with your app's main functionality
 * 2. Add navigation to other screens using navigation prop
 * 3. Integrate with your data layer (Context, database queries)
 * 4. Add UI components from the component library
 * 5. Implement your main user workflows here
 *
 * Available Components:
 * - Atoms: Button, Icon, Badge, ProgressBar, etc. (see @components/atoms)
 * - Molecules: SearchBar, BottomNavContainer, etc. (see @components/molecules)
 * - Organisms: SwipeableMainContainer (see @components/organisms)
 *
 * OpenSpec Reference: specs/screens/spec.md
 * AI Instructions: openspec/ai-instructions/screen-generation.md
 * AI-INSTRUCTION-END */

export function HomeScreen() {
	const { colors } = useTheme();
	const sheetRef = useRef<TrueSheetModalRef>(null);

	/* AI-INSTRUCTION-START:home-screen-logic
	 * Add your business logic here:
	 * - Data fetching hooks
	 * - State management (Context consumers)
	 * - Event handlers
	 * - Navigation functions
	 *
	 * Example:
	 * const { items } = useContext(ItemContext);
	 * const navigation = useNavigation();
	 * AI-INSTRUCTION-END */

	const handleOpenSheet = () => {
		trigger.impact("light");
		sheetRef.current?.present();
	};

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.background }]}
			edges={["top"]}
		>
			<View style={styles.content}>
				{/* AI-INSTRUCTION-START:home-screen-header
				 * Replace this placeholder header with your app's header/title
				 * AI-INSTRUCTION-END */}
				<Text style={[styles.title, { color: colors.text }]}>Welcome</Text>

				<Text style={[styles.subtitle, { color: colors.textSecondary }]}>
					Your app starts here
				</Text>

				{/* AI-INSTRUCTION-START:home-screen-main-content
				 * Add your main content here:
				 * - Lists of items (use FlashList for performance)
				 * - Cards, grids, or other layouts
				 * - Interactive elements
				 * - Data visualizations
				 *
				 * Example component usage:
				 * <Button
				 *   onPress={handleAddItem}
				 *   variant="primary"
				 * >
				 *   Add Item
				 * </Button>
				 * AI-INSTRUCTION-END */}

				<View style={styles.placeholderContent}>
					<Text
						style={[styles.placeholderText, { color: colors.textSecondary }]}
					>
						This is a placeholder screen.{"\n"}
						Add your app's main functionality here.
					</Text>

					<Button
						onPress={handleOpenSheet}
						variant="primary"
						style={styles.exampleButton}
					>
						Open Bottom Sheet
					</Button>
				</View>
			</View>

			<TrueSheetModal
				ref={sheetRef}
				detents={["auto", 0.5, 1]}
				cornerRadius={24}
				backgroundColor={colors.surface}
			>
				<Text style={[styles.sheetTitle, { color: colors.text }]}>
					Bottom Sheet
				</Text>
				<Text style={[styles.sheetText, { color: colors.textSecondary }]}>
					This is a native bottom sheet powered by TrueSheet v3.
				</Text>
				<View style={styles.sheetButtons}>
					<Button
						onPress={() => sheetRef.current?.resize(1)}
						variant="secondary"
						style={styles.sheetButton}
					>
						Expand
					</Button>
					<Button
						onPress={() => sheetRef.current?.dismiss()}
						variant="primary"
						style={styles.sheetButton}
					>
						Close
					</Button>
				</View>
			</TrueSheetModal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		padding: spacing.lg,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: spacing.sm,
	},
	subtitle: {
		fontSize: 16,
		marginBottom: spacing.xl,
	},
	placeholderContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderText: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: spacing.xl,
		lineHeight: 24,
	},
	exampleButton: {
		minWidth: 200,
	},
	sheetTitle: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: spacing.sm,
	},
	sheetText: {
		fontSize: 16,
		marginBottom: spacing.lg,
		lineHeight: 24,
	},
	sheetButtons: {
		flexDirection: "row",
		gap: spacing.md,
	},
	sheetButton: {
		flex: 1,
	},
});
