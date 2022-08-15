import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import {inventoryApi} from './api/inventoryApi';
import {inventorySlice} from './reducers/inventoryReducer';
import {scanSlice} from './reducers/scanReducer';
import {settingsSlice} from './reducers/settingsReducer';

const reducers = combineReducers({
  scan: scanSlice.reducer,
  settings: settingsSlice.reducer,
  inventory: inventorySlice.reducer,
  [inventoryApi.reducerPath]: inventoryApi.reducer,
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
    }).concat(inventoryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
