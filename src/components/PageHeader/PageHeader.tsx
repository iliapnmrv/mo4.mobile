import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  Animated,
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import type {ParamListBase} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from 'constants/colors';

type BottomTabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;
};

type Props = {
  /**
   * Options for the back button.
   */
  back?: {
    /**
     * Title of the previous screen.
     */
    title: string;
  };
  /**
   * Options for the current screen.
   */
  options: BottomTabNavigationOptions;
};

export default function PageHeader({options, back}: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {back ? (
        //@ts-ignore
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" color={COLORS.black} size={30} />
        </TouchableOpacity>
      ) : null}
      <Text style={styles.headerText}>{options.title}</Text>
    </View>
  );
}

//Styles
const styles = StyleSheet.create({
  header: {
    display: 'flex',
    padding: 20,
    marginTop: 10,
    flexDirection: 'row',
  },
  headerText: {
    width: '100%',
    fontSize: 22,
    paddingHorizontal: 20,
    color: '#000',
  },
});
