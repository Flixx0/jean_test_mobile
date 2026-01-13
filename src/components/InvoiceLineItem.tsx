import { Text, XStack, YStack, useTheme } from '@ui/index';
import { formatPriceWithCurrency } from '@utils/formatPrice';
import type { Components } from '@api/generated/client';

type InvoiceLine = Components.Schemas.InvoiceLine;

type InvoiceLineItemProps = {
  item: InvoiceLine;
};

export const InvoiceLineItem = ({ item }: InvoiceLineItemProps) => {
  const theme = useTheme();

  return (
    <XStack
      testID="invoice-line-item"
      p="$3"
      style={{
        borderBottomWidth: 2,
        borderBottomColor: theme.color1?.val,
        backgroundColor: theme.color3?.val,
      }}>
      <YStack flex={1} gap="$1">
        <Text testID="invoice-line-item-label" fontSize="$4" fontWeight="600" color="$color12">
          {item.label}
        </Text>
        <Text testID="invoice-line-item-quantity" fontSize="$2" color="$color11">
          Quantity: {item.quantity} {item.unit}
        </Text>
        <Text testID="invoice-line-item-product-id" fontSize="$2" color="$color11">
          Product ID: {item.product_id}
        </Text>
      </YStack>
      <YStack style={{ alignItems: 'flex-end' }} gap="$1">
        <Text testID="invoice-line-item-price" fontSize="$4" fontWeight="600" color="$color12">
          {formatPriceWithCurrency(item.price)}
        </Text>
        {item.tax && item.tax !== '' ? (
          <Text testID="invoice-line-item-tax" fontSize="$2" color="$color11">
            Tax: {formatPriceWithCurrency(item.tax)}
          </Text>
        ) : null}
      </YStack>
    </XStack>
  );
};
