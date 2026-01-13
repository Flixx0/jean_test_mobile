import { Controller, Control, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Input, Label, Text, XStack, YStack, useTheme } from '@ui/index';
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

type EditorInvoiceLineItemProps = {
  control: Control<InvoiceFormData>;
  index: number;
  field: { id: string };
  product: Components.Schemas.Product | undefined;
  onProductSelect: (index: number, product: Components.Schemas.Product) => void;
  onRemove: (index: number) => void;
  fieldsLength: number;
  errors: FieldErrors<InvoiceFormData>;
};

export const EditorInvoiceLineItem = ({
  control,
  index,
  field,
  product,
  onProductSelect,
  onRemove,
  fieldsLength,
  errors,
}: EditorInvoiceLineItemProps) => {
  const navigation = useNavigation<NavigationProp<EditorStackParams>>();
  const theme = useTheme();

  return (
    <YStack testID={`editor-invoice-line-item-${index}`} key={field.id} gap="$2">
      <XStack key={field.id} gap="$2" style={{ alignItems: 'center' }}>
        <YStack flex={1} gap="$2">
          <Controller
            control={control}
            name={`invoice_lines_attributes.${index}.product_id` as const}
            rules={{ required: 'Product is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Button
                testID={`editor-invoice-line-item-product-button-${index}`}
                onPress={() => {
                  navigation.navigate('ProductSelect', {
                    onSelectProduct: (selectedProduct: Components.Schemas.Product) => {
                      onChange(String(selectedProduct.id));
                      onProductSelect(index, selectedProduct);
                      onBlur();
                    },
                  });
                }}
                style={{ justifyContent: 'flex-start' }}>
                <XStack flex={1} justify="space-between" style={{ alignItems: 'center' }}>
                  <Text
                    testID={`editor-invoice-line-item-product-text-${index}`}
                    fontSize="$4"
                    color={product ? '$color12' : '$color11'}>
                    {product ? product.label : 'Select a product'}
                  </Text>
                  {product ? (
                    <Text
                      testID={`editor-invoice-line-item-product-price-${index}`}
                      fontSize="$2"
                      color="$accent4">
                      {product.unit_price} €
                    </Text>
                  ) : null}
                </XStack>
              </Button>
            )}
          />
        </YStack>
        <YStack width={100} gap="$2">
          <Controller
            control={control}
            name={`invoice_lines_attributes.${index}.quantity` as const}
            rules={{
              required: 'Quantity is required',
              min: { value: 1, message: 'Quantity must be greater than 0' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                testID={`editor-invoice-line-item-quantity-${index}`}
                placeholder="Qty"
                keyboardType="number-pad"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </YStack>
        {fieldsLength > 1 ? (
          <Button
            testID={`editor-invoice-line-item-remove-${index}`}
            size="$3"
            circular
            onPress={() => onRemove(index)}
            style={{
              backgroundColor: theme.red2?.val,
            }}>
            <Icon name="X" size={16} color={theme.color12?.val} />
          </Button>
        ) : null}
      </XStack>
      <XStack flex={1} justify="space-between">
        {errors.invoice_lines_attributes?.[index]?.product_id ? (
          <Text
            testID={`editor-invoice-line-item-product-error-${index}`}
            fontSize="$2"
            color="red">
            {errors.invoice_lines_attributes?.[index]?.product_id?.message}
          </Text>
        ) : null}
        {errors.invoice_lines_attributes?.[index]?.quantity ? (
          <Text
            testID={`editor-invoice-line-item-quantity-error-${index}`}
            fontSize="$2"
            color="red">
            {errors.invoice_lines_attributes?.[index]?.quantity?.message}
          </Text>
        ) : null}
      </XStack>
    </YStack>
  );
};
