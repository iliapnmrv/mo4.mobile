import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseQuery} from 'store/fetchBaseQuery';
import {IInventory, IScanned} from 'types/inventory';

export const inventoryApi = createApi({
  reducerPath: 'inventory/api',
  baseQuery,
  endpoints: builder => ({
    getInventory: builder.query<IInventory[], void>({
      query: () => `inventory`,
    }),
    uploadInventory: builder.mutation<boolean, IScanned[]>({
      query: inventory => ({
        url: `inventory`,
        method: 'POST',
        body: {inventory},
      }),
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useLazyGetInventoryQuery,
  useUploadInventoryMutation,
} = inventoryApi;
