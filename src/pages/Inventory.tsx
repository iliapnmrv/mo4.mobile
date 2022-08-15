import {Alert, Button, StyleSheet, Switch, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import {useAppDispatch, useAppSelector} from 'hooks/redux';
import {setInventoryDate} from 'store/reducers/inventoryReducer';
import moment from 'moment';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import QRButton from 'components/Buttons/QRButton';
import {setInventoryScan} from 'store/reducers/scanReducer';
import {SQLiteDatabase, openDatabase} from 'react-native-sqlite-storage';
import {inventoryApi, useGetInventory} from 'store/api/inventoryApi';
import {
  createInventoryQuery,
  createScannedQuery,
  dropInventoryQuery,
  dropScannedQuery,
  insertInventoryQuery,
  isScannedItemQuery,
} from 'utils/inventoryQueries';
import Snackbar from 'react-native-snackbar';
import {IInventory} from 'types/inventory';
import {inventorySampleData} from 'constants/constants';
import ScanResultModal from 'components/Inventory/ScanResultModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Inventory', 'MyStack'>;
let db: SQLiteDatabase;

const Inventory = ({navigation}: Props) => {
  const [getInventory, {isLoading, isError, data: inventoryData, error}] =
    inventoryApi.useLazyGetInventoryQuery();

  const {inventoryScan} = useAppSelector(state => state.scan);
  const {date} = useAppSelector(state => state.inventory);
  const dispatch = useAppDispatch();

  const [scanModalVisible, setScanModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const openDB = async () => {
      db = await openDatabase({name: 'inventory.db'});
    };
    openDB();
  }, []);

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
    Snackbar.show({
      text: `Инвентаризация успешно закрыта`,
      duration: Snackbar.LENGTH_LONG,
    });
    dispatch(setInventoryDate(undefined));
    db.executeSql(dropInventoryQuery);
    db.executeSql(dropScannedQuery);
  };

  const openInventory = async () => {
    dispatch(setInventoryDate(new Date()));
    getInventoryData();
  };

  const getInventoryData = () => {
    getInventory('');
    db.executeSql(createInventoryQuery);
    db.executeSql(createScannedQuery);

    db.executeSql(insertInventoryQuery(inventorySampleData));

    Snackbar.show({
      text: `Данные скачаны, ${inventorySampleData?.length} строк`,
      duration: 5000,
    });
  };

  const getAnalysis = async () => {
    const [{rows}] = await db.executeSql(isScannedItemQuery(1));
    console.log(rows);

    if (rows.length) {
      console.log(rows.raw());
    }
  };

  return (
    <View>
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

      <ScanResultModal
        visible={scanModalVisible}
        setVisible={setScanModalVisible}
      />

      {date ? (
        <View>
          <QRButton
            action={() =>
              navigation.navigate('Scanner', {
                setScan: (data: string) => dispatch(setInventoryScan(data)),
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
    </View>
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
