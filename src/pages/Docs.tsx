import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';

type Props = NativeStackScreenProps<RootStackParamList, 'Docs', 'MyStack'>;

const Docs = ({}: Props) => {
  return (
    <View>
      <Text>Inventory</Text>
    </View>
  );
};

export default Docs;

const styles = StyleSheet.create({});
