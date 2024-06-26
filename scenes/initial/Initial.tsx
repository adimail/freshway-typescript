import React, { useEffect, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { UserDataContext } from '../../context/UserDataContext';
import ScreenTemplate from '../../components/ScreenTemplate';
import { firestore, auth } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { decode, encode } from 'base-64';
import { colors, fontSize } from '../../theme';
import { onAuthStateChanged } from 'firebase/auth';
import { useAtom } from 'jotai';
import { checkedAtom, loggedInAtom } from '../../utils/atom';

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

export default function Initial() {
  const [, setChecked] = useAtom(checkedAtom);
  const [, setLoggedIn] = useAtom(loggedInAtom);
  const { setUserData } = useContext(UserDataContext)!;
  const colorScheme = {
    container: colors.dark,
    text: colors.white,
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const usersRef = doc(firestore, 'users', user.uid);
        onSnapshot(usersRef, (querySnapshot) => {
          const userData = querySnapshot.data();
          setUserData(userData);
          setLoggedIn(true);
          setChecked(true);
        });
      } else {
        setLoggedIn(false);
        setChecked(true);
      }
    });
  }, []);

  return (
    <ScreenTemplate>
      <View style={[styles.container, { backgroundColor: colorScheme.container }]}>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          Fetching shop data from cloud...
        </Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>☁️ ☁️ ☁️</Text>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.xxxLarge,
    marginBottom: 20,
    textAlign: 'center',
  },
});
