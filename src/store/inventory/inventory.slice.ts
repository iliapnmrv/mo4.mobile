import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Moment} from 'moment';

interface InventoryState {
  date: string | undefined;
}

const initialState: InventoryState = {
  date: undefined,
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventoryDate: (
      state: InventoryState,
      action: PayloadAction<string | undefined>,
    ) => {
      state.date = action.payload;
    },
  },
});

export const inventoryActions = inventorySlice.actions;
export const inventoryReducer = inventorySlice.reducer;
