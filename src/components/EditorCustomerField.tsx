import { Controller, Control, FieldErrors } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Label, Text, XStack, YStack, useTheme } from '@ui/index';
import { Icon } from '@components/Icon';
import type { Components } from '@api/generated/client';

type EditorStackParams = {
  Editor: undefined;
  CustomerSelect: { onSelectCustomer: (customer: Components.Schemas.Customer) => void };
  ProductSelect: { onSelectProduct: (product: Components.Schemas.Product) => void };
};

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
    <YStack gap="$1">
      <Label htmlFor="customer_id" fontSize="$4">
        Customer
      </Label>
      <Controller
        control={control}
        name="customer_id"
        rules={{ required: 'Customer is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Button
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
              <Text fontSize="$4" color={selectedCustomer ? '$color12' : '$color11'}>
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
        <Text fontSize="$2" color="red">
          {errors.customer_id.message}
        </Text>
      ) : null}
    </YStack>
  );
};
