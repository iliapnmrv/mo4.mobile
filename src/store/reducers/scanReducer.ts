import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface ScanState {
  inventoryScan: string;
  cartridgeScan: string;
  docsScan: string;
}

const initialState: ScanState = {
  inventoryScan: '',
  cartridgeScan: '',
  docsScan: '',
};

export const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    setInventoryScan: (state: ScanState, action: PayloadAction<string>) => {
      state.inventoryScan = action.payload;
    },
    setCartridgeScan: (state: ScanState, action: PayloadAction<string>) => {
      state.cartridgeScan = action.payload;
    },
    setDocsScan: (state: ScanState, action: PayloadAction<string>) => {
      state.docsScan = action.payload;
    },
  },
});

export const {setInventoryScan, setCartridgeScan, setDocsScan} =
  scanSlice.actions;

export default scanSlice.reducer;
