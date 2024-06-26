import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ColorSchemeContext } from '../../../context/ColorSchemeContext';

import { lightProps, darkProps } from './navigationProps/navigationProps';
import HeaderStyle from './headerComponents/HeaderStyle';

import { InventoryNavigatorTabs } from '../toptabs/InventoryNavigatorTabs';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

export const InventoryNavigator = () => {
  const { scheme } = useContext(ColorSchemeContext);
  const navigationProps = scheme === 'dark' ? darkProps : lightProps;

  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <RootStack.Group>
        <Stack.Screen
          name="Add New Stock"
          component={InventoryNavigatorTabs}
          options={() => ({
            headerBackground: scheme === 'dark' ? null : () => <HeaderStyle />,
          })}
        />
      </RootStack.Group>
    </Stack.Navigator>
  );
};
