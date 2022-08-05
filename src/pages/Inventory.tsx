import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';

type Props = NativeStackScreenProps<RootStackParamList, 'Inventory', 'MyStack'>;

const Inventory = ({}: Props) => {
  return (
    <View>
      <Text>Inventory</Text>
    </View>
  );
};

export default Inventory;

const styles = StyleSheet.create({});
