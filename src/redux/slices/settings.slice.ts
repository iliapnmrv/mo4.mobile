import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface SettingsState {
  serverUrl: string;
}

const initialState: SettingsState = {
  serverUrl: '192.168.26.75:8006',
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

export const settingsActions = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
