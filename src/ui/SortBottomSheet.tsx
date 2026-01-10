import { useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { Button, H3, Text, XStack, YStack } from 'tamagui';
import { Icon } from './Icon';
import { BottomSheetWrapper, type BottomSheetRef } from './BottomSheet';
import type { IconName } from './Icon';

export type SortOption = 'date-desc' | 'date-asc' | 'total-desc' | 'total-asc';

type SortOptionConfig = {
  value: SortOption;
  label: string;
  icon: IconName;
};

const sortOptions: SortOptionConfig[] = [
  {
    value: 'date-desc',
    label: 'Date',
    icon: 'ChevronDown',
  },
  {
    value: 'date-asc',
    label: 'Date',
    icon: 'ChevronUp',
  },
  {
    value: 'total-desc',
    label: 'Amount',
    icon: 'ChevronDown',
  },
  {
    value: 'total-asc',
    label: 'Amount',
    icon: 'ChevronUp',
  },
];

type SortBottomSheetProps = {
  isOpen: boolean;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onClose: () => void;
};

export type SortBottomSheetRef = BottomSheetRef;

export const SortBottomSheet = forwardRef<SortBottomSheetRef, SortBottomSheetProps>(
  ({ isOpen, sortOption, onSortChange, onClose }, ref) => {
    const bottomSheetRef = useRef<BottomSheetRef>(null);

    useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetRef);

    const handleSheetChange = useCallback(
      (index: number) => {
        if (index < 0) {
          onClose();
        }
      },
      [onClose],
    );

    const handleSortChange = useCallback(
      (option: SortOption) => {
        onSortChange(option);
        bottomSheetRef.current?.close();
      },
      [onSortChange],
    );

    return (
      <BottomSheetWrapper
        ref={bottomSheetRef}
        index={isOpen ? 0 : -1}
        onChange={handleSheetChange}
        enablePanDownToClose={true}
        enableDynamicSizing={true}>
        <YStack gap="$4">
          <H3 size="$5" fontWeight="600" color="black">
            Sort invoices by
          </H3>
          <YStack gap="$2">
            {sortOptions.map((option) => {
              const isSelected = sortOption === option.value;
              const textColor = isSelected ? '#007AFF' : '#1c1c1b';

              return (
                <Button
                  key={option.value}
                  onPress={() => handleSortChange(option.value)}
                  style={isSelected ? styles.activeSortButton : styles.sortOptionButton}>
                  <XStack style={styles.sortOptionContent} gap="$2">
                    <Text fontSize="$4" color={textColor}>
                      {option.label}
                    </Text>
                    <Icon name={option.icon} size={18} color={textColor} />
                  </XStack>
                </Button>
              );
            })}
          </YStack>
        </YStack>
      </BottomSheetWrapper>
    );
  },
);

SortBottomSheet.displayName = 'SortBottomSheet';

const styles = StyleSheet.create({
  sortOptionButton: {
    backgroundColor: '#f5f5f5',
  },
  activeSortButton: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  sortOptionContent: {
    alignItems: 'center',
  },
});
