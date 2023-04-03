import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseQuery} from 'redux/fetchBaseQuery';
import {ICatalog} from 'types/docs/catalogs';
import {IItem} from 'types/docs/docs';
import {IInventory, IScanned} from 'types/inventory';

export type ItemExtended = IItem & {
  person_name: string;
  user_name: string;
  place_name: string;
  device_name: string;
  type_name: string;
  status_name: string;
};

export type ItemsExport = IItem & {
  persons: ICatalog[];
  statuses: ICatalog[];
  types: ICatalog[];
  devices: ICatalog[];
  places: ICatalog[];
  users: ICatalog[];
};
type ExportResponse = {
  file: string;
  tables: {
    inventory: IInventory[];
    items: ItemsExport[];
  };
};

export const inventoryApi = createApi({
  reducerPath: 'inventory/api',
  baseQuery,
  endpoints: builder => ({
    getAllTables: builder.query<ExportResponse, void>({
      query: () => `item/export`,
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

export const {useLazyGetAllTablesQuery, useUploadInventoryMutation} =
  inventoryApi;
