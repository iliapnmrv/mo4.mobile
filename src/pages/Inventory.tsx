import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import {useAppSelector} from 'hooks/redux';
import moment from 'moment';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import QRButton from 'components/Buttons/QRButton';
import {
  SQLiteDatabase,
  openDatabase,
  enablePromise,
} from 'react-native-sqlite-storage';
import {
  inventoryApi,
  useGetInventoryQuery,
} from 'store/inventory/inventory.api';
import {
  createInventoryQuery,
  createScannedQuery,
  dropInventoryQuery,
  dropScannedQuery,
  insertInventoryQuery,
  isScannedItemQuery,
  addScannedItemQuery,
  updateInventoryQuery,
  findByNameQuery,
  findLastScannedQuery,
} from 'utils/inventoryQueries';
import Snackbar from 'react-native-snackbar';
import {IInventory, IScanned} from 'types/inventory';
import {inventorySampleData} from 'constants/constants';
import ScanResultModal, {
  ScanModalProps,
} from 'components/Inventory/ScanResultModal';
import {useActions} from 'hooks/actions';
import PageContainer from 'components/PageContainer/PageContainer';
import HorizontalListSeparator from 'components/List/HorizontalListSeparator';

type Props = NativeStackScreenProps<RootStackParamList, 'Inventory', 'MyStack'>;
let db: SQLiteDatabase;

//важная часть для работы бд с промисами
enablePromise(true);

const Inventory = ({navigation}: Props) => {
  const [getInventory, {isLoading, isError, data: inventoryData, error}] =
    inventoryApi.useLazyGetInventoryQuery();

  const {inventoryScan} = useAppSelector(state => state.scan);
  const {date} = useAppSelector(state => state.inventory);

  const {setInventoryDate, setInventoryScan} = useActions();

  const [scanModal, setScanModal] = useState<ScanModalProps>({
    visible: false,
    status: 1,
  });
  const [scanned, setScanned] = useState<IScanned[]>([]);

  console.log(scanned);

  useEffect(() => {
    const openDB = async () => {
      db = await openDatabase({name: 'inventory.db'});
      getLastScanned();
    };
    openDB();
  }, []);

  const getLastScanned = async () => {
    try {
      const [{rows: lastScanned}] = await db.executeSql(findLastScannedQuery);
      setScanned(lastScanned.raw());
    } catch (e) {
      console.error(e);
    }
  };

  const switchInventory = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Подтвердите действие',
        'Вы уверены, что хотите закрыть инвентаризационную сессию?',
        [
          {
            text: 'Не закрывать',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Да, закрыть',
            onPress: () => closeInventory(),
          },
        ],
      );
    } else {
      openInventory();
    }
  };

  const closeInventory = async () => {
    setInventoryDate(undefined);
    await db.executeSql(dropInventoryQuery);
    await db.executeSql(dropScannedQuery);
    Snackbar.show({
      text: `Инвентаризация успешно закрыта`,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const openInventory = async () => {
    const today = new Date().toDateString();
    setInventoryDate(today);
    getInventoryData();
  };

  const getInventoryData = async () => {
    try {
      await getInventory('');
      await db.executeSql(createInventoryQuery);
      await db.executeSql(createScannedQuery);

      if (!inventoryData) {
        throw new Error('Ошибка при скачивании данных');
      }

      await db.executeSql(insertInventoryQuery(inventoryData));

      Snackbar.show({
        text: `Данные скачаны, ${inventoryData?.length} строк`,
        duration: 5000,
      });
    } catch (e: any) {
      Snackbar.show({
        text: e?.message,
        duration: 5000,
      });
    }
  };

  const getAnalysis = async () => {
    const [inventoryNum, name, model, serialNum] = inventoryScan.split('\n');

    //проверка на повторное считывание
    const [{rows}] = await db.executeSql(isScannedItemQuery(+inventoryNum));
    console.log('rows', rows);

    if (rows.length) {
      console.log('rows.raw()[0]', rows.raw()[0]);

      const prevScanned: IScanned = rows.raw()[0];
      setScanModal({scanned: prevScanned, status: 4, visible: true});
      return;
    }

    //проверка на наличие в бд
    const [{rows: nameRows}] = await db.executeSql(findByNameQuery('312'));

    const resData: Omit<IScanned, 'status'> = {
      inventoryNum: +inventoryNum,
      name,
      model,
      serialNum,
    };

    if (!nameRows.length) {
      setScanModal({
        scanned: resData,
        status: 2,
        visible: true,
      });
      await db.executeSql(addScannedItemQuery({...resData, status: 2}));
      return;
    }

    if (!nameRows.raw().filter(item => item.kolvo > 0).length) {
      setScanModal({
        scanned: resData,
        status: 3,
        visible: true,
      });
      await db.executeSql(addScannedItemQuery({...resData, status: 3}));
      return;
    }

    const [{rows: updatedRows}] = await db.executeSql(
      updateInventoryQuery(name),
    );

    console.log('rows', updatedRows);

    const scannedItem = {inventoryNum, name, model, serialNum};
  };

  return (
    <PageContainer>
      <ContentBlock>
        <View style={styles.inventoryInfoContainer}>
          <Text>
            {date
              ? `Инвентаризация открыта ${moment(date).format('L')}`
              : 'Инвентаризация не открыта'}
          </Text>
          <Switch
            style={{
              transform: [{scaleX: 1.2}, {scaleY: 1.2}],
              width: 50,
              height: 20,
            }}
            ios_backgroundColor="#3e3e3e"
            onValueChange={switchInventory}
            value={Boolean(date)}
          />
        </View>
      </ContentBlock>

      <ScanResultModal scanModal={scanModal} setScanModal={setScanModal} />

      {scanned.length ? (
        <ContentBlock
          transparent
          // helperText="Нажмите, чтобы получить информацию"
          title="Предыдущие сканирования">
          <FlatList
            horizontal={true}
            data={scanned}
            ItemSeparatorComponent={() => <HorizontalListSeparator />}
            renderItem={({item}) => (
              <TouchableOpacity
                // onPress={() => setDocsScan(item)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 10,
                  marginRight: 5,
                  maxWidth: Dimensions.get('screen').width - 20,
                }}>
                <Text>{item.inventoryNum}</Text>
                <Text>{item.inventoryNum}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </ContentBlock>
      ) : null}

      {date ? (
        <View>
          <QRButton
            action={() =>
              navigation.navigate('Scanner', {
                setScan: (data: string) => setInventoryScan(data),
              })
            }
          />
          <ContentBlock title={'Информация сканирования'}>
            <Text>{inventoryScan}</Text>
            <Button title="Получить информацию" onPress={getAnalysis} />
          </ContentBlock>
        </View>
      ) : (
        <ContentBlock>
          <Text style={styles.inventoryText}>
            Для начала работы откройте инвентаризационную сессию
          </Text>
        </ContentBlock>
      )}
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
});
