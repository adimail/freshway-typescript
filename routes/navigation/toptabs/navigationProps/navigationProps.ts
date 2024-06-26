import { colors } from '../../../../theme';
import { Platform } from 'react-native';

const labelSize = Platform.select({
  ios: 14,
  android: 12,
});

const screenOptions = () => {
  const activeTintColor = colors.white;

  return {
    tabBarLabelStyle: {
      fontSize: labelSize,
    },
    tabBarActiveTintColor: activeTintColor,
    tabBarInactiveTintColor: colors.grayLight,
    tabBarShowLabel: true,
  };
};

export { screenOptions };
