import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import { UIProvider } from '@ui/config';
import { TabNavigator } from '@navigators/TabNavigator';
import { ApiProvider } from '@api/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SelectionProvider } from '@contexts/SelectionContext';

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

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://jean-test-api.herokuapp.com/';
const apiToken = Constants.expoConfig?.extra?.apiToken || '';

export const App = () => {
  return (
    <ApiProvider url={apiUrl} token={apiToken}>
      <QueryClientProvider client={queryClient}>
        <UIProvider>
          <SelectionProvider>
            <NavigationContainer>
              <TabNavigator />
            </NavigationContainer>
          </SelectionProvider>
        </UIProvider>
      </QueryClientProvider>
    </ApiProvider>
  );
};
