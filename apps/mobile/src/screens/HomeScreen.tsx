import { StyleSheet, Text, View, ScrollView } from "react-native";

export function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>deviens-marrant</Text>
      </View>

      {/* Blague du jour */}
      <View style={styles.card}>
        <Text style={styles.badge}>Blague du jour</Text>
        <Text style={styles.cardText}>Chargement...</Text>
      </View>

      {/* Conseil du jour */}
      <View style={styles.card}>
        <Text style={[styles.badge, styles.badgeOrange]}>Conseil du jour</Text>
        <Text style={styles.cardText}>Chargement...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    color: "#F5C518",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(245, 197, 24, 0.2)",
    color: "#F5C518",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 12,
    overflow: "hidden",
  },
  badgeOrange: {
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    color: "#FF6B35",
  },
  cardText: {
    color: "#B3B3B3",
    fontSize: 16,
    lineHeight: 24,
  },
});
