import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditorScreen } from '@screens/Editor';
import { CustomerSelectScreen } from '@screens/CustomerSelectScreen';
import { ProductSelectScreen } from '@screens/ProductSelectScreen';

export type EditorStackParams = {
  Editor: undefined;
  CustomerSelect: undefined;
  ProductSelect: { index: number };
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
