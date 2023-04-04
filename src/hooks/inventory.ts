import {useEffect, useState} from 'react';
import Snackbar from 'react-native-snackbar';
import {
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';
import {
  ItemExtended,
  useLazyGetAllTablesQuery,
} from 'redux/inventory/inventory.api';
import {IInventory, IScanned} from 'types/inventory';
import {
  addScannedItemQuery,
  createInventoryTableQuery,
  createItemsTableQuery,
  createScannedTableQuery,
  dropInventoryTableQuery,
  dropItemsTableQuery,
  dropScannedTableQuery,
  findByNameQuery,
  findInventoryQuery,
  findItemsQuery,
  findLastScannedQuery,
  findUpdatedRow,
  insertInventoryQuery,
  insertItemsQuery,
  isScannedItemQuery,
  updateInventoryQuery,
} from 'utils/inventoryQueries';
import {parseQrCode} from 'utils/utils';
import {useActions} from './actions';
import {useAppSelector} from './redux';

let db: SQLiteDatabase;
enablePromise(true);

export function useInventory() {
  const {date} = useAppSelector(state => state.inventory);
  const {serverUrl} = useAppSelector(state => state.settings);

  const [lastScanned, setLastScanned] = useState<IScanned[]>([]);
  const [scan, setScan] = useState<{
    scan: Omit<IScanned, 'status'> & {kolvo?: number};
    status: number;
  }>();

  const {setInventoryDate} = useActions();

  const [getAllTables] = useLazyGetAllTablesQuery();

  const getLastScanned = async () => {
    try {
      const [{rows}] = await db.executeSql(findLastScannedQuery);
      setLastScanned(rows.raw());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const openDB = async () => {
      db = await openDatabase({name: 'inventory.db'});
      date ? getLastScanned() : null;
    };
    openDB();
  }, []);

  const getInventoryData = async () => {
    try {
      const exportData = await getAllTables().unwrap();

      if (!exportData) {
        throw new Error(
          `Ошибка при скачивании данных, убедитесь что вы подключены к серверу ${serverUrl}`,
        );
      }
      await db.executeSql(dropInventoryTableQuery);
      await db.executeSql(dropItemsTableQuery);
      await db.executeSql(dropScannedTableQuery);

      await db.executeSql(createItemsTableQuery);
      await db.executeSql(createScannedTableQuery);
      await db.executeSql(createInventoryTableQuery);

      await db.executeSql(insertInventoryQuery(exportData.tables.inventory));
      await db.executeSql(insertItemsQuery(exportData.tables.items));

      Snackbar.show({
        text: `Данные скачаны, в инвентаризации ${exportData.tables.inventory?.length} строк`,
        duration: 5000,
      });
    } catch (e: any) {
      console.error(e);

      Snackbar.show({
        text: `${JSON.stringify(e)}`,
        duration: 5000,
      });
      setInventoryDate(undefined);

      // Snackbar.show({
      //   text: `Ошибка при скачивании ${serverUrl}`,
      //   duration: 5000,
      // });
    }
  };

  const openInventory = async () => {
    const today = new Date().toDateString();
    setInventoryDate(today);
    await getInventoryData();
  };

  const getItemInfo = async (
    inventoryScan: string | [string, string, string, string],
  ) => {
    try {
      let inventoryNum, name, model, serialNum;
      if (typeof inventoryScan === 'string') {
        [inventoryNum, name, model, serialNum] = parseQrCode(inventoryScan);
      } else {
        [inventoryNum, name, model, serialNum] = inventoryScan;
      }

      //проверка на повторное считывание
      const [{rows}] = await db.executeSql(isScannedItemQuery, [+inventoryNum]);

      if (rows.length) {
        const prevScanned: IScanned = rows.raw()[0];
        console.log('prevScanned', prevScanned);

        setScan({scan: prevScanned, status: 4});
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
        setScan({
          scan: resData,
          status: 2,
        });
        await db.executeSql(addScannedItemQuery, [
          +inventoryNum,
          name,
          2,
          model,
          serialNum,
          null,
          null,
          new Date(),
        ]);
        return;
      }

      if (!nameRows.raw().filter(item => item.kolvo > 0).length) {
        setScan({
          scan: resData,
          status: 3,
        });
        await db.executeSql(addScannedItemQuery, [
          +inventoryNum,
          name,
          3,
          model,
          serialNum,
          null,
          null,
          new Date(),
        ]);
        return;
      }

      await db.executeSql(updateInventoryQuery, [name, name]);

      const [{rows: updatedRow}] = await db.executeSql(findUpdatedRow);

      const {place, kolvo, vedpos: position} = updatedRow.raw()[0];

      setScan({
        scan: {...resData, place, position, kolvo},
        status: 1,
      });

      await db.executeSql(addScannedItemQuery, [
        +inventoryNum,
        name,
        1,
        model,
        serialNum,
        position,
        place,
        new Date(),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      getLastScanned();
    }
  };

  const closeInventory = async () => {
    try {
      setInventoryDate(undefined);
      await db.executeSql(dropInventoryTableQuery);
      await db.executeSql(dropItemsTableQuery);
      await db.executeSql(dropScannedTableQuery);
      Snackbar.show({
        text: `Инвентаризация успешно закрыта`,
        duration: Snackbar.LENGTH_LONG,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getTables = async (): Promise<{
    inventory: IInventory[];
    items: ItemExtended[];
  }> => {
    const [{rows: foundInventory}] = await db.executeSql(findInventoryQuery);
    const [{rows: foundItems}] = await db.executeSql(findItemsQuery);

    return {inventory: foundInventory.raw(), items: foundItems.raw()};
  };

  return {
    getTables,
    lastScanned,
    date,
    closeInventory,
    openInventory,
    getItemInfo,
    scan,
    db,
  };
}
