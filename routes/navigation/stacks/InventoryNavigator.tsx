import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InventoryNavigatorTabs } from '../toptabs/InventoryNavigatorTabs';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

export const InventoryNavigator = () => {
  return (
    <Stack.Navigator>
      <RootStack.Group>
        <Stack.Screen name="Add New Stock" component={InventoryNavigatorTabs} />
      </RootStack.Group>
    </Stack.Navigator>
  );
};
