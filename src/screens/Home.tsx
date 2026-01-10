import { useCallback, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NavigationParams } from '@types';
import { Button, H1, Spinner, Text, XStack, YStack, useTheme } from '@ui/index';
import { Icon } from '@components/Icon';
import { InvoiceCard } from '@components/InvoiceCard';
import { SortInvoicesBottomSheet, type SortOption } from '@components/SortInvoicesBottomSheet';
import { useInfiniteInvoices } from '@queries/useInfiniteInvoices';
import { WithSuspense } from '@utils/withSuspense';

const InvoicesList = () => {
  const { navigate } = useNavigation<NavigationProp<NavigationParams>>();
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const theme = useTheme();

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
        <Text color="$color12">No invoices found.</Text>
        <Button onPress={() => navigate('Editor')}>Create a new invoice</Button>
      </YStack>
    );
  }, [navigate]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background?.val }]}
      edges={['top']}>
      <YStack flex={1} style={[styles.container, { backgroundColor: theme.backgroundHover?.val }]}>
        <YStack
          style={[
            styles.header,
            {
              backgroundColor: theme.background?.val,
              borderBottomColor: theme.borderColor?.val,
            },
          ]}>
          <XStack style={styles.headerContent}>
            <H1 size="$6" fontWeight="600">
              Your invoices
            </H1>
            <Button
              circular
              style={{ backgroundColor: theme.backgroundHover?.val }}
              size="$3"
              onPress={handleOpenFilter}>
              <Icon name="ArrowDownUp" size={16} color={theme.color12?.val} />
            </Button>
          </XStack>
          <Text fontSize="$3" color="$color11">
            {totalCount} total invoices
          </Text>
        </YStack>
        <View style={{ backgroundColor: theme.color3?.val }}>
          <FlatList
            data={invoices}
            renderItem={renderInvoiceItem}
            keyExtractor={(item) => `invoice-${item.id}`}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>

        <SortInvoicesBottomSheet
          isOpen={bottomSheetOpen}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          onClose={handleCloseFilter}
        />
      </YStack>
    </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
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
});
