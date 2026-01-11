import { Text, XStack, YStack, Separator, useTheme } from '@ui/index';
import { formatPriceWithCurrency } from '@utils/formatPrice';

type InvoiceTotalsProps = {
  tax: string | null;
  total: string | null;
};

export const InvoiceTotals = ({ tax, total }: InvoiceTotalsProps) => {
  const theme = useTheme();

  return (
    <YStack p="$4" gap="$2" style={{ backgroundColor: theme.background?.val }}>
      {tax ? (
        <XStack style={{ justifyContent: 'space-between' }}>
          <Text fontSize="$3" color="$color11">
            Tax
          </Text>
          <Text fontSize="$4" color="$color12" fontWeight="500">
            {formatPriceWithCurrency(tax)}
          </Text>
        </XStack>
      ) : null}
      {total ? (
        <>
          <Separator />
          <XStack style={{ justifyContent: 'space-between' }}>
            <Text fontSize="$4" fontWeight="600" color="$color12">
              Total
            </Text>
            <Text fontSize="$5" fontWeight="700" color="$color12">
              {formatPriceWithCurrency(total)}
            </Text>
          </XStack>
        </>
      ) : null}
    </YStack>
  );
};
