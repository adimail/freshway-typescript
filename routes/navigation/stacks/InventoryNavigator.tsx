import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InventoryNavigatorTabs } from '../toptabs/InventoryNavigatorTabs';

const Stack = createStackNavigator();

export const InventoryNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Add New Stock" component={InventoryNavigatorTabs} />
    </Stack.Navigator>
  );
};
