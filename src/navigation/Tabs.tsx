import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from '../pages/Settings';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreens from './Home/Home';
import PageHeader from 'components/PageHeader/PageHeader';
import {COLORS} from 'constants/colors';

export type BottomTabsParamList = {
  HomeScreens: undefined;
  Settings: undefined;
};

const Tabs = () => {
  const Tab = createBottomTabNavigator<BottomTabsParamList>();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.primary,
        // tabBarActiveTintColor: COLORS.primary,
      }}>
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
