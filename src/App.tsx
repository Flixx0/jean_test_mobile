import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import { UIProvider } from '@ui/config';
import { HomeScreen } from '@screens/Home';
import { EditorScreen } from '@screens/Editor';
import { ApiProvider } from '@api/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const Stack = createStackNavigator();

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://jean-test-api.herokuapp.com/';
const apiToken = Constants.expoConfig?.extra?.apiToken || '';

export const App = () => {
  return (
    <ApiProvider url={apiUrl} token={apiToken}>
      <QueryClientProvider client={queryClient}>
        <UIProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Editor" component={EditorScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </UIProvider>
      </QueryClientProvider>
    </ApiProvider>
  );
};
