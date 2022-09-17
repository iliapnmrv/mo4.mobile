import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {persistStore} from 'redux-persist';
import {ApolloProvider} from '@apollo/client';
import apolloClient from './lib/apollo';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider as PaperProvider} from 'react-native-paper';
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
