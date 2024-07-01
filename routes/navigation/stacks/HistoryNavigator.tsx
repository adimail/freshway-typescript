import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  InventoryHistoryNavigatorTabs,
  HistoryNavigatorTabs,
} from '../toptabs/HistoryNavigatorTabs';

const Stack = createStackNavigator();

export const HistoryNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={HistoryNavigatorTabs} />
    </Stack.Navigator>
  );
};

export const InventoryHistoryNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Inventory Overview" component={InventoryHistoryNavigatorTabs} />
    </Stack.Navigator>
  );
};
