import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import Scanner from './pages/Scanner';
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
import Cartridges from './pages/Cartridges';
import Inventory from 'pages/inventory/Inventory';
import Docs from 'pages/docs/Docs';
import PageHeader from 'components/PageHeader/PageHeader';
import Home from 'pages/Home';
import InventoryStatus from 'pages/inventory/InventoryScans';
import DocsEdit from 'pages/docs/DocsEdit';
import Navigation from 'navigation/Navigation';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });

  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <PaperProvider>
            <Navigation />
          </PaperProvider>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
