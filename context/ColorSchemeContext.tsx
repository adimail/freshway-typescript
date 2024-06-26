/* eslint-disable react/destructuring-assignment */
import React, { useState, createContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ColorSchemeContextProvider = (props) => {
  const colorScheme = useColorScheme();
  const [scheme, setScheme] = useState(colorScheme);

  useEffect(() => {
    setScheme(colorScheme);
  }, [colorScheme]);

  return (
    <ColorSchemeContext.Provider
      value={{
        scheme,
        setScheme,
      }}>
      {props.children}
    </ColorSchemeContext.Provider>
  );
};

export const ColorSchemeContext = createContext();
