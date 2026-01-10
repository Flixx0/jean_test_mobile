import { StyleSheet } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { InvoiceStatus } from './InvoiceStatus';
import type { Paths } from '@api/generated/client';
import { formatPriceWithCurrency } from '@utils/formatPrice';

type InvoiceItem = Paths.GetInvoices.Responses.$200['invoices'][number];

type InvoiceCardProps = {
  invoice: InvoiceItem;
  onPress: () => void;
};

export const InvoiceCard = ({ invoice, onPress }: InvoiceCardProps) => {
  return (
    <XStack style={styles.card} onPress={onPress}>
      <YStack style={styles.content}>
        <Text fontWeight="600" fontSize="$5" color="black">
          Invoice #{invoice.id}
        </Text>
        {invoice.customer && (
          <Text fontSize="$3" color="gray">
            {invoice.customer.first_name} {invoice.customer.last_name}
          </Text>
        )}
        <Text fontSize="$3" color="gray">
          {invoice.date}
        </Text>
      </YStack>
      <YStack style={styles.status}>
        <InvoiceStatus finalized={invoice.finalized} paid={invoice.paid} />
        <Text fontSize="$3" fontWeight="600" color="black">
          {invoice.total ? formatPriceWithCurrency(invoice.total) : '-'}
        </Text>
      </YStack>
    </XStack>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  content: {
    gap: 8,
  },
  status: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
});
