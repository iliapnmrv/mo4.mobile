import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import {RootState, store} from './store';

// export const baseQuery = fetchBaseQuery({
//   baseUrl: 'http://192.168.26.75:8000/api/',
// });

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, WebApi, extraOptions) => {
  const baseUrl = store.getState().settings.serverUrl;
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
    timeout: 10000,
  });
  return rawBaseQuery(args, WebApi, extraOptions);
};
