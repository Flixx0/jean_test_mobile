import { Text, XStack, YStack, Separator, useTheme } from '@ui/index';
import { formatPriceWithCurrency } from '@utils/formatPrice';

type InvoiceTotalsProps = {
  tax: string | null;
  total: string | null;
};

export const InvoiceTotals = ({ tax, total }: InvoiceTotalsProps) => {
  const theme = useTheme();

  return (
    <YStack
      testID="invoice-totals"
      p="$4"
      gap="$2"
      style={{ backgroundColor: theme.background?.val }}>
      {tax ? (
        <XStack testID="invoice-totals-tax-row" style={{ justifyContent: 'space-between' }}>
          <Text testID="invoice-totals-tax-label" fontSize="$3" color="$color11">
            Tax
          </Text>
          <Text testID="invoice-totals-tax-value" fontSize="$4" color="$color12" fontWeight="500">
            {formatPriceWithCurrency(tax)}
          </Text>
        </XStack>
      ) : null}
      {total ? (
        <>
          <Separator testID="invoice-totals-separator" />
          <XStack testID="invoice-totals-total-row" style={{ justifyContent: 'space-between' }}>
            <Text
              testID="invoice-totals-total-label"
              fontSize="$4"
              fontWeight="600"
              color="$color12">
              Total
            </Text>
            <Text
              testID="invoice-totals-total-value"
              fontSize="$5"
              fontWeight="700"
              color="$color12">
              {formatPriceWithCurrency(total)}
            </Text>
          </XStack>
        </>
      ) : null}
    </YStack>
  );
};
