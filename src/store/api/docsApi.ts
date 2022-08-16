import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {SERVER_URL} from 'constants/constants';
import {IDoc} from 'types/docs';

export const docsApi = createApi({
  reducerPath: 'docsApi',
  baseQuery: fetchBaseQuery({baseUrl: SERVER_URL}),
  endpoints: builder => ({
    getDocsItem: builder.query<IDoc[], string>({
      query: id => `docs/${id}`,
    }),
    updateDoc: builder.mutation<IDoc, Partial<IDoc> & Pick<IDoc, 'id'>>({
      query: ({id, ...patch}) => ({
        url: `docs/${id}`,
        method: 'PUT',
        body: patch,
      }),
    }),
  }),
});

export const {useLazyGetDocsItemQuery} = docsApi;
