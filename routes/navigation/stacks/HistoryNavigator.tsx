import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ColorSchemeContext } from '../../../context/ColorSchemeContext';

import { lightProps, darkProps } from './navigationProps/navigationProps';
import HeaderStyle from './headerComponents/HeaderStyle';

import {
  InventoryHistoryNavigatorTabs,
  HistoryNavigatorTabs,
} from '../toptabs/HistoryNavigatorTabs';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

export const HistoryNavigator = () => {
  const { scheme } = useContext(ColorSchemeContext);
  const navigationProps = scheme === 'dark' ? darkProps : lightProps;

  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <RootStack.Group>
        <Stack.Screen
          name="History"
          component={HistoryNavigatorTabs}
          options={() => ({
            headerBackground: scheme === 'dark' ? null : () => <HeaderStyle />,
          })}
        />
      </RootStack.Group>
    </Stack.Navigator>
  );
};

export const InventoryHistoryNavigator = () => {
  const { scheme } = useContext(ColorSchemeContext);
  const navigationProps = scheme === 'dark' ? darkProps : lightProps;

  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <RootStack.Group>
        <Stack.Screen
          name="Inventory Overview"
          component={InventoryHistoryNavigatorTabs}
          options={() => ({
            headerBackground: scheme === 'dark' ? null : () => <HeaderStyle />,
          })}
        />
      </RootStack.Group>
    </Stack.Navigator>
  );
};
