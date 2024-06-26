import React, { useContext } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';
import TabNavigator from '../tabs/Tabs';
import { ModalStacks } from '../stacks/ModalStacks/ModalStacks';
import { UserDataContext } from '../../../context/UserDataContext';
import IconButton from '../../../components/IconButton';
import { colors } from '../../../theme';

const Stack = createStackNavigator();

export default function RootStack() {
  const { userData } = useContext(UserDataContext)!;

  const openGithub = () => {
    Linking.openURL('https://github.com/adimail/freshway');
  };

  if (userData.token) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="HomeRoot" component={TabNavigator} />
        <Stack.Group
          screenOptions={{
            presentation: 'modal',
            headerShown: false,
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalPresentationIOS,
          }}>
          <Stack.Screen name="ModalStacks" component={ModalStacks} />
        </Stack.Group>
      </Stack.Navigator>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>UNAUTHORISED</Text>
        <Image style={styles.logo} source={require('../../../assets/icon.png')} />
        <Text style={styles.toptext}>
          {userData.email} does not have access to freshway resources.
        </Text>
        <Text style={styles.text}>
          Freshway is not designed for commercial purposes. If you want to access the application,
          please contact the developer
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('http://adimail.github.io/about')}>
            {' '}
            Aditya Godse
          </Text>{' '}
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:7248945402')}>
          <Text style={styles.contact}>7248945402</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:adimail2404@gmail.com')}>
          <Text style={styles.contact}>adimail2404@gmail.com</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 40 }}>
          <IconButton icon="github" color={colors.darkPurple} size={25} onPress={openGithub} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    height: 180,
    width: 180,
    alignSelf: 'center',
    margin: 30,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    maxWidth: 600,
  },
  toptext: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.grayLight,
    marginBottom: 30,
  },
  link: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#007BFF',
  },
  contact: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 5,
  },
  separator: {
    marginTop: 20,
    marginBottom: 50,
    height: 1,
    backgroundColor: 'gray',
    width: '80%',
    alignSelf: 'center',
  },
});
