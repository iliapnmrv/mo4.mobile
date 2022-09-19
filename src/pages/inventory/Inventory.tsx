import {
  Alert,
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
  useLazyGetInventoryQuery,
  useUploadInventoryMutation,
} from 'store/inventory/inventory.api';
import {
  createInventoryQuery,
  createScannedQuery,
  insertInventoryQuery,
  isScannedItemQuery,
  addScannedItemQuery,
  updateInventoryQuery,
  findByNameQuery,
  findLastScannedQuery,
  findUpdatedRow,
  findScannedQuery,
  dropScannedQuery,
  dropInventoryQuery,
} from 'utils/inventoryQueries';
import Snackbar from 'react-native-snackbar';
import {IScanned} from 'types/inventory';
import {scanResultModalColors} from 'constants/constants';
import ScanResultModal, {
  ScanModalProps,
} from 'components/Inventory/ScanResultModal';
import {useActions} from 'hooks/actions';
import PageContainer from 'components/PageContainer/PageContainer';
import HorizontalListSeparator from 'components/List/HorizontalListSeparator';
import Button from 'components/Buttons/Button';
import {CompositeScreenProps} from '@react-navigation/native';
import {RootStackParamList} from 'navigation/Navigation';
import {InventoryParamList} from 'navigation/Home/Inventory';
import {COLORS} from 'constants/colors';

type InventoryScreenProps = CompositeScreenProps<
  NativeStackScreenProps<InventoryParamList, 'Inventory', 'MyStack'>,
  NativeStackScreenProps<RootStackParamList>
>;
let db: SQLiteDatabase;

//важная часть для работы бд с промисами
enablePromise(true);

const Inventory = ({navigation}: InventoryScreenProps) => {
  const [getInventory, {isLoading, isError, data: inventoryData, error}] =
    useLazyGetInventoryQuery();

  const [uploadInventory, {data: uploadResult, error: uploadError}] =
    useUploadInventoryMutation();

  const {inventoryScan} = useAppSelector(state => state.scan);
  const {date} = useAppSelector(state => state.inventory);

  const {setInventoryDate, setInventoryScan} = useActions();

  const [scanModal, setScanModal] = useState<ScanModalProps>({
    visible: false,
    status: 1,
  });
  const [scanned, setScanned] = useState<IScanned[]>([]);

  useEffect(() => {
    const openDB = async () => {
      db = await openDatabase({name: 'inventory.db'});
      date ? getLastScanned() : null;
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
    try {
      const [{rows: inventoryResult}] = await db.executeSql(
        findScannedQuery(undefined),
      );
      console.log(inventoryResult.raw());

      await uploadInventory(inventoryResult.raw());

      console.log('uploadResult', uploadResult, uploadError);

      setInventoryDate(undefined);
      setInventoryScan('');
      await db.executeSql(dropInventoryQuery);
      await db.executeSql(dropScannedQuery);
      Snackbar.show({
        text: `Инвентаризация успешно закрыта`,
        duration: Snackbar.LENGTH_LONG,
      });
    } catch (e) {
      console.error(e);
    }
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
        throw new Error(
          'Ошибка при скачивании данных, убедитесь что вы подключены к серверу',
        );
      }

      await db.executeSql(insertInventoryQuery(inventoryData));

      Snackbar.show({
        text: `Данные скачаны, ${inventoryData?.length} строк`,
        duration: 5000,
      });
    } catch (e: any) {
      console.error(e);

      Snackbar.show({
        text: e?.message,
        duration: 5000,
      });
    }
  };

  const getAnalysis = async () => {
    try {
      const [inventoryNum, name, model, serialNum] = inventoryScan
        .split('\n')
        .map(item => item.trim());

      //проверка на повторное считывание
      const [{rows}] = await db.executeSql(isScannedItemQuery, [+inventoryNum]);

      if (rows.length) {
        const prevScanned: IScanned = rows.raw()[0];
        setScanModal({scanned: prevScanned, status: 4, visible: true});
        return;
      }

      //проверка на наличие в бд
      const [{rows: nameRows}] = await db.executeSql(findByNameQuery, [name]);

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
        await db.executeSql(addScannedItemQuery, [
          +inventoryNum,
          name,
          2,
          model,
          serialNum,
        ]);
        return;
      }

      if (!nameRows.raw().filter(item => item.kolvo > 0).length) {
        setScanModal({
          scanned: resData,
          status: 3,
          visible: true,
        });
        await db.executeSql(addScannedItemQuery, [
          +inventoryNum,
          name,
          3,
          model,
          serialNum,
        ]);
        return;
      }

      await db.executeSql(updateInventoryQuery, [name, name]);

      const [{rows: updatedRow}] = await db.executeSql(findUpdatedRow);

      const {place, kolvo, vedpos: position} = updatedRow.raw()[0];

      setScanModal({
        scanned: {...resData, place, position, kolvo},
        status: 1,
        visible: true,
      });

      await db.executeSql(addScannedItemQuery, [
        +inventoryNum,
        name,
        1,
        model,
        serialNum,
        position,
        place,
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      getLastScanned();
    }
  };

  return (
    <PageContainer>
      <ContentBlock
        button={{
          text: 'Все сканирования',
          action: () => navigation.navigate('InventoryScans'),
          size: 21,
        }}>
        <View style={styles.inventoryInfoContainer}>
          <Text style={{color: COLORS.black}}>
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
            trackColor={{false: COLORS.lightgray, true: '#add8e6'}}
            thumbColor={COLORS.lightBlue}
            ios_backgroundColor="#3e3e3e"
            onValueChange={switchInventory}
            value={Boolean(date)}
          />
        </View>
      </ContentBlock>

      <ScanResultModal scanModal={scanModal} setScanModal={setScanModal} />

      {date ? (
        <View>
          <QRButton
            action={() =>
              navigation.navigate('Scanner', {
                setScan: (data: string) => setInventoryScan(data),
              })
            }
          />
          {scanned.length ? (
            <ContentBlock
              transparent
              helperText="10 последних"
              title="Предыдущие сканирования">
              <FlatList
                horizontal={true}
                data={scanned}
                ItemSeparatorComponent={() => <HorizontalListSeparator />}
                renderItem={({item}) => {
                  const colorItem = scanResultModalColors.filter(
                    res => res.status === item.status,
                  )[0];
                  return (
                    <TouchableOpacity
                      // onPress={() => setDocsScan(item)}
                      activeOpacity={0.9}
                      style={{
                        backgroundColor: colorItem.backgroundColor,
                        borderRadius: 10,
                        padding: 10,
                        marginRight: 5,
                        maxWidth: Dimensions.get('screen').width - 20,
                      }}>
                      <Text>{item.inventoryNum}</Text>
                      <Text>{item.name}</Text>
                      {item.position ? (
                        <Text>Строка ведомости: {item.position}</Text>
                      ) : null}
                      {item.place ? <Text>{item.place}</Text> : null}
                      <Text>{colorItem.title}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(_, index) => index.toString()}
              />
            </ContentBlock>
          ) : null}
          {inventoryScan ? (
            <>
              <ContentBlock title={'Сканирование'}>
                <Text style={{color: COLORS.black}}>{inventoryScan}</Text>
              </ContentBlock>
              <Button
                type="secondary"
                text="Получить информацию"
                action={getAnalysis}
              />
            </>
          ) : (
            <Text style={{color: COLORS.black}}>
              Отсканируйте QR, чтобы получить информацию
            </Text>
          )}
        </View>
      ) : (
        <ContentBlock>
          <Text style={[styles.inventoryText, {color: COLORS.black}]}>
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
