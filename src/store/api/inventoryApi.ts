import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {SERVER_URL} from 'constants/constants';
import {IInventory} from 'types/inventory';

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({baseUrl: SERVER_URL}),
  endpoints: builder => ({
    getInventory: builder.query<IInventory[], string>({
      query: () => `inventory`,
    }),
  }),
});

export const {useGetInventory} = inventoryApi;
