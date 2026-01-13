import { useState } from 'react';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { CustomersList } from '@components/CustomersList';
import { SelectScreen } from '@components/SelectScreen';
import type { EditorStackParams } from '@navigators/EditorStack';

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
      totalCount={totalCount}>
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
