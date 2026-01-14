import { useState } from 'react';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { ProductsList } from '@components/ProductsList';
import { SelectScreen } from '@components/SelectScreen';
import type { EditorStackParams } from '@navigators/EditorStack';

export const ProductSelectScreen = () => {
  const navigation = useNavigation<NavigationProp<EditorStackParams>>();
  const route = useRoute<RouteProp<EditorStackParams, 'ProductSelect'>>();
  const productIndex = (route.params as { index?: number })?.index ?? null;
  const [totalCount, setTotalCount] = useState(0);

  if (productIndex === null) {
    navigation.goBack();
    return null;
  }

  return (
    <SelectScreen
      title="Select Product"
      searchPlaceholder="Search products..."
      itemName="product"
      onClose={() => navigation.goBack()}
      totalCount={totalCount}>
      {(debouncedSearchQuery) => (
        <ProductsList searchQuery={debouncedSearchQuery} onTotalCountChange={setTotalCount} />
      )}
    </SelectScreen>
  );
};
