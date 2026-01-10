import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EditorScreen } from '@screens/Editor';
import { HomeStack } from './HomeStack';
import { useTheme } from '@ui/index';
import { Icon } from '@components/Icon';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.blue10?.val,
        tabBarInactiveTintColor: theme.color10?.val,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: theme.background?.val,
          borderTopColor: theme.borderColor?.val,
          paddingBottom: 10,
          paddingTop: 5,
          height: 80,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Invoices',
          tabBarLabel: 'Invoices',
          tabBarIcon: ({ color, size }) => <Icon name="FileText" color={color} size={size} />,
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
  );
};
