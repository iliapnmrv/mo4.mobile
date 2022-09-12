import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  YellowBox,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {findScannedQuery} from 'utils/inventoryQueries';
import {IScanned} from 'types/inventory';
import PageContainer from 'components/PageContainer/PageContainer';
import {btnStatus, tableTitle} from 'constants/constants';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import {DataTable} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';

let db: SQLiteDatabase;

//важная часть для работы бд с промисами
enablePromise(true);

const InventoryStatus = () => {
  const [status, setStatus] = useState<number | undefined>();
  const [scanned, setScanned] = useState<IScanned[]>([]);
  useEffect(() => {
    const openDB = async () => {
      db = await openDatabase({name: 'inventory.db'});
      getStatusInventory();
    };
    openDB();
  }, [status]);

  const getStatusInventory = async () => {
    try {
      const [{rows: findScanned}] = await db.executeSql(
        findScannedQuery(status),
      );
      console.log(findScanned.raw(), status);
      
      setScanned(findScanned.raw());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageContainer>
      <ContentBlock title="Фильтр по статусам">
        <FlatList
          horizontal
          scrollEnabled={false}
          data={btnStatus}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{marginHorizontal: 12}}
              key={item.id}
              onPress={() => setStatus(item.id)}>
              <Text style={styles.btnText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </ContentBlock>
      <ContentBlock>
        <View style={{height: '92%'}}>
          {scanned.length ? (
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Инвентарный номер</DataTable.Title>
                  <DataTable.Title>Статус</DataTable.Title>
                  <DataTable.Title>Имя</DataTable.Title>
                  <DataTable.Title>Модель</DataTable.Title>
                  <DataTable.Title>Серийный номер</DataTable.Title>
                  <DataTable.Title>Место</DataTable.Title>
                  <DataTable.Title>Trace</DataTable.Title>
                </DataTable.Header>
                <FlatList
                  data={scanned}
                  renderItem={({item}) => (
                    <DataTable.Row
                      style={{borderStyle: 'solid'}}>
                      <View>
                        <DataTable.Cell>{item.inventoryNum}</DataTable.Cell>
                      </View>
                      <View style={styles.table}>
                        <DataTable.Cell>
                          {(() => {
                            switch (item.status) {
                              case 1:
                                return <Text>В учете</Text>;
                              case 3:
                                return <Text>Сверх учета</Text>;
                              case 2:
                                return <Text>Не в учете</Text>;
                              default:
                                null;
                            }
                          })()}
                        </DataTable.Cell>
                      </View>
                      <View style={styles.table}>
                        <DataTable.Cell>{item.name}</DataTable.Cell>
                      </View>
                      <View style={styles.table}>
                        <DataTable.Cell>{item.model}</DataTable.Cell>
                      </View>
                      <View style={styles.table}>
                        <DataTable.Cell>{item.serialNum}</DataTable.Cell>
                      </View>
                      {item.position != null ? (
                        <>
                          <View style={styles.table}>
                            <DataTable.Cell>{item!.place}</DataTable.Cell>
                          </View>
                          <View style={styles.table}>
                            <DataTable.Cell>{item!.trace}</DataTable.Cell>
                          </View>
                        </>
                      ) : (
                        null
                      )}
                    </DataTable.Row>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                />
              </DataTable>
            </ScrollView>
          ) : (
              <View style={{alignItems: 'center'}}>
                <Text>Данные отсутствуют</Text>
              </View>
          )}
        </View>
      </ContentBlock>
    </PageContainer>
  );
};

export default InventoryStatus;

const styles = StyleSheet.create({
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  table: {
    // borderLeftWidth: 1,
    // borderStyle: 'solid',
    // maxWidth: 200,
    // height: 60,
    
    paddingHorizontal: 10,
    paddingVertical: 0,
    display: 'flex',
    alignItems: 'flex-start',
  },
});
