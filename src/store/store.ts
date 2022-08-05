import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import {scanSlice} from './reducers/scanReducer';
import {settingsSlice} from './reducers/settingsReducer';

const reducers = combineReducers({
  scan: scanSlice.reducer,
  settings: settingsSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
