import { useState, useEffect } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, Button, Text, XStack, YStack, Sheet, H3, useTheme } from '@ui/index';
import { format } from 'date-fns';

type DatePickerInputProps = {
  value: string; // Format: YYYY-MM-DD
  onChange: (dateString: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
};

const parseDateString = (dateString: string): Date => {
  if (!dateString) return new Date();
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DatePickerInput = ({
  value,
  onChange,
  onBlur,
  placeholder = 'Select date',
  id,
}: DatePickerInputProps) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(parseDateString(value));

  const date = parseDateString(value);

  useEffect(() => {
    if (!showPicker) {
      setTempDate(parseDateString(value));
    }
  }, [value, showPicker]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        const formattedDate = formatDateForInput(selectedDate);
        onChange(formattedDate);
      }
      return;
    }
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handlePress = () => {
    setTempDate(parseDateString(value));
    setShowPicker(true);
    onBlur?.();
  };

  const handleConfirm = () => {
    const formattedDate = formatDateForInput(tempDate);
    onChange(formattedDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(parseDateString(value));
    setShowPicker(false);
  };

  const displayValue = value ? format(parseDateString(value), 'dd/MM/yyyy') : '';

  return (
    <>
      <Pressable onPress={handlePress}>
        <Input
          id={id}
          placeholder={placeholder}
          value={displayValue}
          editable={false}
          pointerEvents="none"
        />
      </Pressable>
      {Platform.OS === 'ios' && (
        <Sheet
          modal
          native
          open={showPicker}
          snapPointsMode="fit"
          onOpenChange={(open: boolean) => {
            if (!open) {
              handleCancel();
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
                Select Date
              </H3>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.picker}
                textColor={theme.color12?.val}
              />
              <XStack gap="$2" style={{ justifyContent: 'flex-end' }}>
                <Button size="$3" onPress={handleCancel} style={{ backgroundColor: 'transparent' }}>
                  <Text fontSize="$3" color="$color11">
                    Cancel
                  </Text>
                </Button>
                <Button size="$3" bg="$accent1" onPress={handleConfirm}>
                  <Text fontSize="$3" color="$accent11">
                    Confirm
                  </Text>
                </Button>
              </XStack>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      )}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 200,
  },
});
