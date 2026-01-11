import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Label, Text, XStack, YStack } from '@ui/index';
import { DatePickerInput } from '@components/DatePickerInput';

type InvoiceFormData = {
  customer_id: string;
  finalized: boolean;
  paid: boolean;
  date: string;
  deadline: string;
  invoice_lines_attributes: {
    product_id: string;
    quantity: string;
  }[];
};

type EditorDateFieldsProps = {
  control: Control<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
};

export const EditorDateFields = ({ control, errors }: EditorDateFieldsProps) => {
  return (
    <XStack flex={1} gap="$3">
      <YStack flex={1} gap="$1">
        <Label htmlFor="date" fontSize="$4" color="$color12">
          Date
        </Label>
        <Controller
          control={control}
          name="date"
          rules={{ required: 'Date is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DatePickerInput
              id="date"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Select date"
            />
          )}
        />
        {errors.date ? (
          <Text fontSize="$2" color="red">
            {errors.date.message}
          </Text>
        ) : null}
      </YStack>
      <YStack flex={1} gap="$1">
        <Label htmlFor="deadline" fontSize="$4" color="$color12">
          Deadline
        </Label>
        <Controller
          control={control}
          name="deadline"
          rules={{ required: 'Deadline is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DatePickerInput
              id="deadline"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Select deadline"
            />
          )}
        />
        {errors.deadline ? (
          <Text fontSize="$2" color="red">
            {errors.deadline.message}
          </Text>
        ) : null}
      </YStack>
    </XStack>
  );
};
