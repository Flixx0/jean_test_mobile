import { useState } from 'react';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { CustomersList } from '@components/CustomersList';
import { SelectScreen } from '@components/SelectScreen';
import type { Components } from '@api/generated/client';

type Customer = Components.Schemas.Customer;

type EditorStackParams = {
  Editor: undefined;
  CustomerSelect: { onSelectCustomer: (customer: Customer) => void };
  ProductSelect: { onSelectProduct: (product: Components.Schemas.Product) => void };
};

export const CustomerSelectScreen = () => {
  const route = useRoute<RouteProp<EditorStackParams, 'CustomerSelect'>>();
  const { onSelectCustomer } = route.params;
  const navigation = useNavigation<NavigationProp<EditorStackParams>>();
  const [totalCount, setTotalCount] = useState(0);

  return (
    <SelectScreen
      title="Select Customer"
      searchPlaceholder="Search customers..."
      itemName="customer"
      onClose={() => navigation.goBack()}
      totalCount={totalCount}
      onTotalCountChange={setTotalCount}>
      {(debouncedSearchQuery) => (
        <CustomersList
          searchQuery={debouncedSearchQuery}
          onSelectCustomer={onSelectCustomer}
          onTotalCountChange={setTotalCount}
        />
      )}
    </SelectScreen>
  );
};
