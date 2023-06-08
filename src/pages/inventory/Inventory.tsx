import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import QRButton from 'components/Buttons/QRButton';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import HorizontalListSeparator from 'components/List/HorizontalListSeparator';
import PageContainer from 'components/PageContainer/PageContainer';
import Search from 'components/Search/Search';
import AppText from 'components/Text/AppText';
import {COLORS} from 'constants/colors';
import {scanResultModalColors} from 'constants/constants';
import useDebounce from 'hooks/debounce';
import {useInventory} from 'hooks/inventory';
import moment from 'moment';
import {InventoryParamList} from 'navigation/Home/Inventory';
import {RootStackParamList} from 'navigation/Navigation';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ItemExtended} from 'redux/inventory/inventory.api';
import {findItemsByQRQuery} from 'utils/inventoryQueries';
import {QRzeros} from 'utils/utils';

type InventoryScreenProps = CompositeScreenProps<
  NativeStackScreenProps<InventoryParamList, 'Inventory', 'MyStack'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Inventory = ({navigation}: InventoryScreenProps) => {
  const [search, setSearch] = useState<string>('');
  const [suggestions, setSuggestions] = useState<ItemExtended[]>();
  // const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    db,
    date,
    lastScanned,
    closeInventory,
    getItemInfo,
    openInventory,
    scan,
  } = useInventory();

  const {textColor, title, getContent} =
    scanResultModalColors.filter(color => color.status === scan?.status)?.[0] ??
    {};

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const searchItem = async () => {
      const [{rows}] = await db.executeSql(findItemsByQRQuery, [
        debouncedSearch,
      ]);
      setSuggestions(rows.raw());
    };
    searchItem();
  }, [debouncedSearch]);

  const switchInventory = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Подтвердите действие',
        'Вы уверены, что хотите закрыть инвентаризацию?',
        [
          {
            text: 'Не закрывать',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Да, закрыть',
            onPress: () => {
              closeInventory();
              setSearch('');
              setSuggestions([]);
            },
          },
        ],
      );
    } else {
      openInventory();
    }
  };

  return (
    <PageContainer>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            width: '100%',
          }}>
          <TouchableOpacity
            style={{
              padding: 10,
              height: 60,
              justifyContent: 'center',
              backgroundColor: COLORS.white,
              margin: 5,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: COLORS.primary,
            }}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('InventoryDownload');
            }}>
            <Icon name="server-outline" size={25} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={{flexGrow: 1}}>
            <ContentBlock
              button={{
                text: date ? 'Все сканирования' : '',
                action: () => navigation.navigate('InventoryScans'),
                size: 21,
              }}>
              <TouchableOpacity
                style={styles.inventoryInfoContainer}
                onPress={() => switchInventory(!Boolean(date))}
                activeOpacity={0.6}>
                <AppText style={{color: COLORS.black}}>
                  {date ? `Открыта ${moment(date).format('L')}` : 'Не открыта'}
                </AppText>
                <Switch
                  style={{
                    transform: [{scaleX: 1.2}, {scaleY: 1.2}],
                    width: 50,
                    height: 20,
                  }}
                  trackColor={{false: COLORS.lightgray, true: '#add8e6'}}
                  thumbColor={COLORS.lightBlue}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={switchInventory}
                  value={Boolean(date)}
                />
              </TouchableOpacity>
            </ContentBlock>
          </View>
        </View>

        {date ? (
          <View>
            <Search
              search={search}
              setSearch={setSearch}
              onSuggestionPress={({qr, name, model, serial_number}) => {
                setSuggestions(undefined);
                getItemInfo([qr.toString(), name, model, serial_number]);
              }}
              suggestions={suggestions}
              showSuggestions={!!suggestions?.length}
            />
            <QRButton
              action={() => {
                navigation.navigate('Scanner', {
                  setScan: (data: string) => getItemInfo(data),
                });
              }}
            />
            {scan ? (
              <ContentBlock title="Сканирование">
                <AppText style={[styles.scanResultHeader, {color: textColor}]}>
                  {title}
                </AppText>
                <ScrollView>{getContent(scan.scan)}</ScrollView>
                {suggestions?.[0]?.place_name ? (
                  <AppText style={{color: COLORS.black, fontSize: 16}}>
                    {suggestions?.[0].place_name}
                  </AppText>
                ) : null}
                {suggestions?.[0]?.user_name ? (
                  <AppText style={{color: COLORS.black, fontSize: 16}}>
                    {suggestions?.[0].user_name}
                  </AppText>
                ) : null}
              </ContentBlock>
            ) : null}
            {lastScanned.length ? (
              <ContentBlock
                transparent
                helperText="10 последних"
                title="Предыдущие сканирования"
                button={{
                  text: 'Все',
                  action: () => navigation.navigate('InventoryScans'),
                  size: 18,
                }}>
                <FlatList
                  horizontal={true}
                  data={lastScanned}
                  ItemSeparatorComponent={() => <HorizontalListSeparator />}
                  renderItem={({item}) => {
                    const colorItem = scanResultModalColors.filter(
                      res => res.status === item.status,
                    )[0];
                    return (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                          backgroundColor: colorItem.backgroundColor,
                          borderRadius: 10,
                          padding: 10,
                          marginRight: 5,
                          maxWidth: Dimensions.get('screen').width - 20,
                        }}>
                        <AppText style={styles.prevScanText}>
                          {QRzeros(item.inventoryNum)}
                        </AppText>
                        <AppText style={styles.prevScanText}>
                          {item.name !== 'Не в учете' ? item.name : item.model}
                        </AppText>
                        {item.position ? (
                          <AppText style={styles.prevScanText}>
                            Строка ведомости: {item.position}
                          </AppText>
                        ) : null}
                        {item.place ? (
                          <AppText style={styles.prevScanText}>
                            {item.place}
                          </AppText>
                        ) : null}
                        <AppText style={styles.prevScanText}>
                          {colorItem.title}
                        </AppText>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(_, index) => index.toString()}
                />
              </ContentBlock>
            ) : null}
          </View>
        ) : (
          <ContentBlock>
            <AppText style={[styles.inventoryText, {color: COLORS.black}]}>
              Для начала работы откройте инвентаризацию
            </AppText>
          </ContentBlock>
        )}
      </ScrollView>
    </PageContainer>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  inventoryInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  inventoryText: {
    fontSize: 18,
  },
  prevScanText: {
    // fontSize: 18,
    fontWeight: '500',
    color: COLORS.white,
  },
  scanResultHeader: {
    fontSize: 20,
    textAlign: 'left',
    paddingVertical: 2,
    fontWeight: '500',
  },
});
