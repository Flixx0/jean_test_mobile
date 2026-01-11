import { useCallback, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, XStack, YStack, useTheme } from '@ui/index';
import { useInfiniteCustomers } from '@queries/useInfiniteCustomers';
import type { Components } from '@api/generated/client';

type Customer = Components.Schemas.Customer;

type EditorStackParams = {
  Editor: undefined;
  CustomerSelect: { onSelectCustomer: (customer: Customer) => void };
};

type CustomersListProps = {
  searchQuery: string;
  onSelectCustomer: (customer: Customer) => void;
  onTotalCountChange?: (count: number) => void;
};

export const CustomersList = ({
  searchQuery,
  onSelectCustomer,
  onTotalCountChange,
}: CustomersListProps) => {
  const navigation = useNavigation<NavigationProp<EditorStackParams>>();
  const theme = useTheme();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteCustomers({
    query: searchQuery,
    perPage: 30,
  });

  const customers = data.pages.flatMap((page) => page.customers);
  const totalCount = data.pages[0]?.pagination?.total_entries ?? 0;

  useEffect(() => {
    onTotalCountChange?.(totalCount);
  }, [totalCount, onTotalCountChange]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelectCustomer = useCallback(
    (customer: Customer) => {
      onSelectCustomer(customer);
      navigation.goBack();
    },
    [onSelectCustomer, navigation],
  );

  const renderCustomerItem = useCallback(
    ({ item }: { item: Customer }) => (
      <Pressable
        onPress={() => handleSelectCustomer(item)}
        style={{
          backgroundColor: theme.background?.val,
          borderBottomWidth: 1,
          borderBottomColor: theme.borderColor?.val,
          padding: 16,
        }}>
        <YStack flex={1} gap="$1" style={{ alignItems: 'flex-start' }}>
          <Text fontSize="$4" fontWeight="600" color="$color12">
            {item.first_name} {item.last_name}
          </Text>
          <Text fontSize="$2" color="$color11">
            {item.address}
          </Text>
          <XStack gap="$1" style={{ flexWrap: 'wrap' }}>
            {item.zip_code ? (
              <Text fontSize="$2" color="$color11">
                {item.zip_code}
              </Text>
            ) : null}
            {item.city ? (
              <Text fontSize="$2" color="$color11">
                {item.city}
              </Text>
            ) : null}
          </XStack>
          {item.country ? (
            <Text fontSize="$2" color="$color11">
              {item.country}
              {item.country_code ? ` (${item.country_code})` : ''}
            </Text>
          ) : null}
        </YStack>
      </Pressable>
    ),
    [handleSelectCustomer, theme],
  );

  const renderEmpty = useCallback(() => {
    return (
      <YStack flex={1} style={styles.centerContent} gap="$4" p="$4">
        <Text color="$color11">No customers found.</Text>
        {searchQuery ? (
          <Text fontSize="$2" color="$color11">
            Try a different search term
          </Text>
        ) : null}
      </YStack>
    );
  }, [searchQuery]);

  return (
    <FlatList
      data={customers}
      renderItem={renderCustomerItem}
      keyExtractor={(item) => `customer-${item.id}`}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: 16,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
