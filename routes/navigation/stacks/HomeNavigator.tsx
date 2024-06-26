import React, { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeTitleContext } from '../../../context/HomeTitleContext';

import Home from '../../../scenes/home';

const Stack = createStackNavigator();

export const HomeNavigator = () => {
  const [title, setTitle] = useState<string>('default title');

  // Correctly specify the types for title and setTitle
  const contextValue = useMemo(() => ({ title, setTitle }), [title, setTitle]);

  return (
    <HomeTitleContext.Provider value={contextValue}>
      <HomeTitleContext.Consumer>
        {() => (
          <Stack.Navigator>
            <Stack.Screen name="Freshway" component={Home} />
          </Stack.Navigator>
        )}
      </HomeTitleContext.Consumer>
    </HomeTitleContext.Provider>
  );
};
