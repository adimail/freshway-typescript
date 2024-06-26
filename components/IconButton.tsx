import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

interface IconButtonProps extends TouchableOpacityProps {
  icon: string;
  color: string; // Assuming color is a string based on colors.darkPurple example
  size: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  color,
  size,
  style,
  ...restProps
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <FontIcon name={icon} color={color} size={size} {...restProps} />
    </TouchableOpacity>
  );
};

export default IconButton;
