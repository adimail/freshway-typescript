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

export const InventoryNavigatorTabs = () => {
  const navigation = useNavigation();
  const NavigateToCategories = () => {
    navigation.navigate('ModalStacks', {
      screen: 'Post',
      params: {
        from: 'Home screen',
      },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ paddingRight: 16 }}>
          <FontAwesome
            name="plus-circle"
            size={27}
            onPress={() => NavigateToCategories()}
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
