import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PageHeader from 'components/PageHeader/PageHeader';
import Home from 'pages/Home';
import {NavigatorScreenParams} from '@react-navigation/native';
import InventoryStack, {InventoryParamList} from './Inventory';
import DocsStack, {DocsParamList} from './Docs';
import Cartridges from 'pages/Cartridges';

export type HomeScreensParamList = {
  Cartridges: undefined;
  InventoryStack: NavigatorScreenParams<InventoryParamList>;
  DocsStack: NavigatorScreenParams<DocsParamList>;
  Home: undefined;
};

const HomeScreens = () => {
  const HomeStack = createStackNavigator<HomeScreensParamList>();

  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Главная',
          header: props => <PageHeader {...props} />,
        }}
      />
      <HomeStack.Screen
        name="InventoryStack"
        component={InventoryStack}
        options={{
          header: props => <></>,
        }}
      />
      <HomeStack.Screen
        name="DocsStack"
        component={DocsStack}
        options={{
          headerShown: false,
          // title: 'Документооборот',
          // header: props => <PageHeader {...props} />,
        }}
      />
      <HomeStack.Screen
        name="Cartridges"
        component={Cartridges}
        options={{
          title: 'Картриджи',
          header: props => <PageHeader {...props} />,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeScreens;
