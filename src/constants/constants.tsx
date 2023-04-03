import ListItem from 'components/List/List';
import List from 'components/List/List';
import React, {ReactNode} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {IInventory, IScanned} from 'types/inventory';
import {COLORS} from './colors';
import AppText from 'components/Text/AppText';
import {QRzeros} from 'utils/utils';

// export const SERVER_URL = '192.168.26.75:8000/api/';

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

export const btnStatus = [
  {
    id: 0,
    title: 'Все',
    active: false,
  },
  {
    id: 1,
    title: 'В учете',
    active: false,
  },
  {
    id: 2,
    title: 'Не в учете',
    active: false,
  },
  {
    id: 3,
    title: 'Сверх учета',
    active: false,
  },
];

export const tableTitle = [
  'Имя',
  'Статус',
  'Модель',
  'Серийный номер',
  'Место',
  'Trace',
];

export type IColor = {
  status: 1 | 2 | 3 | 4;
  title: string;
  getContent: (
    inventory: (IScanned | Omit<IScanned, 'status'>) & {
      kolvo?: number;
    },
  ) => ReactNode;
  textColor: string;
  backgroundColor: string;
  type: 'success' | 'notInside' | 'over' | 'double';
};

export const scanResultModalColors: IColor[] = [
  {
    status: 1,
    title: 'В учете',
    getContent: item => (
      <View style={{flex: 1}}>
        <ListItem isFirst name="Статус" value="В учете" />
        <ListItem name="Инвентарный номер" value={QRzeros(item.inventoryNum)} />
        <ListItem name="Место" value={item.place} />
        <ListItem name="Строка" value={item.position} />
        <ListItem isLast name="Осталось" value={item.kolvo} />
      </View>
    ),
    textColor: '#39910a',
    backgroundColor: '#39910a',
    type: 'success',
  },
  {
    status: 2,
    title: 'Не в учете',
    getContent: item => (
      <View style={{flex: 1, width: '100%'}}>
        <ListItem isFirst name="Статус" value="Не в учете" />
        <ListItem name="Инвентарный номер" value={QRzeros(item.inventoryNum)} />
        <ListItem isLast name="Наименование" value={item.name} />
      </View>
    ),
    textColor: '#1E90FF',
    backgroundColor: '#87CEFA',
    type: 'notInside',
  },
  {
    status: 3,
    title: 'Сверх учета',
    getContent: item => (
      <View style={{flex: 1, width: '100%'}}>
        <ListItem name="Статус" isFirst value="Сверх учета" />
        <ListItem name="Инвентарный номер" value={QRzeros(item.inventoryNum)} />
        <ListItem name="Наименование" isLast value={item.name} />
      </View>
    ),
    textColor: '#c9c900',
    backgroundColor: '#FFC300',
    type: 'over',
  },
  {
    status: 4,
    title: 'Повторное считывание',
    getContent: item => (
      <View style={{flex: 1, width: '100%'}}>
        <AppText style={{color: COLORS.black, fontWeight: '500', marginTop: 5}}>
          Предыдущее значение
        </AppText>
        <ListItem
          isFirst
          isLast={!item.position}
          name="Статус"
          value={
            //@ts-ignore
            scanResultModalColors.filter(res => res.status === item!.status)[0]
              .title
          }
        />
        {item.position != null ? (
          <>
            <ListItem name="Строка" value={item.position} />
            <ListItem name="Место" value={item.place} isLast />
          </>
        ) : null}
      </View>
    ),
    textColor: '#ab0000',
    backgroundColor: '#ff3333',
    type: 'double',
  },
];
