/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { screenOptions } from './navigationProps/navigationProps';

import {
  SeedsNavigator,
  FertilizersNavigator,
  PesticidesNavigator,
} from '../stacks/topTabStacks/inventoryNavigator';

const Tab = createMaterialTopTabNavigator();

const NavigateToCategories = (navigation: any) => {
  navigation.navigate('ModalStacks', {
    screen: 'Post',
    params: {
      from: 'Home screen',
    },
  });
};

export const InventoryNavigatorTabs = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ paddingRight: 16 }}>
          <FontAwesome
            name="folder-open"
            size={27}
            onPress={() => NavigateToCategories(navigation)}
            color={colors.lightPurple}
          />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <Tab.Navigator initialRouteName="SeedsView" screenOptions={screenOptions}>
      <Tab.Screen name="SeedsView" component={SeedsNavigator} options={{ tabBarLabel: 'Seeds' }} />
      <Tab.Screen
        name="PesticidesView"
        component={PesticidesNavigator}
        options={{ tabBarLabel: 'Pesticides' }}
      />
      <Tab.Screen
        name="FertilizersView"
        component={FertilizersNavigator}
        options={{ tabBarLabel: 'Fertilizers' }}
      />
    </Tab.Navigator>
  );
};
