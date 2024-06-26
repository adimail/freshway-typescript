import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  InventoryHistoryNavigatorTabs,
  HistoryNavigatorTabs,
} from '../toptabs/HistoryNavigatorTabs';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

export const HistoryNavigator = () => {
  return (
    <Stack.Navigator>
      <RootStack.Group>
        <Stack.Screen name="History" component={HistoryNavigatorTabs} />
      </RootStack.Group>
    </Stack.Navigator>
  );
};

export const InventoryHistoryNavigator = () => {
  return (
    <Stack.Navigator>
      <RootStack.Group>
        <Stack.Screen name="Inventory Overview" component={InventoryHistoryNavigatorTabs} />
      </RootStack.Group>
    </Stack.Navigator>
  );
};
