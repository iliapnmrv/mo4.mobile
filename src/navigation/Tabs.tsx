import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from '../pages/Settings';
import Icon from 'react-native-vector-icons/Ionicons';
import PageHeader from 'components/PageHeader/PageHeader';
import HomeScreens from './Home/Home';

export type BottomTabsParamList = {
  HomeScreens: undefined;
  Settings: undefined;
};

const Tabs = () => {
  const Tab = createBottomTabNavigator<BottomTabsParamList>();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeScreens"
        component={HomeScreens}
        options={{
          title: 'Главная',
          tabBarIcon: ({color, size}) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
          header: props => <></>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Настройки',
          tabBarIcon: ({color, size}) => (
            <Icon name="settings-outline" size={size} color={color} />
          ),
          header: props => <PageHeader {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
