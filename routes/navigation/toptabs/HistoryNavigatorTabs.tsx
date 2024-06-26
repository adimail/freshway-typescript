import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenOptions } from './navigationProps/navigationProps';

import {
  ThisMonthNavigator,
  ThisMonthInventoryNavigator,
} from '../stacks/topTabStacks/ThisMonthHistoryNavigator';
import {
  AllTimeHistoryNavigator,
  AllTimeInventoryNavigator,
} from '../stacks/topTabStacks/AllTimeHistoryNavigator';

const Tab = createMaterialTopTabNavigator();

export const HistoryNavigatorTabs = () => {
  return (
    <Tab.Navigator initialRouteName="ThisMonthNavigatorTab" screenOptions={screenOptions}>
      <Tab.Screen
        name="ThisMonthNavigatorTab"
        component={ThisMonthNavigator}
        options={{ tabBarLabel: 'This Month' }}
      />
      <Tab.Screen
        name="AllTimeHistoryTab"
        component={AllTimeHistoryNavigator}
        options={{ tabBarLabel: 'All Time' }}
      />
    </Tab.Navigator>
  );
};

export const InventoryHistoryNavigatorTabs = () => {
  return (
    <Tab.Navigator initialRouteName="ThisMonthInventoryNavigatorTab" screenOptions={screenOptions}>
      <Tab.Screen
        name="ThisMonthInventoryNavigatorTab"
        component={ThisMonthInventoryNavigator}
        options={{ tabBarLabel: 'This Month' }}
      />
      <Tab.Screen
        name="AllTimeInventoryHistoryTab"
        component={AllTimeInventoryNavigator}
        options={{ tabBarLabel: 'All Time' }}
      />
    </Tab.Navigator>
  );
};
