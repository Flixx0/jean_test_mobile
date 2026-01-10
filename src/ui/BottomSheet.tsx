import React, { useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { YStack } from 'tamagui';

type BottomSheetProps = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  index?: number;
  onChange?: (index: number) => void;
  enablePanDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  maxDynamicContentSize?: number;
  backgroundStyle?: object;
};

export type BottomSheetRef = React.ComponentRef<typeof BottomSheet>;

export const BottomSheetWrapper = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      snapPoints,
      index = -1,
      onChange,
      enablePanDownToClose = true,
      enableDynamicSizing = false,
      maxDynamicContentSize,
      backgroundStyle,
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheetRef>(null);

    useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetRef);

    const handleSheetChanges = useCallback(
      (newIndex: number) => {
        onChange?.(newIndex);
      },
      [onChange],
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={index}
        snapPoints={enableDynamicSizing ? undefined : snapPoints || ['25%', '50%', '90%']}
        enableDynamicSizing={enableDynamicSizing}
        maxDynamicContentSize={maxDynamicContentSize}
        onChange={handleSheetChanges}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.background, backgroundStyle]}>
        <BottomSheetView style={styles.contentContainer}>
          <YStack>{children}</YStack>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

BottomSheetWrapper.displayName = 'BottomSheetWrapper';

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    padding: 16,
  },
});
