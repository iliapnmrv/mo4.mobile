import {FlatList, StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {findInventoryQuery, findScannedQuery} from 'utils/inventoryQueries';
import {IInventory, IScanned} from 'types/inventory';
import PageContainer from 'components/PageContainer/PageContainer';
import {btnStatus} from 'constants/constants';
import ContentBlock from 'components/ContentBlock/ContentBlock';
import {DataTable} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';
import {COLORS} from 'constants/colors';

let db: SQLiteDatabase;

//важная часть для работы бд с промисами
enablePromise(true);

const InventoryDownload = () => {
  const [status, setStatus] = useState<number | undefined>(0);
  const [inventory, setInventory] = useState<IInventory[]>([]);
  useEffect(() => {
    const openDB = async () => {
      db = await openDatabase({name: 'inventory.db'});
      getInventory();
    };
    openDB();
  }, [status]);

  const getInventory = async () => {
    try {
      const [{rows: foundInventory}] = await db.executeSql(findInventoryQuery);

      setInventory(foundInventory.raw());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageContainer>
      {/* <ContentBlock>
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
                    : {fontWeight: 'bold', fontSize: 16, color: COLORS.black}
                }>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </ContentBlock> */}
      <ContentBlock helperText={`Количество элементов: ${inventory.length}`}>
        <View style={{height: '90%'}}>
          {inventory.length ? (
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <Text style={styles.tableHeaderText}>
                        Строка в ведомости
                      </Text>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <Text style={styles.tableHeaderText}>Наименование</Text>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <Text style={styles.tableHeaderText}>Местоположение</Text>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <Text style={styles.tableHeaderText}>Количество</Text>
                    </DataTable.Title>
                  </View>
                </DataTable.Header>
                <FlatList
                  data={inventory}
                  renderItem={({item, index}) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomColor: '#DCDCDC',
                        borderBottomWidth: 1,
                      }}>
                      <View style={styles.table}>
                        <Text style={styles.tableText}>{item.vedpos}</Text>
                      </View>
                      <View style={styles.table}>
                        <Text style={styles.tableText}>{item.name}</Text>
                      </View>
                      <View style={styles.table}>
                        <Text style={styles.tableText}>{item.place}</Text>
                      </View>
                      <View style={styles.table}>
                        <Text style={styles.tableText}>{item.kolvo}</Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                />
              </DataTable>
            </ScrollView>
          ) : (
            <View style={{alignItems: 'center'}}>
              <Text style={{textAlign: 'center', fontSize: 18}}>
                Данные отсутствуют, откройте инвентаризацию снова
              </Text>
            </View>
          )}
        </View>
      </ContentBlock>
    </PageContainer>
  );
};

export default InventoryDownload;

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
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    minHeight: 35,
  },
  tableText: {
    color: COLORS.black,
  },
  tableHeader: {
    paddingRight: 35,
    alignItems: 'center',
    width: 160,
  },
  tableHeaderText: {
    color: COLORS.darkgray,
    fontSize: 12,
    fontWeight: '600',
  },
});
