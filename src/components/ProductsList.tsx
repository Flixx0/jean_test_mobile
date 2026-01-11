import { useCallback, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, XStack, YStack, useTheme } from '@ui/index';
import { useInfiniteProducts } from '@queries/useInfiniteProducts';
import type { Components } from '@api/generated/client';

type Product = Components.Schemas.Product;

type EditorStackParams = {
  Editor: undefined;
  CustomerSelect: { onSelectCustomer: (customer: Components.Schemas.Customer) => void };
  ProductSelect: { onSelectProduct: (product: Product) => void };
};

type ProductsListProps = {
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onTotalCountChange?: (count: number) => void;
};

export const ProductsList = ({
  searchQuery,
  onSelectProduct,
  onTotalCountChange,
}: ProductsListProps) => {
  const navigation = useNavigation<NavigationProp<EditorStackParams>>();
  const theme = useTheme();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts({
    query: searchQuery,
    perPage: 30,
  });

  const products = data.pages.flatMap((page) => page.products);
  const totalCount = data.pages[0]?.pagination?.total_entries ?? 0;

  useEffect(() => {
    onTotalCountChange?.(totalCount);
  }, [totalCount, onTotalCountChange]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelectProduct = useCallback(
    (product: Product) => {
      onSelectProduct(product);
      navigation.goBack();
    },
    [onSelectProduct, navigation],
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <Pressable
        onPress={() => handleSelectProduct(item)}
        style={{
          backgroundColor: theme.background?.val,
          borderBottomWidth: 1,
          borderBottomColor: theme.borderColor?.val,
          padding: 16,
        }}>
        <YStack flex={1} gap="$1" style={{ alignItems: 'flex-start' }}>
          <Text fontSize="$4" fontWeight="600" color="$color12">
            {item.label}
          </Text>
          <XStack gap="$2">
            <Text fontSize="$2" color="$color11">
              Unit: {item.unit}
            </Text>
            <Text fontSize="$2" color="$color11">
              VAT: {item.vat_rate}%
            </Text>
          </XStack>
          <Text fontSize="$3" fontWeight="500" color="$color12">
            {item.unit_price} €
          </Text>
        </YStack>
      </Pressable>
    ),
    [handleSelectProduct, theme],
  );

  const renderEmpty = useCallback(() => {
    return (
      <YStack flex={1} style={styles.centerContent} gap="$4" p="$4">
        <Text color="$color11">No products found.</Text>
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
      data={products}
      renderItem={renderProductItem}
      keyExtractor={(item) => `product-${item.id}`}
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
