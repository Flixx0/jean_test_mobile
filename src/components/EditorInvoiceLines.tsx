import { Control, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
import { Button, Label, Text, XStack, YStack, useTheme } from '@ui/index';
import { Icon } from '@components/Icon';
import { EditorInvoiceLineItem } from '@components/EditorInvoiceLineItem';
import type { Components } from '@api/generated/client';

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

type EditorInvoiceLinesProps = {
  control: Control<InvoiceFormData>;
  fields: UseFieldArrayReturn<InvoiceFormData, 'invoice_lines_attributes'>['fields'];
  selectedProducts: Map<number, Components.Schemas.Product>;
  onAddLine: () => void;
  onRemoveLine: (index: number) => void;
  onProductSelect: (index: number, product: Components.Schemas.Product) => void;
  errors: FieldErrors<InvoiceFormData>;
};

export const EditorInvoiceLines = ({
  control,
  fields,
  selectedProducts,
  onAddLine,
  onRemoveLine,
  onProductSelect,
  errors,
}: EditorInvoiceLinesProps) => {
  const theme = useTheme();

  return (
    <YStack gap="$3">
      <XStack style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Label fontSize="$4" color="$color12">
          Invoice Lines
        </Label>
        <Button size="$3" onPress={onAddLine}>
          <Icon name="Plus" size={16} color={theme.color12?.val} />
          <Text fontSize="$3" color="$color12" ml="$2">
            Add Line
          </Text>
        </Button>
      </XStack>

      {fields.map((field, index) => {
        const product = selectedProducts.get(index);
        return (
          <EditorInvoiceLineItem
            key={field.id}
            control={control}
            index={index}
            field={field}
            product={product}
            onProductSelect={onProductSelect}
            onRemove={onRemoveLine}
            fieldsLength={fields.length}
            errors={errors}
          />
        );
      })}
    </YStack>
  );
};
