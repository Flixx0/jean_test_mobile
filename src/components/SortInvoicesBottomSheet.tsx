import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Button, H3, Sheet, Text, XStack, YStack, useTheme } from 'tamagui';
import { Icon } from './Icon';
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

type SortInvoicesBottomSheetProps = {
  isOpen: boolean;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onClose: () => void;
};

export const SortInvoicesBottomSheet = ({
  isOpen,
  sortOption,
  onSortChange,
  onClose,
}: SortInvoicesBottomSheetProps) => {
  const theme = useTheme();

  const handleSortChange = useCallback(
    (option: SortOption) => {
      onSortChange(option);
      onClose();
    },
    [onSortChange, onClose],
  );

  return (
    <Sheet
      modal
      open={isOpen}
      snapPointsMode="fit"
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose();
        }
      }}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="quicker">
      <Sheet.Overlay
        animation="lazy"
        opacity={0.5}
        bg="$shadow4"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame p="$4" bg="$background" borderTopLeftRadius="$4" borderTopRightRadius="$4">
        <YStack gap="$4">
          <H3 size="$5" fontWeight="600" color="$color12">
            Sort invoices by
          </H3>
          <YStack gap="$2">
            {sortOptions.map((option) => {
              const isSelected = sortOption === option.value;
              const textColor = isSelected ? theme.blue10?.val : theme.color11?.val;

              return (
                <Button
                  key={option.value}
                  onPress={() => handleSortChange(option.value)}
                  bg={isSelected ? theme.blue2?.val : theme.backgroundHover?.val}
                  borderColor={isSelected ? theme.blue10?.val : 'transparent'}
                  borderWidth={1}>
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
      </Sheet.Frame>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  sortOptionContent: {
    alignItems: 'center',
  },
});
