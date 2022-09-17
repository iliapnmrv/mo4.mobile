import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Inventory from 'pages/inventory/Inventory';
import PageHeader from 'components/PageHeader/PageHeader';
import InventoryStatus from 'pages/inventory/InventoryScans';

export type InventoryParamList = {
  Inventory: undefined;
  InventoryScans: undefined;
};

const InventoryStack = () => {
  const InventoryNav = createStackNavigator<InventoryParamList>();
  return (
    <InventoryNav.Navigator initialRouteName="Inventory">
      <InventoryNav.Screen
        name="Inventory"
        component={Inventory}
        options={{
          title: 'Инвентаризация',
          header: props => <PageHeader {...props} />,
        }}
      />
      <InventoryNav.Screen
        name="InventoryScans"
        options={{
          title: 'Сканирования',
          header: props => <PageHeader {...props} />,
        }}
        component={InventoryStatus}
      />
    </InventoryNav.Navigator>
  );
};

export default InventoryStack;
