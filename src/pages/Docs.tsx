import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import QRButton from 'components/Buttons/QRButton';
import {useAppDispatch} from 'hooks/redux';
import {setDocsScan} from 'store/reducers/scanReducer';

type Props = NativeStackScreenProps<RootStackParamList, 'Docs', 'MyStack'>;

const Docs = ({navigation}: Props) => {
  const dispatch = useAppDispatch();

  return (
    <View>
      <QRButton
        action={() =>
          navigation.navigate('Scanner', {
            setScan: data => dispatch(setDocsScan(data)),
          })
        }
      />

      <Text>Docs</Text>
    </View>
  );
};

export default Docs;

const styles = StyleSheet.create({});
