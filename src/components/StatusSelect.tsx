import { useState, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Button, H3, Sheet, Text, XStack, YStack, Input, useTheme } from '@ui/index';
import { Icon } from '@components/Icon';

export type InvoiceStatus = 'draft' | 'finalized' | 'paid';

type StatusSelectProps = {
  value: InvoiceStatus;
  onChange: (status: InvoiceStatus) => void;
  onBlur?: () => void;
  id?: string;
  placeholder?: string;
};

const statusOptions: { value: InvoiceStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'finalized', label: 'Finalized' },
  { value: 'paid', label: 'Paid' },
];

const getStatusLabel = (status: InvoiceStatus): string => {
  return statusOptions.find((opt) => opt.value === status)?.label || 'Select status';
};

export const StatusSelect = ({
  value,
  onChange,
  onBlur,
  id,
  placeholder = 'Select status',
}: StatusSelectProps) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = useCallback(
    (status: InvoiceStatus) => {
      onChange(status);
      setIsOpen(false);
      onBlur?.();
    },
    [onChange, onBlur],
  );

  const handlePress = useCallback(() => {
    setIsOpen(true);
    onBlur?.();
  }, [onBlur]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const displayValue = value ? getStatusLabel(value) : placeholder;

  return (
    <>
      <Pressable onPress={handlePress}>
        <XStack
          width="100%"
          style={{ position: 'relative', alignItems: 'center', justifyContent: 'space-between' }}>
          <Input
            id={id}
            placeholder={placeholder}
            value={displayValue}
            editable={false}
            pointerEvents="none"
            flex={1}
            pr="$8"
          />
          <XStack
            style={{
              position: 'absolute',
              right: 12,
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}>
            <Icon
              name={isOpen ? 'ChevronUp' : 'ChevronDown'}
              size={20}
              color={theme.color11?.val}
            />
          </XStack>
        </XStack>
      </Pressable>
      <Sheet
        modal
        open={isOpen}
        snapPointsMode="fit"
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleClose();
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
              Invoice Status
            </H3>
            <YStack gap="$2">
              {statusOptions.map((option) => {
                const isSelected = value === option.value;
                const textColor = isSelected ? theme.blue10?.val : theme.color11?.val;

                return (
                  <Button
                    key={option.value}
                    onPress={() => handleStatusChange(option.value)}
                    bg={isSelected ? theme.blue2?.val : theme.backgroundHover?.val}
                    borderColor={isSelected ? theme.blue10?.val : 'transparent'}
                    borderWidth={1}>
                    <XStack style={styles.statusOptionContent} gap="$2">
                      <Text fontSize="$4" color={textColor}>
                        {option.label}
                      </Text>
                    </XStack>
                  </Button>
                );
              })}
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

const styles = StyleSheet.create({
  statusOptionContent: {
    alignItems: 'center',
  },
});
