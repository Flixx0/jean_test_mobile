import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/Home';
import { InvoiceScreen } from '@screens/Invoice';
import { EditorScreen } from '@screens/Editor';
import { CustomerSelectScreen } from '@screens/CustomerSelectScreen';
import { ProductSelectScreen } from '@screens/ProductSelectScreen';
import { useTheme } from '@ui/index';

export type HomeStackParams = {
  HomeScreen: undefined;
  Invoice: { id: number };
  EditInvoice: { id: number };
  CustomerSelect: undefined;
  ProductSelect: { index: number };
};

const Stack = createNativeStackNavigator<HomeStackParams>();

export const HomeStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Invoice"
        component={InvoiceScreen}
        options={({ route }) => ({
          headerTitle: `Invoice #${route.params.id}`,
          headerBackButtonDisplayMode: 'minimal',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          animation: 'slide_from_right',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: theme.color12?.val,
        })}
      />
      <Stack.Screen
        name="EditInvoice"
        component={EditorScreen}
        options={{
          // TODO work with fullScreenModal and tamagui bottom sheet ( currently not working )
          // presentation: 'fullScreenModal',
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_bottom',
          animationDuration: 300,
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
