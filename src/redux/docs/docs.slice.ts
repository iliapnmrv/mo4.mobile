import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface DocsState {
  history: string[];
}

const initialState: DocsState = {
  history: [],
};

export const docsSlice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    setDocsHistory: (state: DocsState, action: PayloadAction<string>) => {
      state.history = [action.payload, ...state.history].splice(0, 10);
    },
  },
});

export const docsActions = docsSlice.actions;
export const docsReducer = docsSlice.reducer;
