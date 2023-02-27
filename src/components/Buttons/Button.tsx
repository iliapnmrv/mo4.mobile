import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';

type Props = {
  text: string;
  onPress: () => void;
  type?: 'primary' | 'outlined' | 'text';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const Button = ({text, onPress, type = 'primary', style, textStyle}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, styles[type], style]}
      onPress={onPress}>
      <AppText style={[styles.commonText, styles[`${type}Text`], textStyle]}>
        {text}
      </AppText>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flex: -1,
    textAlign: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    flexGrow: 1,
  },
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  commonText: {
    textAlign: 'center',
    width: '100%',
    fontSize: 16,
  },
  primaryText: {
    color: 'white',
  },
  outlined: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  outlinedText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  text: {
    backgroundColor: 'white',
  },
  textText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});
