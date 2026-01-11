import { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, XStack, YStack, useTheme } from '@ui/index';
import { InvoiceLineItem } from '@components/InvoiceLineItem';
import type { Components } from '@api/generated/client';

type InvoiceLine = Components.Schemas.InvoiceLine;

type InvoiceItemsListProps = {
  invoiceLines: InvoiceLine[];
};

export const InvoiceItemsList = ({ invoiceLines }: InvoiceItemsListProps) => {
  const theme = useTheme();

  const renderInvoiceLine = useCallback(
    ({ item }: { item: InvoiceLine }) => <InvoiceLineItem item={item} />,
    [],
  );

  return (
    <YStack flex={1}>
      <XStack
        p="$4"
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.color4?.val,
          borderBottomWidth: 1,
          borderBottomColor: theme.borderColor?.val,
        }}>
        <Text fontSize="$4" fontWeight="600" color="$color12">
          Invoice items
        </Text>
        <Text fontSize="$3" color="$color11">
          {invoiceLines.length} {invoiceLines.length === 1 ? 'item' : 'items'}
        </Text>
      </XStack>
      {invoiceLines.length > 0 ? (
        <FlatList
          data={invoiceLines}
          renderItem={renderInvoiceLine}
          keyExtractor={(item) => `invoice-line-${item.id}`}
          style={{ flex: 1 }}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <YStack
          flex={1}
          style={[styles.emptyContainer, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text fontSize="$3" color="$color11">
            No items in this invoice
          </Text>
        </YStack>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    paddingVertical: 32,
  },
});
