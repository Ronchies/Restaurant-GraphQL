// helpers/apolloClient.js

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import * as SecureStore from "expo-secure-store";


const API_ENDPOINT = "http://192.168.68.112:4002/graphql";

// Middleware to add auth token
const authLink = new ApolloLink(async (operation, forward) => {
  const token = await SecureStore.getItemAsync("user_token");

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

// Error logging
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// HTTP connection to the API
const httpLink = new HttpLink({ uri: API_ENDPOINT });

// Combine links
const link = ApolloLink.from([authLink, errorLink, httpLink]);

// Apollo Client setup
const client1 = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
  connectToDevTools: true,
});

export default client1;
