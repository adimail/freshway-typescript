import React, { useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Avatar } from '@rneui/themed';
import ScreenTemplate from '../../components/ScreenTemplate';
import Button from '../../components/Button';

import { UserDataContext } from '../../context/UserDataContext';
import { useNavigation } from '@react-navigation/native';
import { colors, fontSize } from '../../theme';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Restart } from '../../utils/Restart';
import IconButton from '../../components/IconButton';
import Logo from '../../components/Logo';
import { NetSummaryComponent } from '../inventory/summary';

export default function Profile() {
  const { userData } = useContext(UserDataContext)!;
  const navigation = useNavigation();

  const isDark = true;
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  };

  const monthYear = new Date().toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });

  const joinedDate = userData.joined.toDate();

  const goDetail = () => {
    navigation.navigate('Edit', { userData });
  };

  const openGithub = () => {
    Linking.openURL('https://github.com/adimail/freshway');
  };

  const onSignOutPress = () => {
    signOut(auth)
      .then(async () => {
        await Restart();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <ScreenTemplate>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.top} />

        <View style={styles.main}>
          <View style={styles.avatar}>
            <Avatar size="xlarge" rounded source={{ uri: userData.avatar }} />
          </View>
          <Text style={[styles.title, { color: colorScheme.text }]}>{userData.fullName}</Text>
          <Text style={[styles.subtitle, { color: colorScheme.text }]}>{userData.email}</Text>
          <Text style={[styles.subtitle, { color: colorScheme.text }]}>
            {`Joined: ${
              joinedDate &&
              joinedDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            }`}
          </Text>
          <View style={{ paddingVertical: 30 }}>
            <Button label="Edit Profile" color={colors.primary} onPress={goDetail} />
            <Button label="Sign out" color={colors.secondary} onPress={onSignOutPress} />
          </View>
          <NetSummaryComponent refreshTrigger={1} time={monthYear} />
          <Logo />
          <Text
            style={[
              {
                color: colorScheme.text,
                textAlign: 'center',
                marginBottom: 20,
                fontSize: 15,
              },
            ]}>
            Freshway mobile application is developed to manage inventory at the
            <Text style={styles.link}> Freshway Krushi Seva Kendra, Diskal.</Text>
            This application is not for commercial use. To get access, please contact the developer,
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('mailto:adimail2404@gmail.com')}>
              {' '}
              Aditya Godse
            </Text>
          </Text>
          <View
            style={{
              marginTop: 50,
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              paddingHorizontal: 27,
              marginVertical: 10,
            }}>
            <IconButton
              icon="github"
              color={colorScheme.text}
              size={20}
              onPress={openGithub}
              containerStyle={{ paddingRight: 9 }}
            />
          </View>
          <Text
            style={[
              {
                color: colorScheme.text,
                textAlign: 'center',
                marginBottom: 50,
              },
            ]}>
            Made with love by Aditya Godse
          </Text>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  top: {
    height: 111,
    backgroundColor: colors.lightPurple,
    position: 'absolute',
    width: '100%',
  },
  main: {
    flex: 1,
    width: 300,
    alignSelf: 'center',
  },
  title: {
    fontSize: fontSize.xxxLarge,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  avatar: {
    margin: 30,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 500,
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  footerLink: {
    color: colors.blueLight,
    fontWeight: 'bold',
    fontSize: fontSize.large,
  },
  link: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});
