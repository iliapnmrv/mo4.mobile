import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from 'redux/fetchBaseQuery';
import {IOwner, IPerson, IStatus, IStorage, IType} from 'types/docs/catalogs';
import {IDoc} from 'types/docs/docs';

export const docsApi = createApi({
  reducerPath: 'docs/api',
  baseQuery,
  endpoints: builder => ({
    getDocsItem: builder.query<IDoc[], string>({
      query: id => `total/${id}`,
    }),
    searchDocs: builder.query<IDoc[], string>({
      query: id => `total/${id}`,
    }),
    updateDoc: builder.mutation<IDoc, Partial<IDoc> & Pick<IDoc, 'id'>>({
      query: ({id, ...patch}) => ({
        url: `total/${id}`,
        method: 'PUT',
        body: patch,
      }),
    }),
    getStorages: builder.query<IStorage[], void>({
      query: () => `catalogs/storages`,
    }),
    getPersons: builder.query<IPerson[], void>({
      query: () => `catalogs/persons`,
    }),
    getStatuses: builder.query<IStatus[], void>({
      query: () => `catalogs/statuses`,
    }),
    getTypes: builder.query<IType[], void>({
      query: () => `catalogs/types`,
    }),
    getOwners: builder.query<IOwner[], void>({
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
