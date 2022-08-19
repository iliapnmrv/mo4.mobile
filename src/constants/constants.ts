import {IInventory, IScanned} from 'types/inventory';

export const SERVER_URL = 'http://192.168.26.75:8000/api/';

export const inventorySampleData: IInventory[] = [
  {
    id: 1,
    vedpos: 1,
    name: '123',
    place: 'place',
    kolvo: 1,
    placepriority: 1,
  },
  {
    id: 2,
    vedpos: 2,
    name: '312',
    place: 'place2',
    kolvo: 2,
    placepriority: 2,
  },
];

export type IColor = {
  status: 1 | 2 | 3 | 4;
  title: string;
  description: (inventory: IScanned | Omit<IScanned, 'status'>) => string;
  textColor: string;
  backgroundColor: string;
  type: 'success' | 'notInside' | 'over' | 'double';
};

export const scanResultModalColors: IColor[] = [
  {
    status: 1,
    title: 'В учете',
    description: item =>
      `Позиция с инвентарным номером ${item.inventoryNum} учете`,
    textColor: '#228B22',
    backgroundColor: '#98FB98',
    type: 'success',
  },
  {
    status: 2,
    title: 'Не в учете',
    description: item =>
      `Позиция с инвентарным номером ${item.inventoryNum} не в учете`,
    textColor: '#1E90FF',
    backgroundColor: '#87CEFA',
    type: 'notInside',
  },
  {
    status: 3,
    title: 'Сверх учета',
    description: item =>
      `Позиция с инвентарным номером ${item.inventoryNum} сверх учета`,
    textColor: '#FFFF00',
    backgroundColor: '#FFFF66',
    type: 'over',
  },
  {
    status: 4,
    title: 'Повторное считывание',
    description: item =>
      `Повторное считывание позиции ${
        item.inventoryNum
      }, предыдущее значение: статус ${
        //@ts-ignore
        scanResultModalColors.filter(res => res.status === item!.status)[0]
          .title
      } ${
        item.position != 'undefined'
          ? `строка ${item.position}, место ${item.place}`
          : ''
      } `,
    textColor: '#DC143C',
    backgroundColor: '#F08080',
    type: 'double',
  },
];
