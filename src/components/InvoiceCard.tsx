import { StyleSheet } from 'react-native';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import { InvoiceStatus } from './InvoiceStatus';
import type { Paths } from '@api/generated/client';
import { formatPriceWithCurrency } from '@utils/formatPrice';
import { format, isBefore } from 'date-fns';
import { useMemo } from 'react';
type InvoiceItem = Paths.GetInvoices.Responses.$200['invoices'][number];

type InvoiceCardProps = {
  invoice: InvoiceItem;
  onPress: () => void;
};

export const InvoiceCard = ({ invoice, onPress }: InvoiceCardProps) => {
  const theme = useTheme();

  const isOverdue = useMemo(
    () => invoice.deadline && isBefore(new Date(invoice.deadline), new Date()),
    [invoice.deadline],
  );

  return (
    <XStack
      testID="invoice-card"
      style={[styles.card, { backgroundColor: theme.background?.val }]}
      onPress={onPress}>
      <YStack style={styles.content}>
        <Text testID="invoice-card-id" fontWeight="600" fontSize="$5" color="$color12">
          Invoice #{invoice.id}
        </Text>
        {invoice.customer && (
          <Text testID="invoice-card-customer" fontSize="$3" color="$color11">
            {invoice.customer.first_name} {invoice.customer.last_name}
          </Text>
        )}
        <XStack gap="$2">
          {invoice.date ? (
            <Text testID="invoice-card-date" fontSize="$3" color="$color11">
              {format(new Date(invoice.date), 'dd/MM/yyyy')}
            </Text>
          ) : null}
          {invoice.deadline ? (
            <Text
              testID="invoice-card-deadline"
              fontSize="$3"
              color={isOverdue ? '$red10' : '$color11'}>
              Due: {format(new Date(invoice.deadline), 'dd/MM/yyyy')}
            </Text>
          ) : null}
        </XStack>
      </YStack>
      <YStack style={styles.status}>
        <InvoiceStatus finalized={invoice.finalized} paid={invoice.paid} />
        <Text testID="invoice-card-total" fontSize="$3" fontWeight="600">
          {invoice.total ? formatPriceWithCurrency(invoice.total) : '-'}
        </Text>
      </YStack>
    </XStack>
  );
};

const styles = StyleSheet.create({
  card: {
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
