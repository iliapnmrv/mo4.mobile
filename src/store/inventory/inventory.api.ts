import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {SERVER_URL} from 'constants/constants';
import {IInventory, IScanned} from 'types/inventory';

export const inventoryApi = createApi({
  reducerPath: 'inventory/api',
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL,
  }),
  endpoints: builder => ({
    getInventory: builder.query<IInventory[], string>({
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
