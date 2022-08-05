import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface SettingsState {
  serverUrl: string;
}

const initialState: SettingsState = {
  serverUrl: 'http://192.168.1.205:8002',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setServerUrl: (state: SettingsState, action: PayloadAction<string>) => {
      state.serverUrl = action.payload;
    },
  },
});

export const {setServerUrl} = settingsSlice.actions;

export default settingsSlice.reducer;
