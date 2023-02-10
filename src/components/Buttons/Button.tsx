import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';

type Props = {
  text: string;
  onPress: () => void;
  type?: 'primary' | 'outlined';
};

const Button = ({text, onPress, type = 'primary'}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, styles[type]]}
      onPress={onPress}>
      <AppText style={[styles.text, styles[`${type}Text`]]}>{text}</AppText>
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
    borderRadius: 3,
  },
  text: {
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
});
