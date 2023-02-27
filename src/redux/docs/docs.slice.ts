import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IItem} from 'types/docs/docs';

export type HistoryItem = Pick<
  IItem,
  'qr' | 'serial_number' | 'name' | 'model'
> & {
  data: string;
};

export type PrevValues = {
  status_id: number;
  user_id: number;
  person_id: number;
  device_id: number;
  place_id: number;
  type_id: number;
};

interface DocsState {
  history: HistoryItem[];
  prevValues: Partial<PrevValues>;
}

const initialState: DocsState = {
  history: [],
  prevValues: {},
};

export const docsSlice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    setDocsHistory: (state: DocsState, action: PayloadAction<HistoryItem>) => {
      state.history =
        action.payload.qr !== state.history?.[0]?.qr
          ? [action.payload, ...state.history].splice(0, 10)
          : state.history;
    },
    setPrevValues: (
      state: DocsState,
      action: PayloadAction<Partial<PrevValues>>,
    ) => {
      state.prevValues = {...state.prevValues, ...action.payload};
    },
  },
});

export const docsActions = docsSlice.actions;
export const docsReducer = docsSlice.reducer;
