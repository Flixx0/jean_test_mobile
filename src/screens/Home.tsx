import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, View } from 'react-native';
import type { NavigationParams } from '@types';
import { Button, H1, Icon, Input, Text, YStack } from '@ui/index';
import { useInfiniteInvoices } from '@queries/useInfiniteInvoices';
import { useCallback, useState } from 'react';

export const HomeScreen = () => {
  const { navigate } = useNavigation<NavigationProp<NavigationParams>>();

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteInvoices({
      filter: JSON.stringify([]),
      perPage: 30,
    });

  const invoices = data?.pages.flatMap((page) => page.invoices) ?? [];
  const totalCount = data?.pages[0]?.pagination?.total_entries ?? 0;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderInvoiceItem = useCallback(
    ({ item }: { item: (typeof invoices)[0] }) => {
      return (
        <YStack
          style={styles.invoiceCard}
          gap="$2"
          onPress={() => navigate('Invoice', { id: item.id })}>
          <Text fontWeight="600" fontSize="$5" color="black">
            Invoice #{item.id}
          </Text>
          {item.customer && (
            <Text fontSize="$3" color="gray">
              {item.customer.first_name} {item.customer.last_name}
            </Text>
          )}
          <Text fontSize="$3" color="gray">
            Total: {item.total || '0.00'} €
          </Text>
          <Text fontSize="$2" color={item.paid ? 'green' : 'red'}>
            {item.paid ? 'Paid' : 'Unpaid'}
          </Text>
          {item.finalized && (
            <Text fontSize="$2" color="blue">
              Finalized
            </Text>
          )}
        </YStack>
      );
    },
    [navigate],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <YStack style={[styles.centerContent, styles.footer]}>
        <Text color="black">Loading more...</Text>
      </YStack>
    );
  }, [isFetchingNextPage]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <YStack flex={1} style={styles.centerContent}>
          <Text color="black">Loading invoices...</Text>
        </YStack>
      );
    }

    if (error) {
      return (
        <YStack flex={1} style={styles.centerContent} gap="$4">
          <Text color="red">Error: {error instanceof Error ? error.message : 'Unknown error'}</Text>
          <Button onPress={() => navigate('Editor')}>Create a new invoice</Button>
        </YStack>
      );
    }

    return (
      <YStack flex={1} style={styles.centerContent} gap="$4">
        <Text color="black">No invoices found.</Text>
        <Button onPress={() => navigate('Editor')}>Create a new invoice</Button>
      </YStack>
    );
  }, [isLoading, error, navigate]);

  return (
    <YStack flex={1} style={styles.container}>
      <YStack style={styles.header}>
        <H1 size="$6" fontWeight="600" color="black">
          Pennylane Invoices
        </H1>
        <Text fontSize="$3" color="gray">
          {totalCount} total invoices
        </Text>
      </YStack>

      <FlatList
        data={invoices}
        renderItem={renderInvoiceItem}
        keyExtractor={(item) => `invoice-${item.id}`}
        contentContainerStyle={invoices.length === 0 ? styles.emptyContainer : styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshing={isLoading}
      />
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  invoiceCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    gap: 4,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 16,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
  },
});
