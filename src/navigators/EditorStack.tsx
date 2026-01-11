import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditorScreen } from '@screens/Editor';
import { CustomerSelectScreen } from '@screens/CustomerSelectScreen';
import { ProductSelectScreen } from '@screens/ProductSelectScreen';
import type { Components } from '@api/generated/client';

type EditorStackParams = {
  Editor: undefined;
  CustomerSelect: { onSelectCustomer: (customer: Components.Schemas.Customer) => void };
  ProductSelect: { onSelectProduct: (product: Components.Schemas.Product) => void };
};

const Stack = createNativeStackNavigator<EditorStackParams>();

export const EditorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Editor"
        component={EditorScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CustomerSelect"
        component={CustomerSelectScreen}
        options={{
          presentation: 'fullScreenModal',
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="ProductSelect"
        component={ProductSelectScreen}
        options={{
          presentation: 'fullScreenModal',
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};
