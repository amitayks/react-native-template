import React, { forwardRef, useImperativeHandle, useRef, type ReactElement } from 'react';
import { View, StyleSheet, type ColorValue } from 'react-native';
import { TrueSheet, type TrueSheetProps, type DetentChangeEvent } from '@lodev09/react-native-true-sheet';

/* AI-INSTRUCTION-START:true-sheet-modal
 * TrueSheetModal Component
 *
 * A reusable bottom sheet modal component built on react-native-true-sheet v3.
 * Requires React Native 0.76+ with New Architecture (Fabric) enabled.
 *
 * Basic Usage:
 *   const sheetRef = useRef<TrueSheetModalRef>(null);
 *
 *   <TrueSheetModal ref={sheetRef} detents={['auto', 0.5, 1]}>
 *     <YourContent />
 *   </TrueSheetModal>
 *
 *   // To present/dismiss:
 *   await sheetRef.current?.present();
 *   await sheetRef.current?.dismiss();
 *
 * Detent values:
 *   - 'auto': Height based on content (iOS 16+, Android)
 *   - number (0-1): Fractional height of screen (e.g., 0.5 = 50%)
 *
 * AI-INSTRUCTION-END */

export interface TrueSheetModalRef {
	present: () => Promise<void>;
	dismiss: () => Promise<void>;
	resize: (index: number) => Promise<void>;
}

type SheetDetent = 'auto' | number;

export interface TrueSheetModalProps {
	children: React.ReactNode;
	/** Sheet height positions. Max 3 detents. Default: ['auto', 1] */
	detents?: SheetDetent[];
	/** Initial detent index. -1 means hidden. Default: -1 */
	initialDetentIndex?: number;
	/** Allow swipe to dismiss. Default: true */
	dismissible?: boolean;
	/** Allow drag to resize between detents. Default: true */
	draggable?: boolean;
	/** Show drag handle indicator. Default: true */
	grabber?: boolean;
	/** Background dimming. Default: true */
	dimmed?: boolean;
	/** Corner rounding radius */
	cornerRadius?: number;
	/** Sheet background color */
	backgroundColor?: ColorValue;
	/** Fixed header component */
	header?: ReactElement;
	/** Floating footer component */
	footer?: ReactElement;
	/** Callback when sheet is presented */
	onDidPresent?: () => void;
	/** Callback when sheet is dismissed */
	onDidDismiss?: () => void;
	/** Callback when detent changes */
	onDetentChange?: (index: number) => void;
}

export const TrueSheetModal = forwardRef<TrueSheetModalRef, TrueSheetModalProps>(
	(
		{
			children,
			detents = ['auto', 1],
			initialDetentIndex = -1,
			dismissible = true,
			draggable = true,
			grabber = true,
			dimmed = true,
			cornerRadius,
			backgroundColor,
			header,
			footer,
			onDidPresent,
			onDidDismiss,
			onDetentChange,
		},
		ref
	) => {
		const sheetRef = useRef<TrueSheet>(null);

		useImperativeHandle(ref, () => ({
			present: async () => {
				await sheetRef.current?.present();
			},
			dismiss: async () => {
				await sheetRef.current?.dismiss();
			},
			resize: async (index: number) => {
				await sheetRef.current?.resize(index);
			},
		}));

		return (
			<TrueSheet
				ref={sheetRef}
				detents={detents as TrueSheetProps['detents']}
				initialDetentIndex={initialDetentIndex}
				dismissible={dismissible}
				draggable={draggable}
				grabber={grabber}
				dimmed={dimmed}
				cornerRadius={cornerRadius}
				backgroundColor={backgroundColor}
				header={header}
				footer={footer}
				onDidPresent={onDidPresent}
				onDidDismiss={onDidDismiss}
				onDetentChange={
					onDetentChange
						? (event: DetentChangeEvent) => onDetentChange(event.nativeEvent.index)
						: undefined
				}
			>
				<View style={styles.content}>{children}</View>
			</TrueSheet>
		);
	}
);

TrueSheetModal.displayName = 'TrueSheetModal';

const styles = StyleSheet.create({
	content: {
		padding: 16,
	},
});
