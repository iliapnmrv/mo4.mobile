import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

type Props = {
  text: string;
  action: any;
  type?: 'primary' | 'secondary';
};

const Button = ({text, action, type = 'primary'}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, styles[type]]}
      onPress={action}>
      <Text style={[styles.text, styles[`${type}Text`]]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
  },
  primary: {
    backgroundColor: '#80a3ff',
    borderRadius: 3,
  },
  secondary: {
    borderColor: '#8870ff',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#8870ff',
  },
});
