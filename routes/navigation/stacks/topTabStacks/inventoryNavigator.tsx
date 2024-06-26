/* eslint-disable import/no-duplicates */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { FertilizersView, SeedsView, PesticidesView } from '../../../../scenes/inventory';

const Stack = createStackNavigator();

export const SeedsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}>
      <Stack.Screen name="SeedsNavigator" component={SeedsView} />
    </Stack.Navigator>
  );
};
export const FertilizersNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}>
      <Stack.Screen name="FertilizersNavigator" component={FertilizersView} />
    </Stack.Navigator>
  );
};
export const PesticidesNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}>
      <Stack.Screen name="PesticidesNavigator" component={PesticidesView} />
    </Stack.Navigator>
  );
};
