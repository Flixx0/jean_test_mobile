import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/Home';
import { InvoiceScreen } from '@screens/Invoice';
import { useTheme } from '@ui/index';

type HomeStackParams = {
  HomeScreen: undefined;
  Invoice: { id: number };
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
    </Stack.Navigator>
  );
};
