import { useCallback, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { Text, XStack, YStack, useTheme } from '@ui/index';
import { useInfiniteProducts } from '@queries/useInfiniteProducts';
import { useSelection } from '@contexts/SelectionContext';
import type { Components } from '@api/generated/client';
import type { EditorStackParams } from '@navigators/EditorStack';

type Product = Components.Schemas.Product;

type ProductsListProps = {
  searchQuery: string;
  onTotalCountChange?: (count: number) => void;
};

export const ProductsList = ({ searchQuery, onTotalCountChange }: ProductsListProps) => {
  const navigation = useNavigation<NavigationProp<EditorStackParams>>();
  const route = useRoute<RouteProp<EditorStackParams, 'ProductSelect'>>();
  const theme = useTheme();
  const { setProductAt } = useSelection();
  const productIndex = (route.params as { index?: number })?.index ?? null;

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
      if (productIndex !== null) {
        setProductAt(productIndex, product);
        navigation.goBack();
      }
    },
    [productIndex, setProductAt, navigation],
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
      testID="products-list"
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
