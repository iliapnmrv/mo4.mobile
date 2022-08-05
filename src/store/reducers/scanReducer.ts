import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface ScanState {
  scan: string;
}

const initialState: ScanState = {
  scan: '',
};

export const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    setScan: (state: ScanState, action: PayloadAction<string>) => {
      state.scan = action.payload;
    },
  },
});

export const {setScan} = scanSlice.actions;

export default scanSlice.reducer;
