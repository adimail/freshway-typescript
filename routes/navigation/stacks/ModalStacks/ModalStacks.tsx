import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeTitleContext } from '../../../../context/HomeTitleContext';

import Post from '../../../../scenes/post';
import QuickAdd from '../../../../scenes/quickAdd';
import Print from '../../../../scenes/print';
import Month from '../../../../scenes/month';
import Developer from '../../../../scenes/devloper';
import InventoryMonth from '../../../../scenes/month/inventoryMonth';

const Stack = createStackNavigator();

export const ModalStacks = () => {
  const [title, setTitle] = useState('default title');

  return (
    <HomeTitleContext.Provider
      value={{
        title,
        setTitle,
      }}>
      <HomeTitleContext.Consumer>
        {(ctx) => (
          <Stack.Navigator
            screenOptions={{
              headerShown: true,
            }}>
            <Stack.Screen
              name="Post"
              component={Post}
              options={{
                title: ctx.title,
                headerBackTitle: '',
              }}
            />
            <Stack.Screen
              name="QuickAdd"
              component={QuickAdd}
              options={{
                title: ctx.title,
                headerBackTitle: '',
              }}
            />
            <Stack.Screen
              name="Month"
              component={Month}
              options={{
                title: ctx.title,
                headerBackTitle: '',
              }}
            />
            <Stack.Screen
              name="InventoryMonth"
              component={InventoryMonth}
              options={{
                title: ctx.title,
                headerBackTitle: '',
              }}
            />
            <Stack.Screen
              name="Developer"
              component={Developer}
              options={{
                title: ctx.title,
                headerBackTitle: '',
              }}
            />
            <Stack.Screen name="Print" component={Print} />
          </Stack.Navigator>
        )}
      </HomeTitleContext.Consumer>
    </HomeTitleContext.Provider>
  );
};
