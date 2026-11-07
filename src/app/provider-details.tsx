
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const GREEN = "#176B4D";
const BG = "#F6F8F4";
const DARK = "#18352B";
const MUTED = "#718078";
const LIGHT = "#E6F0E9";
const BORDER = "#E1E8E1";

const providers = [
  {
    id: "1",
    name: "QuickFix Repairs",
    description: "Mobile and laptop repair",
    rating: "4.8",
    reviews: 124,
    price: "₹500 onwards",
    distance: "1.2 km",
    time: "Same-day service",
    specialties: "Phone and laptop repairs",
    about:
      "A sample repair provider for common device problems, diagnostics, and hardware repairs.",
  },
  {
    id: "2",
    name: "Reliable Repair Hub",
    description: "Diagnostics and hardware repairs",
    rating: "4.6",
    reviews: 98,
    price: "₹400 onwards",
    distance: "2.4 km",
    time: "Usually within 24 hours",
    specialties: "Phone, laptop, and headphone repairs",
    about:
      "A sample provider focused on troubleshooting and diagnosing common hardware problems.",
  },
  {
    id: "3",
    name: "HomeCare Technicians",
    description: "Home appliance repair specialists",
    rating: "4.7",
    reviews: 76,
    price: "₹350 onwards",
    distance: "3.1 km",
    time: "Home visits available",
    specialties: "Home appliance repairs",
    about:
      "A sample service for appliance troubleshooting and repair visits.",
  },
  {
    id: "4",
    name: "All-in-One Service Center",
    description: "General repair and troubleshooting",
    rating: "4.5",
    reviews: 61,
    price: "₹300 onwards",
    distance: "2.0 km",
    time: "Appointment recommended",
    specialties: "Multiple item categories",
    about:
      "A sample general repair provider for different types of broken items.",
  },
];

export default function ProviderDetailsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    providerId?: string;
    item?: string;
    brand?: string;
    model?: string;
    problem?: string;
  }>();

  const provider = providers.find(
    (entry) => entry.id === params.providerId
  );

  const requestRepair = () => {
    if (!provider) {
      Alert.alert("Error", "Provider details could not be found.");
      return;
    }

    router.push({
      pathname: "/repair-request",
      params: {
        providerId: provider.id,
        providerName: provider.name,
        item: params.item || "",
        brand: params.brand || "",
        model: params.model || "",
        problem: params.problem || "",
      },
    });
  };

  if (!provider) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.title}>Provider not found</Text>
          <Text style={styles.subtitle}>
            Please return to the provider list and select a provider.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back to providers</Text>
        </Pressable>

        <View style={styles.hero}>
          <View style={styles.providerIcon}>
            <Text style={styles.iconText}>🔧</Text>
          </View>

          <Text style={styles.eyebrow}>REPAIR PROVIDER</Text>
          <Text style={styles.title}>{provider.name}</Text>
          <Text style={styles.subtitle}>{provider.description}</Text>

          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>
              ★ {provider.rating} ({provider.reviews} reviews)
            </Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Demo provider</Text>
          <Text style={styles.noticeText}>
            This provider and its details are sample data for testing RePair.
            They are not verified real-world listings.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Service information</Text>

        <View style={styles.infoCard}>
          <InfoRow label="Repair categories" value={provider.specialties} />
          <InfoRow label="Estimated price" value={provider.price} />
          <InfoRow label="Sample distance" value={provider.distance} />
          <InfoRow label="Estimated service" value={provider.time} />
        </View>

        <Text style={styles.sectionTitle}>About this provider</Text>

        <View style={styles.infoCard}>
          <Text style={styles.bodyText}>{provider.about}</Text>
        </View>

        <Text style={styles.sectionTitle}>Your repair</Text>

        <View style={styles.infoCard}>
          <InfoRow
            label="Item"
            value={
              [params.brand, params.model].filter(Boolean).join(" ") ||
              params.item ||
              "Not specified"
            }
          />

          <InfoRow
            label="Category"
            value={params.item || "Other"}
          />

          <View style={styles.problemContainer}>
            <Text style={styles.infoLabel}>Reported problem</Text>
            <Text style={styles.bodyText}>
              {params.problem || "No problem description provided"}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={requestRepair}
        >
          <Text style={styles.primaryButtonText}>
            Request a Repair →
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          Confirm the final price and service availability before arranging
          a repair.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    padding: 20,
    paddingBottom: 36,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 20,
  },
  backText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "600",
  },
  hero: {
    alignItems: "center",
    backgroundColor: LIGHT,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  providerIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 34,
  },
  eyebrow: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: DARK,
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: MUTED,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },
  ratingPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
  },
  ratingText: {
    color: "#946200",
    fontSize: 13,
    fontWeight: "700",
  },
  notice: {
    backgroundColor: "#FFF6E5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  noticeTitle: {
    color: "#795500",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },
  noticeText: {
    color: "#795500",
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F3EF",
  },
  infoLabel: {
    color: MUTED,
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },
  infoValue: {
    color: DARK,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    flex: 1.2,
    lineHeight: 19,
  },
  problemContainer: {
    paddingTop: 14,
  },
  bodyText: {
    color: DARK,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: GREEN,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 13,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  footer: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
});
