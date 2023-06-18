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
import React, {useEffect, useRef, useState} from 'react';
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
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import Search from 'components/Search/Search';

type DocsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DocsParamList, 'Docs', 'MyStack'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Docs = ({navigation}: DocsScreenProps) => {
  const {docsScan} = useAppSelector(state => state.scan);

  const {history} = useAppSelector(state => state.docs);

  const {setDocsScan, setDocsHistory} = useActions();

  const historyRef = useRef<FlatList>(null);

  const [
    getItem,
    {isLoading, isError, data: itemData, error: getItemError, isFetching},
  ] = useLazyGetItemQuery();

  const [searchSuggestions, {data: suggestions}] =
    useLazyGetSearchSuggestionsQuery();

  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const [search, setSearch] = useState('');

  useEffect(() => {
    onItemScan();
  }, [docsScan]);

  useEffect(() => {
    if (
      getItemError &&
      //@ts-ignore
      (getItemError.name === 'AbortError' ||
        //@ts-ignore
        getItemError.status === 'FETCH_ERROR')
    ) {
      console.log('getItemError', getItemError);
      Snackbar.show({
        text: 'Ошибка при получении данных, проверьте подключение к интернету и VPN серверу',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: COLORS.red,
        textColor: 'white',
      });
    }
  }, [getItemError]);

  useEffect(() => {
    if (search) {
      try {
        setShowSuggestions(true);
        searchSuggestions({q: search});
      } catch (e) {
        console.log('suggestions error', e);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [search]);

  const onItemScan = async () => {
    try {
      const [inventoryNum] = parseQrCode(docsScan);
      const {name, serial_number, model, qr} = await getItem(
        +inventoryNum.substring(inventoryNum.length - 5),
      ).unwrap();
      if (qr !== history[0].qr) {
        setDocsHistory({
          name,
          qr,
          serial_number,
          model,
          data: docsScan,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageContainer>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }>
        <Search
          setSearch={setSearch}
          search={search}
          onSuggestionPress={({name, qr, serial_number, model}) => {
            setDocsHistory({
              name,
              qr,
              serial_number,
              model,
              data: QRzeros(qr),
            });
            setDocsScan(QRzeros(qr));
            setShowSuggestions(false);
          }}
          showSuggestions={showSuggestions}
          suggestions={suggestions}
        />

        <QRButton
          style={{marginTop: 10}}
          action={() =>
            navigation.navigate('Scanner', {
              setScan: data => {
                const [inventoryNum, name, model, serial_number] =
                  parseQrCode(data);
                setDocsScan(data);
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
              ref={historyRef}
              ItemSeparatorComponent={() => <HorizontalListSeparator />}
              renderItem={({
                item: {name, qr, serial_number, data, model},
                index,
              }) => (
                <TouchableOpacity
                  onPress={() => {
                    setDocsScan(data);
                    historyRef?.current?.scrollToOffset({
                      animated: true,
                      offset: 0,
                    });
                  }}
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
            <ContentBlock title={`${itemData?.name} - ${QRzeros(itemData.qr)}`}>
              {/* <View>
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
              </View> */}
              <AppText style={[styles.itemInfo, {fontWeight: '700'}]}>
                Анализ: {itemData?.analysis.in_stock || 0}/
                {itemData?.analysis.listed || 0}
              </AppText>
              <AppText style={styles.itemInfo}>
                Модель: {itemData?.model}
              </AppText>
              <AppText style={styles.itemInfo}>
                Серийный номер: {itemData?.serial_number}
              </AppText>
              {itemData?.description ? (
                <AppText style={styles.itemInfo}>
                  Описание: {itemData?.description}
                </AppText>
              ) : null}

              {itemData?.additional_information ? (
                <AppText style={styles.itemInfo}>
                  Доп. описание: {itemData?.additional_information}
                </AppText>
              ) : null}
              <View style={styles.itemInfoContainer}>
                <Icon
                  name="person-outline"
                  size={22}
                  color={COLORS.black}
                  style={{marginRight: 5}}
                />
                <AppText style={styles.itemInfo}>
                  {/* Пользователь */}
                  {itemData?.user?.name}
                </AppText>
              </View>
              <View style={styles.itemInfoContainer}>
                <Icon
                  name="archive-outline"
                  size={22}
                  color={COLORS.black}
                  style={{marginRight: 5}}
                />
                <AppText style={styles.itemInfo}>
                  {/* Местоположение */}
                  {itemData?.place?.name}
                </AppText>
              </View>
              <View style={styles.itemInfoContainer}>
                <Icon
                  name="checkmark-done-circle-outline"
                  size={22}
                  color={COLORS.black}
                  style={{marginRight: 5}}
                />
                <AppText style={styles.itemInfo}>
                  {/* Cтатус */}
                  {itemData?.status?.name}
                </AppText>
              </View>
              <View style={styles.itemInfoContainer}>
                <Icon
                  name="print-outline"
                  size={22}
                  color={COLORS.black}
                  style={{marginRight: 5}}
                />
                <AppText style={styles.itemInfo}>
                  {/* Номенкулатура */}
                  {itemData?.device?.name}
                </AppText>
              </View>
              <View style={styles.itemInfoContainer}>
                <Icon
                  name="ios-man-outline"
                  size={22}
                  color={COLORS.black}
                  style={{marginRight: 5}}
                />
                <AppText style={styles.itemInfo}>
                  {/* МОЛ */}
                  {itemData?.person?.name}
                </AppText>
              </View>
              <Button
                style={{marginTop: 10}}
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
  itemInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  itemInfo: {
    fontSize: 17,
    fontWeight: '600',
  },
});
