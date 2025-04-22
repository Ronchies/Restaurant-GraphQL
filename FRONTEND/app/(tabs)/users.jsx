import { View, Text, StyleSheet } from "react-native";
import GET_USERS from "../queries/userQueries";

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|Users]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
