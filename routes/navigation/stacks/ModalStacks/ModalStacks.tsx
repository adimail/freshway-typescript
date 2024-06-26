import React, { useState, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeTitleContext } from '../../../../context/HomeTitleContext';

import Post from '../../../../scenes/post';
import QuickAdd from '../../../../scenes/quickAdd';
import Month from '../../../../scenes/month';
import InventoryMonth from '../../../../scenes/month/inventoryMonth';

const Stack = createStackNavigator();

export const ModalStacks = () => {
  const [title, setTitle] = useState<string>('default title');

  // Correctly specify the types for title and setTitle
  const contextValue = useMemo(() => ({ title, setTitle }), [title, setTitle]);

  return (
    <HomeTitleContext.Provider value={contextValue}>
      <HomeTitleContext.Consumer>
        {(ctx) => (
          <Stack.Navigator
            screenOptions={{
              headerShown: true,
            }}>
            <Stack.Screen
              name="QuickAdd"
              component={QuickAdd}
              options={{
                title: ctx.title,
                headerBackTitle: '',
              }}
            />
            <Stack.Screen
              name="Post"
              component={Post}
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
          </Stack.Navigator>
        )}
      </HomeTitleContext.Consumer>
    </HomeTitleContext.Provider>
  );
};
