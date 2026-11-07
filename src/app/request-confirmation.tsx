
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const GREEN = "#176B4D";
const BG = "#F6F8F4";
const DARK = "#18352B";
const MUTED = "#718078";
const LIGHT = "#E6F0E9";

export default function RequestConfirmationScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    requestId?: string;
    providerName?: string;
    item?: string;
    status?: string;
    preferredDate?: string;
  }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.successIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        <Text style={styles.eyebrow}>REQUEST CREATED</Text>
        <Text style={styles.title}>You're one step closer!</Text>
        <Text style={styles.subtitle}>
          Your demo repair request has been created successfully.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>REQUEST ID</Text>
          <Text style={styles.requestId}>
            {params.requestId || "Not available"}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.cardLabel}>ITEM</Text>
          <Text style={styles.value}>{params.item || "Repair item"}</Text>

          <Text style={styles.cardLabel}>PROVIDER</Text>
          <Text style={styles.value}>
            {params.providerName || "Selected provider"}
          </Text>

          <Text style={styles.cardLabel}>PREFERRED DATE</Text>
          <Text style={styles.value}>
            {params.preferredDate || "Flexible"}
          </Text>

          <View style={styles.statusPill}>
            <Text style={styles.statusText}>
              Status: {params.status || "Pending"}
            </Text>
          </View>
        </View>

        <Text style={styles.note}>
          This is a prototype. The request is not permanently saved or sent
          to a real provider yet.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace("/providers")}
        >
          <Text style={styles.secondaryButtonText}>
            Browse Providers
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: LIGHT,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  checkmark: {
    color: GREEN,
    fontSize: 38,
    fontWeight: "800",
  },
  eyebrow: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    color: DARK,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 19,
    borderWidth: 1,
    borderColor: "#E1E8E1",
  },
  cardLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 13,
    marginBottom: 5,
  },
  requestId: {
    color: GREEN,
    fontSize: 17,
    fontWeight: "800",
  },
  value: {
    color: DARK,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8EDE8",
    marginTop: 16,
  },
  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: LIGHT,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 18,
  },
  statusText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "800",
  },
  note: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 17,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: GREEN,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 5,
  },
  secondaryButtonText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "700",
  },
});
