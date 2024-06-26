import React, { useState, useContext, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setDoc, doc } from 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import ScreenTemplate from '../../components/ScreenTemplate';
import TextInputBox from '../../components/TextInputBox';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import { firestore, auth } from '../../firebase/config';
import { colors, fontSize } from '../../theme';
import { defaultAvatar } from '../../config';

export default function Registration() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [spinner, setSpinner] = useState(false);
  const navigation = useNavigation();
  const isDark = true;
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  };

  useEffect(() => {
    console.log('Registration screen');
  }, []);

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    try {
      setSpinner(true);
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const uid = response?.user.uid;
      const data = {
        id: uid,
        email,
        fullName,
        avatar: defaultAvatar,
        Sell: ['Seeds', 'Fungicides', 'Insecticides', 'Weedicides', 'Fertilizers'],
        Credit: ['Seeds', 'Pesticides', 'Fertilizers'],
        quickadd: [
          {
            title: 'Vatana',
            category: 'Seeds',
            amounts: ['1000', '2000', '3000'],
          },
        ],
        joined: new Date(),
        inventory: {
          seeds: {
            crops: ['Vatana', 'Ghevda'],
            variety: ['Variety 1', 'Variety 2'],
            company: ['Company 1', 'Company 2'],
          },
          fertilizers: {
            name: ['Fertiliser 1', 'Fertiliser 2'],
            company: ['Company 1', 'Company 2'],
          },
          pesticides: {
            name: ['Pesticide 1', 'Pesticide 2'],
            company: ['Company 1', 'Company 2'],
          },
        },
      };

      const usersRef = doc(firestore, 'users', uid);
      await setDoc(usersRef, data);
    } catch (e) {
      setSpinner(false);
      alert(e);
    }
  };

  return (
    <ScreenTemplate>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <Logo />
          <View style={styles.input}>
            <TextInputBox
              placeholder="Your Name"
              onChangeText={(text) => setFullName(text)}
              value={fullName}
              autoCapitalize="none"
            />
            <TextInputBox
              placeholder="E-mail"
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInputBox
              secureTextEntry
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              autoCapitalize="none"
            />
            <TextInputBox
              secureTextEntry
              placeholder="Confirm Password"
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              autoCapitalize="none"
            />
            <Button
              label="Agree and Create account"
              color={colors.primary}
              onPress={() => onRegisterPress()}
            />
            <View style={styles.footerView}>
              <Text style={[styles.footerText, { color: colorScheme.text }]}>
                Already got an account?{' '}
                <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                  Log in
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Spinner
        visible={spinner}
        textStyle={{ color: colors.white }}
        overlayColor="rgba(0,0,0,0.5)"
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: fontSize.large,
  },
  footerLink: {
    color: colors.blueLight,
    fontWeight: 'bold',
    fontSize: fontSize.large,
  },
  link: {
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 500,
  },
});
