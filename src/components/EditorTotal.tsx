import { Text, XStack } from '@ui/index';
import { formatPriceWithCurrency } from '@utils/formatPrice';

type EditorTotalProps = {
  totalPrice: number;
};

export const EditorTotal = ({ totalPrice }: EditorTotalProps) => {
  return totalPrice > 0 ? (
    <XStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Text fontSize="$5" fontWeight="600" color="$color12">
        Total
      </Text>
      <Text fontSize="$5" fontWeight="600" color="$color12">
        {formatPriceWithCurrency(totalPrice.toString())}
      </Text>
    </XStack>
  ) : null;
};
