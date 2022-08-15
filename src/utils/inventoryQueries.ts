import {IScanned, IInventory} from 'types/inventory';

export const createInventoryQuery = `
CREATE TABLE IF NOT EXISTS inventory(
    id            INTEGER  NOT NULL PRIMARY KEY,
    vedpos        INTEGER  NOT NULL,
    name          VARCHAR(200) NOT NULL,
    place         VARCHAR(100) NOT NULL,
    kolvo         INTEGER  NOT NULL,
    placepriority INTEGER  NOT NULL
);`;

export const createScannedQuery = `
CREATE TABLE IF NOT EXISTS scanned(
    id            INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    inventoryNum  INTEGER  NOT NULL,
    name          VARCHAR(200) NOT NULL,
    status        INTEGER NOT NULL,
    model         VARCHAR(200),
    serialNum     VARCHAR(100),
    position      INT(63), 
    place         VARCHAR(127),
    trace         VARCHAR(100)
);`;

export const dropInventoryQuery = `DROP TABLE IF EXISTS inventory;`;
export const dropScannedQuery = `DROP TABLE IF EXISTS scanned;`;

export const insertInventoryQuery = (data: IInventory[]) => `
    INSERT INTO inventory
      ( id, vedpos, name, place, kolvo, placepriority )
    VALUES
      ${data
        ?.map(
          item =>
            `(${item.id}, ${item.vedpos}, '${item.name}', '${item.place}', '${item.kolvo}', '${item.placepriority}')`,
        )
        .join(',\n')}`;

export const updateInventoryQuery = (name: string) => `
    UPDATE inventory
        SET kolvo = kolvo - 1
        WHERE name = ${name} AND kolvo > 0 ORDER BY placepriority, kolvo`;

export const isScannedItemQuery = (inventoryNum: number) =>
  `SELECT * FROM scanned WHERE inventoryNum = ${inventoryNum}`;

export const addScannedItemQuery = (scanned: IScanned) => `
INSERT INTO scanned (inventoryNum, name, status, model, serialNum, position, place, trace)
        VALUES(${scanned.inventoryNum}, ${scanned.name}, ${scanned.status}, ${scanned.model}, ${scanned.serialNum}, ${scanned.position}, ${scanned.place}, ${scanned.trace})`;
