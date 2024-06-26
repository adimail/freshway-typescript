import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ThisMonthHistory from '../../../../scenes/ThisMonthHistory';
import ThisMonthInventoryHistory from '../../../../scenes/ThisMonthHistory/ThisMonthInventoryHistory';

const Stack = createStackNavigator();

export const ThisMonthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}>
      <Stack.Screen name="ThisMonthHistory" component={ThisMonthHistory} />
    </Stack.Navigator>
  );
};

export const ThisMonthInventoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}>
      <Stack.Screen name="ThisMontInventoryHistory" component={ThisMonthInventoryHistory} />
    </Stack.Navigator>
  );
};
