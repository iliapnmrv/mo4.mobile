import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import React from 'react';
import {FC} from 'react';
import {ReactNode} from 'react';
import {COLORS} from 'constants/colors';

type Props = {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
};

const AppText: FC<Props> = ({children, style, ...props}) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Rubik',
    fontWeight: '400',
    color: COLORS.black,
  },
});
