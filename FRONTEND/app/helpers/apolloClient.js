// helpers/apolloClient.js

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const API_ENDPOINT = "http://192.168.68.112:4002/graphql";

// Function to handle automatic logout
const handleAutoLogout = async () => {
  try {
    console.log("Token expired via GraphQL - Auto logging out...");

    // Remove tokens from SecureStore
    await SecureStore.deleteItemAsync("user_token");
    await SecureStore.deleteItemAsync("user_type");

    console.log("Tokens removed successfully");

    // Navigate back to tabs index
    router.replace("/(tabs)");
  } catch (error) {
    console.error("Error during auto logout:", error);
  }
};

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

// Enhanced error handling with token expiration detection
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(async ({ message, locations, path, extensions }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );

      // Check for token expiration or authentication errors
      if (
        extensions?.code === 'UNAUTHENTICATED' ||
        message.toLowerCase().includes('token') ||
        message.toLowerCase().includes('expired') ||
        message.toLowerCase().includes('unauthorized')
      ) {
        console.log("Authentication error detected, logging out...");
        await handleAutoLogout();
      }
    });
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    
    // Check for 401 Unauthorized responses
    if (networkError.statusCode === 401) {
      console.log("401 Unauthorized - Token expired, logging out...");
      handleAutoLogout();
    }
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