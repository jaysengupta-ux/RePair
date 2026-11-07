
import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getRepairRequests } from "../utils/api";

const GREEN = "#176B4D";
const BG = "#F6F8F4";
const DARK = "#18352B";
const MUTED = "#718078";
const LIGHT = "#E6F0E9";
const BORDER = "#E1E8E1";

type RepairRequest = {
  id: string;
  item: string;
  category: string;
  problem: string;
  providerName: string;
  contact: string;
  preferredDate?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
};

export default function MyRepairsScreen() {
  const router = useRouter();

  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getRepairRequests();

      // The backend returns { data: [...] }.
      const savedRequests = Array.isArray(result.data)
        ? result.data
        : [];

      setRequests(savedRequests);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load your repair requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh the list whenever this screen is opened again.
  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [loadRequests])
  );

  const getStatusStyle = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized === "completed") {
      return styles.completedBadge;
    }

    if (
      normalized === "cancelled" ||
      normalized === "rejected"
    ) {
      return styles.cancelledBadge;
    }

    if (
      normalized === "in progress" ||
      normalized === "accepted"
    ) {
      return styles.progressBadge;
    }

    return styles.pendingBadge;
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "Not scheduled";

    // Preferred dates are currently stored as YYYY-MM-DD strings.
    const parts = date.split("-");
    if (
      parts.length === 3 &&
      parts.every((part) => /^\d+$/.test(part))
    ) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>My Repairs</Text>
          <Text style={styles.headerSubtitle}>
            Keep track of your repair requests
          </Text>
        </View>

        <Pressable
          onPress={loadRequests}
          style={styles.refreshButton}
          accessibilityRole="button"
          accessibilityLabel="Refresh repair requests"
        >
          <Text style={styles.refreshText}>↻</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro card */}
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Text style={styles.introEmoji}>🛠️</Text>
          </View>

          <View style={styles.introTextContainer}>
            <Text style={styles.introTitle}>
              Your repair journey
            </Text>
            <Text style={styles.introDescription}>
              Your saved repair requests will appear here.
            </Text>
          </View>
        </View>

        {/* Loading state */}
        {loading && (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color={GREEN} />
            <Text style={styles.stateTitle}>
              Loading your repairs...
            </Text>
            <Text style={styles.stateDescription}>
              Fetching requests from the database.
            </Text>
          </View>
        )}

        {/* Error state */}
        {!loading && error !== "" && (
          <View style={styles.stateCard}>
            <Text style={styles.stateEmoji}>⚠️</Text>
            <Text style={styles.stateTitle}>
              Couldn&apost load repairs
            </Text>
            <Text style={styles.stateDescription}>{error}</Text>

            <Pressable
              onPress={loadRequests}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                Try again
              </Text>
            </Pressable>
          </View>
        )}

        {/* Empty state */}
        {!loading && error === "" && requests.length === 0 && (
          <View style={styles.stateCard}>
            <Text style={styles.stateEmoji}>📋</Text>
            <Text style={styles.stateTitle}>
              No repair requests yet
            </Text>
            <Text style={styles.stateDescription}>
              When you submit a repair request, you can track it here.
            </Text>

            <Pressable
              onPress={() => router.push("/report")}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                Report an item →
              </Text>
            </Pressable>
          </View>
        )}

        {/* Saved repair requests */}
        {!loading &&
          error === "" &&
          requests.length > 0 && (
            <View style={styles.listSection}>
              <View style={styles.listHeading}>
                <Text style={styles.sectionTitle}>
                  Your requests
                </Text>

                <View style={styles.countBadge}>
                  <Text style={styles.countText}>
                    {requests.length}
                  </Text>
                </View>
              </View>

              {requests.map((request) => (
                <View key={request.id} style={styles.requestCard}>
                  <View style={styles.requestTop}>
                    <View style={styles.requestIcon}>
                      <Text style={styles.requestEmoji}>🔧</Text>
                    </View>

                    <View style={styles.requestTitleContainer}>
                      <Text style={styles.itemName}>
                        {request.item || "Repair item"}
                      </Text>

                      <Text style={styles.categoryText}>
                        {request.category || "Other"}
                      </Text>
                    </View>

                    <View style={getStatusStyle(request.status || "Pending")}>
                      <Text style={styles.statusText}>
                        {request.status || "Pending"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.separator} />

                  <Text style={styles.detailLabel}>Problem</Text>
                  <Text style={styles.problemText}>
                    {request.problem || "No description provided"}
                  </Text>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Repair provider</Text>
                    <Text style={styles.detailValue}>
                      {request.providerName || "Not specified"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      Preferred date
                    </Text>
                    <Text style={styles.detailValue}>
                      {formatDate(request.preferredDate)}
                    </Text>
                  </View>

                  {request.createdAt && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        Request created
                      </Text>
                      <Text style={styles.detailValue}>
                        {formatDate(request.createdAt)}
                      </Text>
                    </View>
                  )}

                  {request.notes ? (
                    <View style={styles.notesBox}>
                      <Text style={styles.notesLabel}>Your notes</Text>
                      <Text style={styles.notesText}>
                        {request.notes}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          )}

        <Text style={styles.footer}>
          RePair · Repair more, waste less
        </Text>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <Pressable onPress={() => router.replace("/")} style={styles.navItem}>
          <Text style={styles.navEmoji}>🏡</Text>
          <Text style={styles.navText}>Home</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/report")} style={styles.navItem}>
          <Text style={styles.navEmoji}>🛠️</Text>
          <Text style={styles.navText}>Repair</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/parts")} style={styles.navItem}>
          <Text style={styles.navEmoji}>🧩</Text>
          <Text style={styles.navText}>Parts</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/profile")} style={styles.navItem}>
          <Text style={styles.navEmoji}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: BG,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    color: GREEN,
    fontSize: 30,
    lineHeight: 34,
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    color: DARK,
    fontSize: 22,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: MUTED,
    fontSize: 12,
    marginTop: 3,
  },

  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  refreshText: {
    color: GREEN,
    fontSize: 28,
    lineHeight: 32,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },

  introCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT,
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: "#D9EBDD",
  },

  introIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  introEmoji: {
    fontSize: 27,
  },

  introTextContainer: {
    flex: 1,
    marginLeft: 13,
  },

  introTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: "800",
  },

  introDescription: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  stateCard: {
    marginTop: 22,
    padding: 25,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },

  stateEmoji: {
    fontSize: 39,
    marginBottom: 10,
  },

  stateTitle: {
    marginTop: 13,
    color: DARK,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

  stateDescription: {
    marginTop: 8,
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },

  primaryButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 13,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  listSection: {
    marginTop: 25,
  },

  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  sectionTitle: {
    color: DARK,
    fontSize: 19,
    fontWeight: "800",
  },

  countBadge: {
    marginLeft: 10,
    minWidth: 27,
    height: 27,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  countText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "800",
  },

  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 14,
  },

  requestTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  requestIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  requestEmoji: {
    fontSize: 23,
  },

  requestTitleContainer: {
    flex: 1,
    marginLeft: 11,
    marginRight: 6,
  },

  itemName: {
    color: DARK,
    fontSize: 15,
    fontWeight: "800",
  },

  categoryText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
  },

  pendingBadge: {
    backgroundColor: "#FFF2D6",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
  },

  progressBadge: {
    backgroundColor: "#DDEBFF",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
  },

  completedBadge: {
    backgroundColor: "#DDF4E5",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
  },

  cancelledBadge: {
    backgroundColor: "#FCE5E5",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
  },

  statusText: {
    color: DARK,
    fontSize: 10,
    fontWeight: "800",
  },

  separator: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 15,
  },

  detailLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
  },

  problemText: {
    color: DARK,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 14,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 12,
    gap: 12,
  },

  detailValue: {
    flex: 1,
    color: DARK,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
  },

  notesBox: {
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    backgroundColor: BG,
  },

  notesLabel: {
    color: DARK,
    fontSize: 12,
    fontWeight: "800",
  },

  notesText: {
    marginTop: 5,
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
  },

  footer: {
    marginTop: 25,
    marginBottom: 8,
    textAlign: "center",
    color: MUTED,
    fontSize: 12,
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E3E7E1",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },

  navEmoji: {
    fontSize: 21,
  },

  navText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 5,
  },
});
