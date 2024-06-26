import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../../../scenes/login';
import Registration from '../../../scenes/registration';

const Stack = createStackNavigator();

export const LoginNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registration" component={Registration} />
    </Stack.Navigator>
  );
};
