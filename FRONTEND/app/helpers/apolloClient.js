import { ApolloClient, InMemoryCache } from "@apollo/client";

const API_ENDPOINT = "http://192.168.0.54:4002";

const client1 = new ApolloClient({
  uri: API_ENDPOINT,
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
