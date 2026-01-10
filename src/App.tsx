import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import { UIProvider } from '@ui/config';
import { EditorScreen } from '@screens/Editor';
import { HomeStack } from '@navigators/HomeStack';
import { ApiProvider } from '@api/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Icon } from '@ui/index';

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

const Tab = createBottomTabNavigator();

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://jean-test-api.herokuapp.com/';
const apiToken = Constants.expoConfig?.extra?.apiToken || '';

export const App = () => {
  return (
    <ApiProvider url={apiUrl} token={apiToken}>
      <QueryClientProvider client={queryClient}>
        <UIProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
                headerShown: true,
                tabBarStyle: {
                  paddingBottom: 5,
                  paddingTop: 5,
                  height: 60,
                },
              }}>
              <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                  title: 'Invoices',
                  tabBarLabel: 'Invoices',
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="FileText" color={color} size={size} />
                  ),
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Editor"
                component={EditorScreen}
                options={{
                  title: 'Create',
                  tabBarLabel: 'Create',
                  tabBarIcon: ({ color, size }) => <Icon name="Plus" color={color} size={size} />,
                  headerTitle: 'Create Invoice',
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </UIProvider>
      </QueryClientProvider>
    </ApiProvider>
  );
};
