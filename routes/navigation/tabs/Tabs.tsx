import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../theme';

import {
  HomeNavigator,
  ProfileNavigator,
  HistoryNavigator,
  InventoryNavigator,
  InventoryHistoryNavigator,
} from '../stacks';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const tabScreens = [
    {
      name: 'HomeTab',
      component: HomeNavigator,
      label: 'Home',
      iconName: 'home',
    },
    {
      name: 'InventoryHistoryTab',
      component: InventoryHistoryNavigator,
      label: 'Inventory',
      iconName: 'boxes',
    },
    {
      name: 'InventoryTab',
      component: InventoryNavigator,
      label: 'Add New Stock',
      iconName: 'people-carry',
    },
    {
      name: 'HistoryTab',
      component: HistoryNavigator,
      label: 'History',
      iconName: 'shopping-cart',
    },
    {
      name: 'ProfileTab',
      component: ProfileNavigator,
      label: 'Profile',
      iconName: 'user-alt',
    },
  ];

  const renderTabIcon = (iconName: string, color: string) => (
    <FontIcon name={iconName} color={color} size={22} />
  );

  return (
    <Tab.Navigator
      options={{
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: 'gray',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
      defaultScreenOptions={{
        headerShown: false,
        headerTransparent: true,
      }}
      screenOptions={() => ({
        headerShown: false,
        tabBarActiveTintColor: colors.lightPurple,
        tabBarInactiveTintColor: colors.gray,
      })}
      initialRouteName="HomeTab"
      swipeEnabled={false}>
      {tabScreens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarLabel: screen.label,
            tabBarIcon: ({ color }) => renderTabIcon(screen.iconName, color),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigator;
