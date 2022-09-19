import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from 'store/fetchBaseQuery';
import {IOwner, IPerson, IStatus, IStorage, IType} from 'types/docs/catalogs';
import {IDoc} from 'types/docs/docs';

export const docsApi = createApi({
  reducerPath: 'docs/api',
  baseQuery,
  endpoints: builder => ({
    getDocsItem: builder.query<IDoc[], string>({
      query: id => `total/${id}`,
    }),
    updateDoc: builder.mutation<IDoc, Partial<IDoc> & Pick<IDoc, 'id'>>({
      query: ({id, ...patch}) => ({
        url: `total/${id}`,
        method: 'PUT',
        body: patch,
      }),
    }),
    getStorages: builder.query<IStorage[], ''>({
      query: () => `catalogs/storages`,
    }),
    getPersons: builder.query<IPerson[], ''>({
      query: () => `catalogs/persons`,
    }),
    getStatuses: builder.query<IStatus[], ''>({
      query: () => `catalogs/statuses`,
    }),
    getTypes: builder.query<IType[], ''>({
      query: () => `catalogs/types`,
    }),
    getOwners: builder.query<IOwner[], ''>({
      query: () => `catalogs/owners`,
    }),
  }),
});

export const {
  useLazyGetDocsItemQuery,
  useGetOwnersQuery,
  useGetPersonsQuery,
  useGetStatusesQuery,
  useGetStoragesQuery,
  useGetTypesQuery,
} = docsApi;
