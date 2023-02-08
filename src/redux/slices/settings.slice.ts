import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface SettingsState {
  serverUrl: string;
  cartridgeServerUrl: string;
}

const initialState: SettingsState = {
  serverUrl: 'http://192.168.26.75:8000/api/',
  cartridgeServerUrl: 'http://192.168.26.75:8002/',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setServerUrl: (state: SettingsState, action: PayloadAction<string>) => {
      state.serverUrl = action.payload;
    },
    setCartridgeServerUrl: (
      state: SettingsState,
      action: PayloadAction<string>,
    ) => {
      state.cartridgeServerUrl = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
