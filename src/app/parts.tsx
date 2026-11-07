
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function PartsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🧩</Text>
        <Text style={styles.title}>Spare Parts</Text>
        <Text style={styles.description}>
          Find reusable parts and give old items a second life.
        </Text>
        <Text style={styles.badge}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F4",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  emoji: {
    fontSize: 52,
  },
  title: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: "800",
    color: "#18352B",
  },
  description: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 23,
    color: "#718078",
  },
  badge: {
    marginTop: 20,
    color: "#176B4D",
    fontWeight: "700",
  },
});
