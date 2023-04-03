import ContentBlock from 'components/ContentBlock/ContentBlock';
import PageContainer from 'components/PageContainer/PageContainer';
import AppText from 'components/Text/AppText';
import {COLORS} from 'constants/colors';
import {useInventory} from 'hooks/inventory';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {DataTable} from 'react-native-paper';
import {IInventory} from 'types/inventory';

const InventoryDownload = () => {
  const [inventory, setInventory] = useState<IInventory[]>([]);

  const {getTables} = useInventory();

  useEffect(() => {
    getInventory();
  }, []);

  const getInventory = async () => {
    try {
      const {inventory: downloadedInventory} = await getTables();
      setInventory(downloadedInventory);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageContainer>
      <ContentBlock helperText={`Количество элементов: ${inventory.length}`}>
        <View style={{height: '99%'}}>
          {inventory.length ? (
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>
                        Строка в ведомости
                      </AppText>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>
                        Наименование
                      </AppText>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>
                        Местоположение
                      </AppText>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>
                        Количество
                      </AppText>
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
                        <AppText style={styles.tableText}>
                          {item.vedpos}
                        </AppText>
                      </View>
                      <View style={styles.table}>
                        <AppText style={styles.tableText}>{item.name}</AppText>
                      </View>
                      <View style={styles.table}>
                        <AppText style={styles.tableText}>{item.place}</AppText>
                      </View>
                      <View style={styles.table}>
                        <AppText style={styles.tableText}>{item.kolvo}</AppText>
                      </View>
                    </View>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                />
              </DataTable>
            </ScrollView>
          ) : (
            <View style={{alignItems: 'center'}}>
              <AppText
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  color: COLORS.darkgray,
                }}>
                Данные отсутствуют, откройте инвентаризацию снова
              </AppText>
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
