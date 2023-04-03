import ContentBlock from 'components/ContentBlock/ContentBlock';
import PageContainer from 'components/PageContainer/PageContainer';
import AppText from 'components/Text/AppText';
import {COLORS} from 'constants/colors';
import {btnStatus} from 'constants/constants';
import {useInventory} from 'hooks/inventory';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import {useUploadInventoryMutation} from 'redux/inventory/inventory.api';
import {IScanned} from 'types/inventory';
import {findScannedQuery} from 'utils/inventoryQueries';

const InventoryStatus = () => {
  const [status, setStatus] = useState<number | undefined>(0);
  const [scanned, setScanned] = useState<IScanned[]>([]);

  const {db} = useInventory();

  const [uploadInventory] = useUploadInventoryMutation();

  useEffect(() => {
    getInventoryScans();
  }, [status]);

  const getInventoryScans = async () => {
    try {
      const [{rows: foundScanned}] = await db.executeSql(
        findScannedQuery(status),
      );
      setScanned(foundScanned.raw());
    } catch (e) {
      console.log(e);
    }
  };

  const uploadInventoryHandler = async () => {
    try {
      const [{rows: inventoryResult}] = await db.executeSql(
        findScannedQuery(undefined),
      );

      const result = await uploadInventory(inventoryResult.raw());

      Snackbar.show({
        //@ts-ignore
        text: result.data,
        duration: Snackbar.LENGTH_LONG,
      });
    } catch (e) {
      Snackbar.show({
        text: JSON.stringify(e),
        duration: Snackbar.LENGTH_LONG,
      });
      console.log(e);
    }
  };

  return (
    <PageContainer>
      <ContentBlock
        title="Фильтр по статусам"
        helperText={`Количество сканирований: ${scanned.length}`}
        button={{
          text: (
            <View>
              <AppText
                style={{
                  backgroundColor: COLORS.lightBlue,
                  borderRadius: 4,
                  color: 'white',
                  marginHorizontal: 5,
                  paddingHorizontal: 14,
                  paddingVertical: 4,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                Выгрузить
              </AppText>
            </View>
          ),
          action: uploadInventoryHandler,
        }}>
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
              <AppText
                style={
                  item.id === status
                    ? {color: 'white', fontWeight: 'bold', fontSize: 16}
                    : {fontWeight: 'bold', fontSize: 16, color: COLORS.black}
                }>
                {item.title}
              </AppText>
            </TouchableOpacity>
          )}
        />
      </ContentBlock>
      <ContentBlock>
        <View style={{height: '90%'}}>
          {scanned.length ? (
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>
                        Инвентарный номер
                      </AppText>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>Статус</AppText>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>Имя</AppText>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>Модель</AppText>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>
                        Серийный номер
                      </AppText>
                    </DataTable.Title>
                  </View>
                  <View style={styles.tableHeader}>
                    <DataTable.Title>
                      <AppText style={styles.tableHeaderText}>Место</AppText>
                    </DataTable.Title>
                  </View>
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
                        Дата сканирования
                      </AppText>
                    </DataTable.Title>
                  </View>
                </DataTable.Header>
                <FlatList
                  data={scanned}
                  renderItem={({item, index}) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomColor: '#DCDCDC',
                        borderBottomWidth: 1,
                      }}>
                      <View style={[styles.table, {width: 40}]}>
                        <AppText style={styles.tableText}>{index + 1}</AppText>
                      </View>
                      <View style={styles.table}>
                        <AppText style={styles.tableText}>
                          {item.inventoryNum}
                        </AppText>
                      </View>
                      <View style={styles.table}>
                        {(item.status === 1 && (
                          <AppText style={styles.tableText}>В учете</AppText>
                        )) ||
                          (item.status === 2 && (
                            <AppText style={styles.tableText}>
                              Не в учете
                            </AppText>
                          )) ||
                          (item.status === 3 && (
                            <AppText style={styles.tableText}>
                              Сверх учета
                            </AppText>
                          ))}
                      </View>
                      <View style={styles.table}>
                        <AppText style={styles.tableText}>{item.name}</AppText>
                      </View>
                      <View style={styles.table}>
                        <AppText style={styles.tableText}>{item.model}</AppText>
                      </View>
                      <View style={styles.table}>
                        <AppText style={styles.tableText}>
                          {item.serialNum}
                        </AppText>
                      </View>
                      {item.position ? (
                        <>
                          <View style={[styles.table, {width: 220}]}>
                            <AppText style={styles.tableText}>
                              {item!.place}
                            </AppText>
                          </View>
                          <View style={styles.table}>
                            <AppText style={styles.tableText}>
                              {item!.position}
                            </AppText>
                          </View>
                        </>
                      ) : null}
                      <View style={styles.table}>
                        <AppText style={styles.tableText}>
                          {moment(item?.createdAt).format('LLL')}
                        </AppText>
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
                Данные отсутствуют
              </AppText>
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
