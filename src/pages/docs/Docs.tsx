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
import {
  useLazyGetItemQuery,
  useLazyGetSearchSuggestionsQuery,
} from 'redux/docs/docs.api';
import {COLORS} from 'constants/colors';
import AppText from 'components/Text/AppText';
import Button from 'components/Buttons/Button';
import {DataTable} from 'react-native-paper';
import moment from 'moment';

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

  const [searchSuggestions, {data: suggestions}] =
    useLazyGetSearchSuggestionsQuery();

  console.log(suggestions);

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // const {data: statuses, refetch: refetchStatuses} = useGetStatusesQuery('');
  // const {data: persons, refetch: refetchPersons} = useGetPersonsQuery('');
  // const {data: storages, refetch: refetchStorages} = useGetStoragesQuery('');
  // const {data: owners, refetch: refetchOwners} = useGetOwnersQuery('');
  // const {data: types, refetch: refetchTypes} = useGetTypesQuery('');

  const [search, setSearch] = useState('');

  useEffect(() => {
    onItemScan();
  }, [docsScan]);

  useEffect(() => {
    if (search) {
      setShowSuggestions(true);
      searchSuggestions({q: search});
    } else {
      setShowSuggestions(false);
    }
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
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }>
        <Input
          setValue={setSearch}
          value={search}
          iconName="search"
          placeholder="Поиск по номеру QR..."
        />
        {showSuggestions ? (
          <View
            style={{
              width: '100%',
            }}>
            {suggestions?.map(({name, qr, serial_number, model, id}) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={id}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.primary,
                  backgroundColor: 'white',
                }}
                onPress={() => {
                  setDocsHistory({
                    name,
                    qr,
                    serial_number,
                    model,
                    data: QRzeros(qr),
                  });
                  setDocsScan(QRzeros(qr));
                  setShowSuggestions(false);
                }}>
                <AppText style={{fontSize: 16}}>
                  {QRzeros(qr)} - {name}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <QRButton
          style={{marginTop: 10}}
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
                    model,
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
              renderItem={({
                item: {name, qr, serial_number, data, model},
                index,
              }) => (
                <TouchableOpacity
                  onPress={() => setDocsScan(data)}
                  activeOpacity={0.7}
                  style={{
                    borderColor:
                      index === 0 ? COLORS.primary + '99' : COLORS.white,
                    borderWidth: 1,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    padding: 10,
                    maxWidth: Dimensions.get('screen').width - 40,
                  }}>
                  <AppText style={{fontSize: 16, fontWeight: '700'}}>
                    {QRzeros(qr)}
                  </AppText>
                  <AppText style={{fontSize: 15}}>{name}</AppText>
                  <AppText style={{fontSize: 15}}>{model}</AppText>
                  <AppText style={{fontSize: 15}}>{serial_number}</AppText>
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

              <AppText>Наименование </AppText>
              <AppText>Модель {itemData?.model}</AppText>
              <AppText>Серийный номер {itemData?.serial_number}</AppText>
              <AppText>Пользователь {itemData?.user?.name}</AppText>
              <AppText>Местоположение {itemData?.place?.name}</AppText>
              <AppText>Cтатус {itemData?.status?.name}</AppText>
              <AppText>Номенкулатура {itemData?.device?.name}</AppText>
              <AppText>МОЛ {itemData?.person?.name}</AppText>
              <Button
                onPress={() =>
                  navigation.navigate('DocsEdit', {
                    id: itemData.qr,
                    title: `Редактирование ${QRzeros(itemData.qr)}`,
                  })
                }
                text="Изменить"
              />
              <ScrollView horizontal>
                <DataTable>
                  <DataTable.Header>
                    <View style={[styles.tableHeader, {width: 280}]}>
                      <DataTable.Title>
                        <AppText style={[styles.tableHeaderText]}>
                          Описание
                        </AppText>
                      </DataTable.Title>
                    </View>
                    <View style={[styles.tableHeader, {width: 100}]}>
                      <DataTable.Title>
                        <AppText style={styles.tableHeaderText}>Дата</AppText>
                      </DataTable.Title>
                    </View>
                    <View style={[styles.tableHeader, {width: 120}]}>
                      <DataTable.Title>
                        <AppText style={styles.tableHeaderText}>
                          Пользователь
                        </AppText>
                      </DataTable.Title>
                    </View>
                  </DataTable.Header>
                  <FlatList
                    data={itemData.logs}
                    renderItem={({item, index}) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          borderBottomColor: '#DCDCDC',
                          borderBottomWidth: 1,
                        }}>
                        <View style={[styles.table, {width: 40}]}>
                          <AppText style={styles.tableText}>
                            {index + 1}
                          </AppText>
                        </View>
                        <View style={[styles.table, {width: 250}]}>
                          <AppText style={styles.tableText}>
                            {item.description.trim()}
                          </AppText>
                        </View>
                        <View style={[styles.table, {width: 100}]}>
                          <AppText style={styles.tableText}>
                            {moment(item.created_at).format('L')}
                          </AppText>
                        </View>
                        <View style={[styles.table, {width: 100}]}>
                          <AppText style={styles.tableText}>
                            {item.author}
                          </AppText>
                        </View>
                      </View>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                  />
                </DataTable>
              </ScrollView>
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
  table: {
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 35,
  },
  tableText: {
    color: COLORS.black,
    paddingVertical: 10,
  },
  tableHeader: {
    paddingRight: 35,
    alignItems: 'center',
  },
  tableHeaderText: {
    color: COLORS.darkgray,
    fontSize: 12,
    fontWeight: '600',
  },
});
