import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import Scanner from './pages/Scanner';
import Home from './pages/Home';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {persistStore} from 'redux-persist';
import {ApolloProvider} from '@apollo/client';
import apolloClient from './lib/apollo';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './pages/Settings';
import Icon from 'react-native-vector-icons/Ionicons';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider as PaperProvider} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';

export type RootStackParamList = {
  Home: undefined;
  HomeTabs: undefined;
  Scanner: undefined;
  Settings: undefined;
};

const HomeTabs = () => {
  const Tab = createBottomTabNavigator<RootStackParamList>();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Картриджи',
          tabBarIcon: ({color, size}) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
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
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });

  const RootStack = createStackNavigator<RootStackParamList>();

  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <PaperProvider>
            <NavigationContainer>
              <RootStack.Navigator>
                <RootStack.Group>
                  <RootStack.Screen
                    name="HomeTabs"
                    component={HomeTabs}
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
          </PaperProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
