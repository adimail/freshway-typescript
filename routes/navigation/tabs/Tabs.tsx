import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import { colors } from 'theme';

// stack navigators
import {
  HomeNavigator,
  ProfileNavigator,
  HistoryNavigator,
  InventoryNavigator,
  InventoryHistoryNavigator,
} from '../stacks';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
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
    <Tab.Screen
      name="HomeTab"
      component={HomeNavigator}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }: { color: string }) => (
          <FontIcon name="home" color={color} size={22} />
        ),
      }}
    />
    <Tab.Screen
      name="InventoryHistoryTab"
      component={InventoryHistoryNavigator}
      options={{
        tabBarLabel: 'Inventory',
        tabBarIcon: ({ color }: { color: string }) => (
          <FontIcon name="boxes" color={color} size={22} />
        ),
      }}
    />
    <Tab.Screen
      name="InventoryTab"
      component={InventoryNavigator}
      options={{
        tabBarLabel: 'Add New Stock',
        tabBarIcon: ({ color }: { color: string }) => (
          <FontIcon name="people-carry" color={color} size={22} />
        ),
      }}
    />
    <Tab.Screen
      name="HistoryTab"
      component={HistoryNavigator}
      options={{
        tabBarLabel: 'History',
        tabBarIcon: ({ color }: { color: string }) => (
          <FontIcon name="shopping-cart" color={color} size={22} />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileNavigator}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color }: { color: string }) => (
          <FontIcon name="user-alt" color={color} size={22} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default TabNavigator;
