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
import PageContainer from 'components/PageContainer/PageContainer';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import {useActions} from 'hooks/actions';
import HorizontalListSeparator from 'components/List/HorizontalListSeparator';
import Input from 'components/Inputs/Input';
import {CompositeScreenProps} from '@react-navigation/native';
import {RootStackParamList} from 'navigation/Navigation';
import {DocsParamList} from 'navigation/Home/Docs';
import {QRzeros, parseQrCode} from 'utils/utils';
import {useLazyGetItemQuery} from 'redux/docs/docs.api';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';

type DocsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DocsParamList, 'Docs', 'MyStack'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Docs = ({navigation}: DocsScreenProps) => {
  const {docsScan} = useAppSelector(state => state.scan);

  const {history} = useAppSelector(state => state.docs);

  const {setDocsScan, setDocsHistory} = useActions();

  const [getItem, {isLoading, isError, data: itemData, error, isFetching}] =
    useLazyGetItemQuery();

  // const {data: statuses, refetch: refetchStatuses} = useGetStatusesQuery('');
  // const {data: persons, refetch: refetchPersons} = useGetPersonsQuery('');
  // const {data: storages, refetch: refetchStorages} = useGetStoragesQuery('');
  // const {data: owners, refetch: refetchOwners} = useGetOwnersQuery('');
  // const {data: types, refetch: refetchTypes} = useGetTypesQuery('');

  const [text, onChangeText] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    onItemScan();
  }, [docsScan]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log('search123', search);
      // request here
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const onItemScan = async () => {
    try {
      const [inventoryNum] = parseQrCode(docsScan);
      await getItem(+inventoryNum.substring(inventoryNum.length - 5)).unwrap();
    } catch (e) {
      console.log(e);
    }
  };

  // const onPageReloadHandler = () => {
  //   getDoc('');
  //   refetchStatuses();
  //   refetchPersons();
  //   refetchStorages();
  //   refetchOwners();
  //   refetchTypes();
  // };

  return (
    <PageContainer>
      <ScrollView
        // contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
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
                const [inventoryNum, name, model, serial_number] =
                  parseQrCode(data);
                setDocsScan(data),
                  setDocsHistory({
                    name,
                    qr: +inventoryNum.substring(inventoryNum.length - 5),
                    serial_number,
                    data,
                  });
              },
            })
          }
        />
        <ContentBlock
          transparent
          helperText={
            history.length
              ? 'Нажмите, чтобы получить информацию'
              : 'Здесь появятся ваши последние сканирования'
          }
          title="Предыдущие сканирования">
          {history.length ? (
            <FlatList
              horizontal={true}
              data={history}
              ItemSeparatorComponent={() => <HorizontalListSeparator />}
              renderItem={({item: {name, qr, serial_number, data}}) => (
                <TouchableOpacity
                  onPress={() => setDocsScan(data)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    padding: 10,
                    maxWidth: Dimensions.get('screen').width - 20,
                  }}>
                  <AppText>{QRzeros(qr)}</AppText>
                  <AppText>{name}</AppText>
                  <AppText>{serial_number}</AppText>
                </TouchableOpacity>
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          ) : null}
        </ContentBlock>
        {itemData ? (
          <>
            <ContentBlock title={itemData?.name}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  <AppText style={{fontSize: 15}}>В наличии:</AppText>
                  <AppText
                    style={{fontSize: 17, fontWeight: '500', marginLeft: 10}}>
                    {itemData?.analysis.listed}
                  </AppText>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  <AppText style={{fontSize: 15}}>Числится:</AppText>
                  <AppText
                    style={{fontSize: 17, fontWeight: '500', marginLeft: 17}}>
                    {itemData?.analysis.in_stock}
                  </AppText>
                </View>
              </View>
            </ContentBlock>

            <ContentBlock
              title="Информация"
              button={{
                text: 'Изменить',
                action: () =>
                  navigation.navigate('DocsEdit', {id: 1, title: '123'}),
              }}>
              <AppText>Наименование </AppText>
              <AppText>Модель {itemData?.model}</AppText>
              <AppText>Серийный номер {itemData?.serial_number}</AppText>
              <AppText>Пользователь {itemData?.user?.name}</AppText>
              <AppText>Местоположение {itemData?.place?.name}</AppText>
              <AppText>Cтатус {itemData?.status?.name}</AppText>
              <AppText>Номенкулатура {itemData?.device?.name}</AppText>
              <AppText>МОЛ {itemData?.person?.name}</AppText>
              {itemData?.logs?.map(log => (
                <View key={log.id}>
                  <AppText>{log.description}</AppText>
                </View>
              ))}
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
