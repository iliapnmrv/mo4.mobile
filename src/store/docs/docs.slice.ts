import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type IHistoryItem = {
  name: string;
  inventorynumber: number;
};

interface DocsState {
  history: IHistoryItem[];
}

const initialState: DocsState = {
  history: [{name: 'Предмет 1', inventorynumber: 123}],
};

export const docsSlice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    setDocsHistory: (state: DocsState, action: PayloadAction<IHistoryItem>) => {
      state.history = [action.payload, ...state.history].splice(0, 10);
    },
  },
});

export const docsActions = docsSlice.actions;
export const docsReducer = docsSlice.reducer;
