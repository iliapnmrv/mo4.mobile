import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import {RootState, store} from './store';

// export const baseQuery = fetchBaseQuery({
//   baseUrl: store.getState().settings.serverUrl,
// });

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, WebApi, extraOptions) => {
  console.log(
    'store.getState().settings.serverUrl',
    store.getState().settings.serverUrl,
  );

  const baseUrl = store.getState().settings.serverUrl;
  const rawBaseQuery = fetchBaseQuery({baseUrl});
  return rawBaseQuery(args, WebApi, extraOptions);
};
