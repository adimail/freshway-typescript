import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import ScreenTemplate from '../../components/ScreenTemplate';
import Button from '../../components/Button';
import { Avatar } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Spinner from 'react-native-loading-spinner-overlay';
import TextInputBox from '../../components/TextInputBox';
import { firestore, storage, auth } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { colors, fontSize } from '../../theme';
import { UserDataContext } from '../../context/UserDataContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { showToast } from '../../utils/ShowToast';

export default function Edit() {
  const { userData } = useContext(UserDataContext)!;
  const navigation = useNavigation();
  const [fullName, setFullName] = useState(userData.fullName);
  const [progress, setProgress] = useState('');
  const [avatar, setAvatar] = useState(userData.avatar);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [spinner, setSpinner] = useState(false);
  const colorScheme = {
    text: colors.white,
    progress: styles.darkprogress,
  };

  const ImageChoiceAndUpload = async () => {
    try {
      if (Platform.OS === 'ios') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission is required for use.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
      });
      if (!result.canceled) {
        const actions = [];
        actions.push({ resize: { width: 300 } });
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          actions,
          {
            compress: 0.4,
          }
        );
        const localUri = await fetch(manipulatorResult.uri);
        const localBlob = await localUri.blob();
        const filename = userData.id + new Date().getTime();
        const storageRef = ref(storage, `avatar/${userData.id}/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, localBlob);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(`${parseInt(progress)}%`);
          },
          (error) => {
            console.log(error);
            alert('Upload failed.');
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setProgress('');
              setAvatar(downloadURL);
            });
          }
        );
      }
    } catch (e) {
      console.log('error', e.message);
      alert('The size may be too much.');
    }
  };

  const profileUpdate = async () => {
    try {
      const data = {
        id: userData.id,
        email: userData.email,
        fullName,
        avatar,
      };
      const usersRef = doc(firestore, 'users', userData.id);
      await updateDoc(usersRef, data);
      navigation.goBack();
    } catch (e) {
      alert(e);
    }
  };

  const onUpdatePassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    try {
      setSpinner(true);
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, password);
      showToast({
        title: 'Password changed',
        body: 'Your password has changed.',
      });
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      console.log(e);
      alert(e);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <ScreenTemplate>
      <KeyboardAwareScrollView
        style={styles.main}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View style={styles.avatar}>
          <Avatar size="xlarge" rounded onPress={ImageChoiceAndUpload} source={{ uri: avatar }} />
        </View>
        <Text style={colorScheme.progress}>{progress}</Text>
        <Text style={[styles.field, { color: colorScheme.text }]}>Name:</Text>
        <TextInputBox
          placeholder={fullName}
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          autoCapitalize="none"
        />
        {/* <Text style={[styles.field, {color: colorScheme.text}]}>Mail:</Text>
        <Text style={[styles.title, {color: colorScheme.text}]}>{userData.email}</Text> */}
        <Button label="Update" color={colors.primary} onPress={profileUpdate} disable={!fullName} />
        <View style={styles.changePasswordContainer}>
          <Text style={[styles.field, { color: colorScheme.text }]}>Change Password:</Text>
          <TextInputBox
            secureTextEntry
            placeholder="Current Password"
            onChangeText={(text) => setCurrentPassword(text)}
            value={currentPassword}
            autoCapitalize="none"
          />
          <TextInputBox
            secureTextEntry
            placeholder="New Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize="none"
          />
          <TextInputBox
            secureTextEntry
            placeholder="Confirm New Password"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            autoCapitalize="none"
          />
          <Button
            label="Change Password"
            color={colors.pink}
            onPress={onUpdatePassword}
            disable={!currentPassword || !password || !confirmPassword}
          />
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
  progress: {
    alignSelf: 'center',
  },
  darkprogress: {
    alignSelf: 'center',
    color: colors.white,
  },
  main: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: fontSize.xxxLarge,
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  avatar: {
    margin: 30,
    alignSelf: 'center',
  },
  changePasswordContainer: {
    paddingVertical: 30,
  },
});
