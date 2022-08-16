import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import {docsApi} from './api/docsApi';
import {inventoryApi} from './api/inventoryApi';
import {docsSlice} from './reducers/docsReducer';
import {inventorySlice} from './reducers/inventoryReducer';
import {scanSlice} from './reducers/scanReducer';
import {settingsSlice} from './reducers/settingsReducer';

const reducers = combineReducers({
  scan: scanSlice.reducer,
  settings: settingsSlice.reducer,
  inventory: inventorySlice.reducer,
  docs: docsSlice.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  [docsApi.reducerPath]: docsApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([docsApi.middleware, inventoryApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
