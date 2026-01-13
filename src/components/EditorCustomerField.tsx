import { Controller, Control, FieldErrors } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Label, Text, XStack, YStack, useTheme } from '@ui/index';
import { Icon } from '@components/Icon';
import type { Components } from '@api/generated/client';
import type { EditorStackParams } from '@navigators/EditorStack';
import type { InvoiceFormData } from '@components/EditorInvoiceLines';

type EditorCustomerFieldProps = {
  control: Control<InvoiceFormData>;
  selectedCustomer: Components.Schemas.Customer | null;
  onCustomerSelect: (customer: Components.Schemas.Customer) => void;
  errors: FieldErrors<InvoiceFormData>;
};

export const EditorCustomerField = ({
  control,
  selectedCustomer,
  onCustomerSelect,
  errors,
}: EditorCustomerFieldProps) => {
  const navigation = useNavigation<NavigationProp<EditorStackParams>>();
  const theme = useTheme();

  return (
    <YStack testID="editor-customer-field" gap="$1">
      <Label testID="editor-customer-field-label" htmlFor="customer_id" fontSize="$4">
        Customer
      </Label>
      <Controller
        control={control}
        name="customer_id"
        rules={{ required: 'Customer is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Button
            testID="editor-customer-field-button"
            onPress={() => {
              navigation.navigate('CustomerSelect', {
                onSelectCustomer: (customer: Components.Schemas.Customer) => {
                  onChange(String(customer.id));
                  onCustomerSelect(customer);
                  onBlur();
                },
              });
            }}
            style={{ justifyContent: 'flex-start' }}>
            <XStack flex={1} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Text
                testID="editor-customer-field-text"
                fontSize="$4"
                color={selectedCustomer ? '$color12' : '$color11'}>
                {selectedCustomer
                  ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                  : 'Select a customer'}
              </Text>
              <Icon name="ChevronRight" size={20} color={theme.color11?.val} />
            </XStack>
          </Button>
        )}
      />
      {errors.customer_id ? (
        <Text testID="editor-customer-field-error" fontSize="$2" color="red">
          {errors.customer_id.message}
        </Text>
      ) : null}
    </YStack>
  );
};
