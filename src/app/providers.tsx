
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
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
    specialty: ["Phone", "Laptop"],
    description: "Mobile and laptop repair",
    rating: "4.8",
    reviews: 124,
    price: "₹500 onwards",
    distance: "1.2 km",
    time: "Same-day service",
  },
  {
    id: "2",
    name: "Reliable Repair Hub",
    specialty: ["Phone", "Laptop", "Headphones"],
    description: "Diagnostics and hardware repairs",
    rating: "4.6",
    reviews: 98,
    price: "₹400 onwards",
    distance: "2.4 km",
    time: "Usually within 24 hours",
  },
  {
    id: "3",
    name: "HomeCare Technicians",
    specialty: ["Home appliance"],
    description: "Home appliance repair specialists",
    rating: "4.7",
    reviews: 76,
    price: "₹350 onwards",
    distance: "3.1 km",
    time: "Home visits available",
  },
  {
    id: "4",
    name: "All-in-One Service Center",
    specialty: ["Phone", "Laptop", "Headphones", "Home appliance", "Other"],
    description: "General repair and troubleshooting",
    rating: "4.5",
    reviews: 61,
    price: "₹300 onwards",
    distance: "2.0 km",
    time: "Appointment recommended",
  },
];

export default function ProvidersScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    item?: string;
    brand?: string;
    model?: string;
    problem?: string;
  }>();

  const category = params.item || "Other";

  const matchingProviders = providers.filter((provider) =>
    provider.specialty.includes(category)
  );

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
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>REPAIR NEAR YOU</Text>
          <Text style={styles.title}>Find a repair provider</Text>
          <Text style={styles.subtitle}>
            Providers that may be able to help with your {category.toLowerCase()}.
          </Text>
        </View>

        <View style={styles.reportCard}>
          <Text style={styles.reportLabel}>YOUR REPAIR REPORT</Text>
          <Text style={styles.reportTitle}>
            {[params.brand, params.model].filter(Boolean).join(" ") || category}
          </Text>
          <Text style={styles.reportProblem}>
            {params.problem || "General repair assessment"}
          </Text>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>Suggested providers</Text>
          <Text style={styles.resultCount}>
            {matchingProviders.length} found
          </Text>
        </View>

        {matchingProviders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptyText}>
              We couldn't find a sample provider for this category.
              Try another category later.
            </Text>
          </View>
        ) : (
          matchingProviders.map((provider) => (
            <View key={provider.id} style={styles.providerCard}>
              <View style={styles.providerTop}>
                <View style={styles.providerIcon}>
                  <Text style={styles.wrenchIcon}>🔧</Text>
                </View>

                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerDescription}>
                    {provider.description}
                  </Text>
                  <Text style={styles.rating}>
                    ★ {provider.rating}{" "}
                    <Text style={styles.reviewCount}>
                      ({provider.reviews} reviews)
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estimated price</Text>
                <Text style={styles.price}>{provider.price}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue}>{provider.distance}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Service</Text>
                <Text style={styles.detailValue}>{provider.time}</Text>
              </View>

              <View style={styles.sampleNotice}>
                <Text style={styles.sampleNoticeText}>
                  Sample data · Not a real booking or verified quote
                </Text>
              </View>

              <Pressable
                style={styles.detailsButton}
                onPress={() =>
                  router.push({
                    pathname: "/provider-details",
                    params: {
                      providerId: provider.id,
                      item: category,
                      brand: params.brand || "",
                      model: params.model || "",
                      problem: params.problem || "",
                    },
                  })
                }
              >
                <Text style={styles.detailsButtonText}>
                  View details →
                </Text>
              </Pressable>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          RePair suggestions are preliminary. Confirm repair costs and
          service availability directly with a provider.
        </Text>
      </ScrollView>
    </SafeAreaView>
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
    fontSize: 15,
    fontWeight: "600",
  },
  header: {
    marginBottom: 22,
  },
  eyebrow: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: DARK,
    fontSize: 29,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  reportCard: {
    backgroundColor: LIGHT,
    padding: 16,
    borderRadius: 16,
    marginBottom: 26,
  },
  reportLabel: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  reportTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: "700",
  },
  reportProblem: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 19,
    fontWeight: "800",
  },
  resultCount: {
    color: MUTED,
    fontSize: 13,
  },
  providerCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  providerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  wrenchIcon: {
    fontSize: 23,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    color: DARK,
    fontSize: 17,
    fontWeight: "800",
  },
  providerDescription: {
    color: MUTED,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 19,
  },
  rating: {
    color: "#A66A00",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 7,
  },
  reviewCount: {
    color: MUTED,
    fontWeight: "400",
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 11,
    gap: 12,
  },
  detailLabel: {
    color: MUTED,
    fontSize: 13,
    flex: 1,
  },
  detailValue: {
    color: DARK,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  price: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
    flex: 1,
  },
  sampleNotice: {
    backgroundColor: "#F6F8F4",
    padding: 9,
    borderRadius: 8,
    marginTop: 3,
    marginBottom: 13,
  },
  sampleNoticeText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
  },
  detailsButton: {
    backgroundColor: GREEN,
    paddingVertical: 13,
    borderRadius: 11,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  emptyTitle: {
    color: DARK,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 7,
  },
  emptyText: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 10,
  },
});
