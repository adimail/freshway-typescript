import React, { useContext } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors, fontSize } from '../../theme';

export default function RenderItem(props) {
  const { title, body } = props?.item;

  const isDark = true;
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colorScheme.text }]}>{title}</Text>
      <Text style={[styles.body, { color: colorScheme.text }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: fontSize.large,
  },
  body: {
    fontSize: fontSize.small,
  },
});
