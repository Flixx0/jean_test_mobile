import { useCallback, useState, useEffect } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NavigationParams } from '../types/index';
import { Button, H1, Input, Spinner, Text, XStack, YStack, useTheme } from '@ui/index';
import { Icon } from '@components/Icon';
import { InvoiceCard } from '@components/InvoiceCard';
import { SortInvoicesBottomSheet, type SortOption } from '@components/SortInvoicesBottomSheet';
import { useInfiniteInvoices } from '@queries/useInfiniteInvoices';

export const HomeScreen = () => {
  const { navigate } = useNavigation<NavigationProp<NavigationParams>>();
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const theme = useTheme();

  const DEBOUNCE_DELAY = 300;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const buildFilter = useCallback((customerName: string): string => {
    if (!customerName.trim()) {
      return JSON.stringify([]);
    }

    return JSON.stringify([{ field: 'customer.first_name', operator: 'eq', value: customerName }]);
  }, []);

  const filter = buildFilter(debouncedSearchQuery);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, isFetching } =
    useInfiniteInvoices({
      filter,
      perPage: 30,
      sortOption,
    });

  const [refreshing, setRefreshing] = useState(false);

  const invoices = data?.pages.flatMap((page) => page.invoices) ?? [];
  const totalCount = data?.pages[0]?.pagination?.total_entries ?? 0;

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

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
    if (isLoading) {
      return (
        <YStack flex={1} style={styles.centerContent}>
          <Spinner size="large" />
        </YStack>
      );
    }

    return (
      <YStack flex={1} style={styles.centerContent} gap="$4">
        <Text color="$color12">No invoices found.</Text>
        <Button onPress={() => navigate('Editor')}>Create a new invoice</Button>
      </YStack>
    );
  }, [navigate, isLoading]);

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
          ]}
          gap="$2">
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
          <Input
            testID="home-search-input"
            placeholder="Search by customer first name..."
            value={searchQuery}
            onChangeText={(e) => {
              const text = typeof e === 'string' ? e : e.nativeEvent.text;
              setSearchQuery(text);
            }}
          />
          <Text fontSize="$3" color="$color11">
            {totalCount} total invoices
          </Text>
        </YStack>
        <View style={{ backgroundColor: theme.color3?.val, flex: 1 }}>
          {isLoading && !data ? (
            <YStack flex={1} style={styles.centerContent}>
              <Spinner size="large" />
            </YStack>
          ) : (
            <FlatList
              data={invoices}
              renderItem={renderInvoiceItem}
              keyExtractor={(item) => `invoice-${item.id}`}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={renderFooter}
              contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing || (isFetching && !isFetchingNextPage)}
                  onRefresh={onRefresh}
                  tintColor={theme.color12?.val}
                />
              }
            />
          )}
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
