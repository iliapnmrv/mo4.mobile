import {ItemsExport} from 'redux/inventory/inventory.api';
import {IInventory} from 'types/inventory';

export const createItemsTableQuery = `
CREATE TABLE IF NOT EXISTS items(
  id                      INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
  qr                      INTEGER  UNIQUE,
  name                    VARCHAR(500) NOT NULL,
  month                   INTEGER,
  year                    INTEGER,
  serial_number           VARCHAR(100) NOT NULL,
  model                   VARCHAR(100), 
  description             VARCHAR(2048),
  additional_information  VARCHAR(2048),
  createdAt               DATETIME,
  updatedAt               DATETIME,
  person_name             VARCHAR(100) NOT NULL,
  status_name             VARCHAR(100) NOT NULL,
  user_name               VARCHAR(100) NOT NULL,
  place_name              VARCHAR(100) NOT NULL,
  device_name             VARCHAR(100) NOT NULL,
  type_name               VARCHAR(100) NOT NULL
);`;

export const createInventoryTableQuery = `
CREATE TABLE IF NOT EXISTS inventory(
    id            INTEGER  NOT NULL PRIMARY KEY,
    vedpos        INTEGER  NOT NULL,
    name          VARCHAR(200) NOT NULL,
    place         VARCHAR(100) NOT NULL,
    kolvo         INTEGER  NOT NULL,
    place_priority INTEGER  NOT NULL,
    updatedAt    DATETIME
);`;

export const createScannedTableQuery = `
CREATE TABLE IF NOT EXISTS scanned(
  id            INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
  inventoryNum  INTEGER  NOT NULL,
  name          VARCHAR(200) NOT NULL,
  status        INTEGER NOT NULL,
  model         VARCHAR(200),
  serialNum     VARCHAR(100),
  position      INT(63), 
  place         VARCHAR(127),
  trace         VARCHAR(100),
  createdAt     DATETIME
);`;

export const dropInventoryTableQuery = `DROP TABLE IF EXISTS inventory;`;
export const dropScannedTableQuery = `DROP TABLE IF EXISTS scanned;`;
export const dropItemsTableQuery = `DROP TABLE IF EXISTS items;`;

export const insertInventoryQuery = (data: IInventory[]) =>
  `INSERT INTO inventory
      ( id, vedpos, name, place, kolvo, place_priority )
    VALUES
      ${data
        ?.map(
          item =>
            `(${item.id}, ${item.vedpos}, '${item.name}', '${item.place}', '${item.kolvo}', '${item.place_priority}')`,
        )
        .join(',\n')}`;

export const insertItemsQuery = (data: ItemsExport[]) =>
  `INSERT INTO items
      ( id, qr, name, month, year, serial_number, model, description, additional_information, createdAt, updatedAt, person_name, status_name, user_name, place_name, device_name, type_name )
    VALUES
      ${data
        ?.map(
          item =>
            `(${item.id}, ${item.qr}, '${item.name}', ${item.month}, ${
              item.year
            }, '${item.serial_number}', '${item.model?.replace(
              /'/g,
              '',
            )}', '${item.description?.replace(
              /'/g,
              '',
            )}', '${item.additional_information?.replace(/'/g, '')}', '${
              item.createdAt
            }', '${item.updatedAt}', '${item.person?.name}', '${
              item.status?.name
            }', '${item.user?.name}', '${item.place?.name}', '${
              item.device?.name
            }', '${item.type?.name}')`,
        )
        .join(',\n')}`;

export const updateInventoryQuery = `
    UPDATE inventory SET kolvo = kolvo - 1, updatedAt = CURRENT_TIMESTAMP
      WHERE name = ? 
        AND id IN 
            (SELECT * FROM 
              (SELECT id FROM inventory 
                  WHERE name = ? AND kolvo > 0
                    ORDER BY place_priority ASC, kolvo LIMIT 1) 
            AS k);
      OUTPUT INSERTED.PrimaryKeyID
      RETURNING inventory.*`;

export const isScannedItemQuery = `SELECT * FROM scanned WHERE inventoryNum = ?`;

export const findByNameQuery = 'SELECT * FROM inventory WHERE name = ?';

export const findUpdatedRow =
  'SELECT * from inventory ORDER BY updatedAt DESC LIMIT 1';

export const addScannedItemQuery = `INSERT INTO scanned (inventoryNum, name, status, model, serialNum, position, place, createdAt)
  VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

export const findLastScannedQuery = `SELECT * FROM scanned ORDER BY id DESC LIMIT 10`;

export const findScannedQuery = (status: number | undefined) =>
  `SELECT * FROM scanned ${status ? `WHERE status = ${status}` : ''}`;

export const findInventoryQuery = `SELECT * FROM inventory`;
export const findItemsQuery = `SELECT * FROM items`;

export const findItemsByQRQuery = `SELECT * FROM items WHERE qr = ?`;
