import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { fontSize, colors } from '../theme';

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.large,
  },
});

export default function Button(props) {
  const { label, onPress, color, disable } = props;

  if (disable) {
    return (
      <View style={[styles.button, { backgroundColor: color, opacity: 0.3 }]}>
        <Text style={styles.buttonText}>{label}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}
