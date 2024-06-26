/* eslint-disable react/react-in-jsx-scope */
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { fontSize, colors } from '../theme';
import { View, Text } from 'react-native';

const showToast = ({ title, body }) => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: body,
  });
};

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: () => {
    const styles = {
      backgroundColor: colors.white,
      text1Color: colors.black,
      text2Color: colors.darkPurple,
    };
    return (
      <BaseToast
        style={{ borderLeftColor: colors.primary }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          backgroundColor: styles.backgroundColor,
        }}
        text1Style={{
          fontSize: fontSize.middle,
          fontWeight: '400',
          color: styles.text1Color,
        }}
        text2Style={{
          fontSize: fontSize.small,
          fontWeight: '400',
          color: styles.text2Color,
        }}
      />
    );
  },
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: () => (
    <ErrorToast
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

export { showToast, toastConfig };
