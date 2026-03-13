import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>deviens-marrant</Text>
      <Text style={styles.subtitle}>Bientôt disponible sur mobile</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#F5C518",
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#B3B3B3",
    fontSize: 16,
    marginTop: 8,
  },
});
