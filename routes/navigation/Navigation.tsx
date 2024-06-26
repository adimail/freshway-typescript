import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { UserDataContext } from '../../context/UserDataContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils/ShowToast';

import { LoginNavigator } from './stacks';
import RootStack from './rootstack/RootStack';

export default function App() {
  const { userData } = useContext(UserDataContext)!;

  return (
    <>
      <NavigationContainer theme={DarkTheme}>
        {userData.id ? <RootStack /> : <LoginNavigator />}
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}
