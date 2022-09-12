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
      setScanned(findScanned.raw());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageContainer>
      <ContentBlock title="Статусы">
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
      <ContentBlock title="Таблица">
        <View style={{height: '92%'}}>
          {scanned.length ? (
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header
                  style={{borderStyle: 'solid', borderWidth: 1}}>
                  <View
                    style={{
                      width: 30,
                      borderStyle: 'solid',
                    }}>
                    <DataTable.Title>№</DataTable.Title>
                  </View>
                  <FlatList
                    data={tableTitle}
                    scrollEnabled={false}
                    horizontal
                    renderItem={({item}) => (
                      <View style={styles.table}>
                        <DataTable.Title>{item}</DataTable.Title>
                      </View>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                  />
                </DataTable.Header>
                <FlatList
                  data={scanned}
                  renderItem={({item}) => (
                    <DataTable.Row
                      style={{borderStyle: 'solid', borderWidth: 1}}>
                      <View
                        style={{
                          borderStyle: 'solid',
                          width: 30,
                        }}>
                        <DataTable.Cell>{item.inventoryNum}</DataTable.Cell>
                      </View>
                      <View style={styles.table}>
                        <DataTable.Cell>{item.name}</DataTable.Cell>
                      </View>
                      <View style={styles.table}>
                        <DataTable.Cell>
                          {(() => {
                            switch (item.status) {
                              case 1:
                                return <Text>В учете</Text>;
                              case 2:
                                return <Text>Сверх учета</Text>;
                              case 3:
                                return <Text>Не в учете</Text>;
                              default:
                                null;
                            }
                          })()}
                        </DataTable.Cell>
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
                        <>
                          <View style={styles.table}>
                            <DataTable.Cell>{null}</DataTable.Cell>
                          </View>
                          <View style={styles.table}>
                            <DataTable.Cell>{null}</DataTable.Cell>
                          </View>
                        </>
                      )}
                    </DataTable.Row>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                />
              </DataTable>
            </ScrollView>
          ) : (
            <ContentBlock>
              <View style={{alignItems: 'center'}}>
                <Text>Данные отсутствуют</Text>
              </View>
            </ContentBlock>
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
    borderLeftWidth: 1,
    borderStyle: 'solid',
    width: 160,
    height: 60,
    alignItems: 'center',
  },
});
