import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import {store} from 'redux/store';

let serverUrl: string = '';

store.subscribe(() => {
  serverUrl = store.getState().settings.serverUrl;
});

const customFetch = (url: string, options: any) => {
  return fetch(
    `${store.getState().settings.cartridgeServerUrl}graphql/api`,
    options,
  );
};

const link = new HttpLink({
  fetch: customFetch,
});

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default apolloClient;
