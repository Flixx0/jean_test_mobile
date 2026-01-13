import { Text, XStack } from '@ui/index';
import { formatPriceWithCurrency } from '@utils/formatPrice';

type EditorTotalProps = {
  totalPrice: number;
};

export const EditorTotal = ({ totalPrice }: EditorTotalProps) => {
  return totalPrice > 0 ? (
    <XStack testID="editor-total" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Text testID="editor-total-label" fontSize="$5" fontWeight="600" color="$color12">
        Total
      </Text>
      <Text testID="editor-total-value" fontSize="$5" fontWeight="600" color="$color12">
        {formatPriceWithCurrency(totalPrice.toString())}
      </Text>
    </XStack>
  ) : null;
};
