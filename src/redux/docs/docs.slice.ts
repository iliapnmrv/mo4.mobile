import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IItem} from 'types/docs/docs';

export type HistoryItem = Pick<IItem, 'qr' | 'serial_number' | 'name'> & {
  data: string;
};

interface DocsState {
  history: HistoryItem[];
}

const initialState: DocsState = {
  history: [],
};

export const docsSlice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    setDocsHistory: (state: DocsState, action: PayloadAction<HistoryItem>) => {
      state.history = [action.payload, ...state.history].splice(0, 10);
    },
  },
});

export const docsActions = docsSlice.actions;
export const docsReducer = docsSlice.reducer;
