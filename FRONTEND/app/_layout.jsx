import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client";
import client1 from "./helpers/apolloClient";

export default function RootLayout() {
  return (
    <ApolloProvider client={client1}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ApolloProvider>
  );
}
