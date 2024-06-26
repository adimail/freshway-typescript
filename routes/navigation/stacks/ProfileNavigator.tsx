import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../../../scenes/profile';
import Edit from '../../../scenes/edit';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <RootStack.Group>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Edit" component={Edit} />
      </RootStack.Group>
    </Stack.Navigator>
  );
};
