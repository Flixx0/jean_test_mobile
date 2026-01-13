import { useState } from 'react';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { ProductsList } from '@components/ProductsList';
import { SelectScreen } from '@components/SelectScreen';
import type { Components } from '@api/generated/client';
import type { EditorStackParams } from '@navigators/EditorStack';

type Product = Components.Schemas.Product;

export const ProductSelectScreen = () => {
  const route = useRoute<RouteProp<EditorStackParams, 'ProductSelect'>>();
  const { onSelectProduct } = route.params;
  const navigation = useNavigation<NavigationProp<EditorStackParams>>();
  const [totalCount, setTotalCount] = useState(0);

  return (
    <SelectScreen
      title="Select Product"
      searchPlaceholder="Search products..."
      itemName="product"
      onClose={() => navigation.goBack()}
      totalCount={totalCount}
      onTotalCountChange={setTotalCount}>
      {(debouncedSearchQuery) => (
        <ProductsList
          searchQuery={debouncedSearchQuery}
          onSelectProduct={onSelectProduct}
          onTotalCountChange={setTotalCount}
        />
      )}
    </SelectScreen>
  );
};
