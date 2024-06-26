import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function TextInputBox(props) {
  const { secureTextEntry, placeholder, onChangeText, value, autoCapitalize, keyboardType } = props;
  const colorScheme = {
    input: colors.darkInput,
    text: colors.white,
  };

  return (
    <TextInput
      style={[styles.input, { backgroundColor: colorScheme.input, color: colorScheme.text }]}
      placeholderTextColor={colors.grayLight}
      secureTextEntry={secureTextEntry}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      underlineColorAndroid="transparent"
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    width: 300,
    alignSelf: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
});
