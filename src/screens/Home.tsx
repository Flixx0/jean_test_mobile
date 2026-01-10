import { useCallback, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet } from 'react-native';
import type { NavigationParams } from '@types';
import {
  Button,
  H1,
  Icon,
  InvoiceCard,
  Spinner,
  Text,
  XStack,
  YStack,
  SortBottomSheet,
  type SortOption,
} from '@ui/index';
import { useInfiniteInvoices } from '@queries/useInfiniteInvoices';
import { WithSuspense } from '@utils/withSuspense';

const InvoicesList = () => {
  const { navigate } = useNavigation<NavigationProp<NavigationParams>>();
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteInvoices({
    filter: JSON.stringify([]),
    perPage: 30,
    sortOption,
  });

  const invoices = data.pages.flatMap((page) => page.invoices);
  const totalCount = data.pages[0]?.pagination?.total_entries ?? 0;

  const handleOpenFilter = useCallback(() => {
    setBottomSheetOpen(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setBottomSheetOpen(false);
  }, []);

  const handleSortChange = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderInvoiceItem = useCallback(
    ({ item }: { item: (typeof invoices)[0] }) => (
      <InvoiceCard invoice={item} onPress={() => navigate('Invoice', { id: item.id })} />
    ),
    [navigate],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;

    return (
      <YStack style={[styles.centerContent, styles.footer]}>
        <Spinner size="small" />
      </YStack>
    );
  }, [isFetchingNextPage]);

  const renderEmpty = useCallback(() => {
    return (
      <YStack flex={1} style={styles.centerContent} gap="$4">
        <Text color="black">No invoices found.</Text>
        <Button onPress={() => navigate('Editor')}>Create a new invoice</Button>
      </YStack>
    );
  }, [navigate]);

  return (
    <YStack flex={1} style={styles.container}>
      <YStack style={styles.header}>
        <XStack style={styles.headerContent}>
          <H1 size="$6" fontWeight="600" color="black">
            Your invoices
          </H1>
          <Button circular style={styles.sortButton} size="$3" onPress={handleOpenFilter}>
            <Icon name="ArrowDownUp" size={16} color="black" />
          </Button>
        </XStack>
        <Text fontSize="$3" color="gray">
          {totalCount} total invoices
        </Text>
      </YStack>

      <FlatList
        data={invoices}
        renderItem={renderInvoiceItem}
        keyExtractor={(item) => `invoice-${item.id}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />

      <SortBottomSheet
        isOpen={bottomSheetOpen}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        onClose={handleCloseFilter}
      />
    </YStack>
  );
};

export const HomeScreen = () => {
  return (
    <WithSuspense>
      <InvoicesList />
    </WithSuspense>
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
  headerContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 16,
  },
  sortButton: {
    backgroundColor: '#f5f5f5',
  },
});
