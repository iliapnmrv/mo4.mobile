import {FlatList, StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {findScannedQuery} from 'utils/inventoryQueries';
import {IScanned} from 'types/inventory';
import PageContainer from 'components/PageContainer/PageContainer';
import {btnStatus} from 'constants/constants';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import {DataTable} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';
import {COLORS} from 'constants/colors';

let db: SQLiteDatabase;

//важная часть для работы бд с промисами
enablePromise(true);

const InventoryStatus = () => {
  const [status, setStatus] = useState<number | undefined>(0);
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
      const [{rows: foundScanned}] = await db.executeSql(
        findScannedQuery(status),
      );
      setScanned(foundScanned.raw());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageContainer>
      <ContentBlock
        title="Фильтр по статусам"
        helperText={`Количество сканирований: ${scanned.length}`}>
        <FlatList
          horizontal
          scrollEnabled={true}
          data={btnStatus}
          contentContainerStyle={{display: 'flex', alignItems: 'baseline'}}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                item.id === status
                  ? styles.btnTextActive
                  : styles.btnTextNotActive,
              ]}
              onPress={() => setStatus(item.id)}>
              <Text
                style={
                  item.id === status
                    ? {color: 'white', fontWeight: 'bold', fontSize: 16}
                    : {fontWeight: 'bold', fontSize: 16}
                }>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </ContentBlock>
      <ContentBlock>
        <View style={{height: '100%'}}>
          {scanned.length ? (
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>Инвентарный номер</DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>Статус</DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>Имя</DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>Модель</DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>Серийный номер</DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>Место</DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>Trace</DataTable.Title>
                  </View>
                </DataTable.Header>
                <FlatList
                  data={scanned}
                  renderItem={({item}) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomColor: '#DCDCDC',
                        borderBottomWidth: 1,
                      }}>
                      <View style={styles.table}>
                        <Text>{item.inventoryNum}</Text>
                      </View>
                      <View style={styles.table}>
                        {(item.status === 1 && <Text>В учете</Text>) ||
                          (item.status === 2 && <Text>Не в учете</Text>) ||
                          (item.status === 3 && <Text>Сверх учета</Text>)}
                      </View>
                      <View style={styles.table}>
                        <Text>{item.name}</Text>
                      </View>
                      <View style={styles.table}>
                        <Text>{item.model}</Text>
                      </View>
                      <View style={styles.table}>
                        <Text>{item.serialNum}</Text>
                      </View>
                      {item.position != null ? (
                        <>
                          <View style={styles.table}>
                            <Text>{item!.place}</Text>
                          </View>
                          <View style={styles.table}>
                            <Text>{item!.trace}</Text>
                          </View>
                        </>
                      ) : null}
                    </View>
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
  btnTextActive: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 4,
  },
  btnTextNotActive: {},
  filterButton: {
    marginHorizontal: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  table: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    minHeight: 35,
  },
  tableHeader: {
    paddingRight: 35,
    alignItems: 'center',
    width: 160,
  },
});
