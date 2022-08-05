import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  Animated,
  StyleProp,
  TextStyle,
} from 'react-native';

type BottomTabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;
};

type Props = {
  /**
   * Options for the current screen.
   */
  options: BottomTabNavigationOptions;
};

export default function PageHeader({options}: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{options.title}</Text>
    </View>
  );
}

//Styles
const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    marginTop: 30,
  },
  headerText: {
    width: '100%',
    fontSize: 22,
    paddingHorizontal: 20,
    color: '#000',
  },
});
