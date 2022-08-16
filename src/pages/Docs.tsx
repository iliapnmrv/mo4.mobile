import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import QRButton from 'components/Buttons/QRButton';
import {useAppDispatch, useAppSelector} from 'hooks/redux';
import {setDocsScan} from 'store/reducers/scanReducer';
import {useLazyGetDocsItemQuery} from 'store/api/docsApi';
import PageContainer from 'components/PageContainer/PageContainer';
import ContentBlock from 'components/ContentBlock/ContentBlock';

type Props = NativeStackScreenProps<RootStackParamList, 'Docs', 'MyStack'>;

const Docs = ({navigation}: Props) => {
  const {docsScan} = useAppSelector(state => state.scan);

  const {history} = useAppSelector(state => state.docs);

  const [getDoc, {isLoading, isError, data: docData, error}] =
    useLazyGetDocsItemQuery();

  useEffect(() => {
    console.log('docsScan', docsScan);
  }, [docsScan]);

  const dispatch = useAppDispatch();

  return (
    <PageContainer>
      <QRButton
        action={() =>
          navigation.navigate('Scanner', {
            setScan: data => dispatch(setDocsScan(data)),
          })
        }
      />
      <ContentBlock title="Сканирование">
        <View>
          <Text>
            {docsScan ? docsScan : 'Отсканируйте код чтобы получить информацию'}
          </Text>
        </View>
      </ContentBlock>
      {/* {docData ? ( */}
      {true ? (
        <ContentBlock title="Изменить информацию">
          <View></View>
        </ContentBlock>
      ) : null}

      {history ? (
        <ContentBlock title="Предыдущие сканирования">
          <View>
            {/* {history.map((item, index) => (
              <Text key={index}>{item}</Text>
            ))} */}
          </View>
        </ContentBlock>
      ) : null}
    </PageContainer>
  );
};

export default Docs;

const styles = StyleSheet.create({});
