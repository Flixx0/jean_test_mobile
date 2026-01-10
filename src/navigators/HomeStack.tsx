import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/Home';
import { InvoiceScreen } from '@screens/Invoice';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTitle: 'Pennylane Invoices',
        }}
      />
      <Stack.Screen
        name="Invoice"
        component={InvoiceScreen}
        options={{ headerTitle: '', headerBackButtonDisplayMode: 'minimal' }}
      />
    </Stack.Navigator>
  );
};
