import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AllTimeHistory from '../../../../scenes/AllTimeHistory';
import AllTimeInventoryHistory from '../../../../scenes/AllTimeHistory/AllTimeInventoryHistory';

const Stack = createStackNavigator();

export const AllTimeHistoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}>
      <Stack.Screen name="AllTimeHistory" component={AllTimeHistory} />
    </Stack.Navigator>
  );
};

export const AllTimeInventoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}>
      <Stack.Screen name="AllTimeInventoryInventory" component={AllTimeInventoryHistory} />
    </Stack.Navigator>
  );
};
