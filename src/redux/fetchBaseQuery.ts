import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import {store} from './store';
import {SERVER_POSTFIX, SERVER_PREFIX} from 'pages/Settings';

// export const baseQuery = fetchBaseQuery({
//   baseUrl: 'http://192.168.26.75:8000/api/',
// });

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, WebApi, extraOptions) => {
  const baseUrl =
    SERVER_PREFIX + store.getState().settings.serverUrl + SERVER_POSTFIX;
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
    timeout: 15000,
  });
  return rawBaseQuery(args, WebApi, extraOptions);
};
