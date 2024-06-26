import { colors } from '../../../../theme';
import { Platform } from 'react-native';
import { useContext } from 'react'; // import useContext
import { ColorSchemeContext } from '../../../../context/ColorSchemeContext';

const labelSize = Platform.select({
  ios: 14,
  android: 12,
});

const screenOptions = () => {
  const { scheme } = useContext(ColorSchemeContext);
  const isDark = scheme === 'dark';

  const activeTintColor = isDark ? colors.white : 'black';

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
