import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from 'redux/fetchBaseQuery';
import {IAllCatalogsResponse, ICatalog, ICatalogs} from 'types/docs/catalogs';
import {IFile, IItem} from 'types/docs/docs';

export type IQuery = {
  q?: string;
  user_id?: number[];
  device_id?: number[];
  type_id?: number[];
  person_id?: number[];
  status_id?: number[];
  place_id?: number[];
  include?: boolean;
  includeLogs?: boolean;
  sortBy?: ISortByKeys;
  direction?: 'asc' | 'desc';
};

export type ISortByKeys = 'updatedAt' | 'createdAt' | 'qr' | 'name' | 'year';

export type IAnalysis = {
  listed: number;
  in_stock: number;
};

export const docsApi = createApi({
  reducerPath: 'docs/api',
  baseQuery,
  tagTypes: ['AllCatalogs', 'Item', 'Catalog', 'Suggestions'],
  endpoints: builder => ({
    getCatalogs: builder.query<IAllCatalogsResponse, void>({
      query: () => `catalog`,
      providesTags: ['AllCatalogs'],
    }),
    getCatalog: builder.query<ICatalog[], ICatalogs>({
      query: catalog => `catalog/${catalog}`,
      providesTags: ['Catalog'],
    }),
    getItem: builder.query<
      IItem & {analysis: IAnalysis} & {prev: number; next: number},
      number
    >({
      query: itemId => ({
        url: `item/${itemId}`,
        method: 'GET',
      }),
      providesTags: ['Item'],
    }),
    getItems: builder.query<IItem, IQuery>({
      query: params => ({
        url: `item`,
        method: 'GET',
        params,
      }),
      providesTags: ['Item'],
    }),
    getSearchSuggestions: builder.query<IItem[], {q: string}>({
      query: ({q}) => ({
        url: `item/suggestions`,
        method: 'GET',
        params: {field: 'qr', q},
      }),
      providesTags: ['Suggestions'],
    }),
    updateDoc: builder.mutation<IItem, Partial<IItem> & Pick<IItem, 'id'>>({
      query: ({id, ...patch}) => ({
        url: `total/${id}`,
        method: 'PUT',
        body: patch,
      }),
    }),
    uploadFiles: builder.mutation<IFile[], {qr: number; body: FormData}>({
      query: ({qr, body}) => ({
        url: `file/${qr}`,
        method: 'POST',
        headers: {
          'Content-Type': undefined,
          Accept: 'application/json',
          'Accept-Charset': 'windows-1251',
        },
        body,
      }),
      invalidatesTags: ['Item'],
    }),
  }),
});

export const {
  useGetCatalogQuery,
  useGetCatalogsQuery,
  useGetItemQuery,
  useGetItemsQuery,
  useUpdateDocMutation,
  useUploadFilesMutation,
  useLazyGetItemQuery,
  useLazyGetSearchSuggestionsQuery,
} = docsApi;
