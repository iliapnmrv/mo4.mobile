import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Scanner from '../pages/Scanner';
import Tabs from './Tabs';

export type RootStackParamList = {
  HomeTabs: undefined;
  Scanner: {setScan: (data: string) => void};
};

const Navigation = () => {
  const RootStack = createStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Group>
          <RootStack.Screen
            name="HomeTabs"
            component={Tabs}
            options={{headerShown: false}}
          />
        </RootStack.Group>
        <RootStack.Group screenOptions={{presentation: 'modal'}}>
          <RootStack.Screen
            name="Scanner"
            options={{
              headerShown: false,
            }}
            component={Scanner}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
