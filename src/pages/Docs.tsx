import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import QRButton from 'components/Buttons/QRButton';
import {useAppSelector} from 'hooks/redux';
import {useLazyGetDocsItemQuery} from 'store/docs/docs.api';
import PageContainer from 'components/PageContainer/PageContainer';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import {useActions} from 'hooks/actions';
import HorizontalListSeparator from 'components/List/HorizontalListSeparator';

type Props = NativeStackScreenProps<RootStackParamList, 'Docs', 'MyStack'>;

const Docs = ({navigation}: Props) => {
  const {docsScan} = useAppSelector(state => state.scan);

  const {history} = useAppSelector(state => state.docs);

  const {setDocsScan, setDocsHistory} = useActions();

  const [getDoc, {isLoading, isError, data: docData, error}] =
    useLazyGetDocsItemQuery();

  useEffect(() => {
    console.log('docsScan', docsScan);
  }, [docsScan]);

  return (
    <PageContainer>
      <QRButton
        action={() =>
          navigation.navigate('Scanner', {
            setScan: data => {
              setDocsScan(data), setDocsHistory(data);
            },
          })
        }
      />
      {history.length ? (
        <ContentBlock
          transparent
          helperText="Нажмите, чтобы получить информацию"
          title="Предыдущие сканирования">
          <FlatList
            horizontal={true}
            data={history}
            ItemSeparatorComponent={() => <HorizontalListSeparator />}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => setDocsScan(item)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 5,
                  maxWidth: Dimensions.get('screen').width - 20,
                }}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </ContentBlock>
      ) : null}
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
    </PageContainer>
  );
};

export default Docs;

const styles = StyleSheet.create({});
