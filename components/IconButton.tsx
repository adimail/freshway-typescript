import React from 'react';
import { TouchableOpacity } from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

export default function IconButton(props: any) {
  const { icon, onPress, color, size, containerStyle } = props;

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <FontIcon name={icon} color={color} size={size} />
    </TouchableOpacity>
  );
}
