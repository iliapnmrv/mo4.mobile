import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {docsApi} from './docs/docs.api';
import {inventoryApi} from './inventory/inventory.api';
import {docsReducer} from './docs/docs.slice';
import {inventoryReducer} from './inventory/inventory.slice';
import {scanReducer} from './slices/scan.slice';
import {settingsReducer} from './slices/settings.slice';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const reducers = combineReducers({
  [inventoryApi.reducerPath]: inventoryApi.reducer,
  [docsApi.reducerPath]: docsApi.reducer,
  scan: scanReducer,
  settings: settingsReducer,
  inventory: inventoryReducer,
  docs: docsReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: [inventoryApi.reducerPath, docsApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([docsApi.middleware, inventoryApi.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
