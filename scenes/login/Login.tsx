import React, { useState } from 'react';
import { Text, View, StyleSheet, LogBox } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import ScreenTemplate from '../../components/ScreenTemplate';
import Button from '../../components/Button';
import TextInputBox from '../../components/TextInputBox';
import Logo from '../../components/Logo';
import { colors, fontSize } from '../../theme';
import { auth, firestore } from '../../firebase/config';

// To ignore a useless warning in terminal.
// https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes
// LogBox.ignoreLogs(['Setting a timer']);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [spinner, setSpinner] = useState(false);
  const navigation = useNavigation();
  const colorScheme = {
    text: colors.white,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFooterLinkPress = (navigation: any) => {
    navigation.navigate('Registration');
  };

  const onLoginPress = async () => {
    try {
      setSpinner(true);
      const response = await signInWithEmailAndPassword(auth, email, password);
      const uid = response?.user.uid;
      const usersRef = doc(firestore, 'users', uid);
      const firestoreDocument = await getDoc(usersRef);
      if (!firestoreDocument.exists) {
        setSpinner(false);
        alert('User does not exist anymore.');
      }
    } catch (error) {
      setSpinner(false);
      alert(error);
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
              placeholder="E-mail"
              onChangeText={(text: string) => setEmail(text)}
              autoCapitalize="none"
              value={email}
              keyboardType="email-address"
            />
            <TextInputBox
              secureTextEntry
              placeholder="Password"
              onChangeText={(text: string) => setPassword(text)}
              value={password}
              autoCapitalize="none"
            />
            <Button label="Log in" color={colors.primary} onPress={onLoginPress} />
          </View>
          <View style={styles.footerView}>
            <Text style={[styles.footerText, { color: colorScheme.text }]}>
              Don&apos;t have an account?{' '}
              <Text onPress={() => onFooterLinkPress(navigation)} style={styles.footerLink}>
                Sign up
              </Text>
            </Text>
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
    padding: 20,
    backgroundColor: colors.black,
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
  },
  footerText: {
    fontSize: fontSize.large,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.blueLight,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 20,
  },
  developerInfoTitle: {
    fontSize: fontSize.xLarge,
    fontWeight: 'bold',
    color: colors.blueLight,
    marginBottom: 10,
  },
  developerInfoSubtitle: {
    fontSize: fontSize.large,
    fontWeight: '500',
    color: 'white',
    marginBottom: 10,
  },
  developerInfoText: {
    fontSize: fontSize.large,
    color: colors.primary,
    marginBottom: 5,
  },
});
