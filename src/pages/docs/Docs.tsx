import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import QRButton from 'components/Buttons/QRButton';
import {useAppSelector} from 'hooks/redux';
import {
  useGetOwnersQuery,
  useGetPersonsQuery,
  useGetStatusesQuery,
  useGetStoragesQuery,
  useGetTypesQuery,
  useLazyGetDocsItemQuery,
} from 'store/docs/docs.api';
import PageContainer from 'components/PageContainer/PageContainer';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import {useActions} from 'hooks/actions';
import HorizontalListSeparator from 'components/List/HorizontalListSeparator';
import Input from 'components/Inputs/Input';
import {CompositeScreenProps} from '@react-navigation/native';
import {RootStackParamList} from 'navigation/Navigation';
import {DocsParamList} from 'navigation/Home/Docs';

type DocsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DocsParamList, 'Docs', 'MyStack'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Docs = ({navigation}: DocsScreenProps) => {
  const {docsScan} = useAppSelector(state => state.scan);

  const {history} = useAppSelector(state => state.docs);

  const {setDocsScan, setDocsHistory} = useActions();

  const [getDoc, {isLoading, isError, data: docData, error, isFetching}] =
    useLazyGetDocsItemQuery();

  const {data: statuses, refetch: refetchStatuses} = useGetStatusesQuery('');
  const {data: persons, refetch: refetchPersons} = useGetPersonsQuery('');
  const {data: storages, refetch: refetchStorages} = useGetStoragesQuery('');
  const {data: owners, refetch: refetchOwners} = useGetOwnersQuery('');
  const {data: types, refetch: refetchTypes} = useGetTypesQuery('');

  const [text, onChangeText] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    console.log('docsScan', docsScan);
    // request here
  }, [docsScan]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log('search123', search);
      // request here
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const onPageReloadHandler = () => {
    getDoc('');
    refetchStatuses();
    refetchPersons();
    refetchStorages();
    refetchOwners();
    refetchTypes();
  };

  return (
    <PageContainer>
      <ScrollView
        contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onPageReloadHandler}
          />
        }>
        <Input
          setValue={onChangeText}
          value={text}
          iconName="search"
          placeholder="Поиск по номеру QR, названию..."
        />
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
              {docsScan
                ? docsScan
                : 'Отсканируйте код чтобы получить информацию'}
            </Text>
          </View>
        </ContentBlock>
        {/* {docData ? ( */}
        {true ? (
          <>
            <ContentBlock
              title="Анализ"
              button={{
                text: 'Обновить анализ',
                action: () => console.log,
              }}>
              <View></View>
            </ContentBlock>

            <ContentBlock title="Информация">
              <View></View>
            </ContentBlock>
          </>
        ) : null}
      </ScrollView>
    </PageContainer>
  );
};

export default Docs;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
