
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createRepairRequest } from "../utils/api";

const GREEN = "#176B4D";
const BG = "#F6F8F4";
const DARK = "#18352B";
const MUTED = "#718078";
const LIGHT = "#E6F0E9";
const BORDER = "#E1E8E1";

export default function RepairRequestScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    providerId?: string;
    item?: string;
    brand?: string;
    model?: string;
    problem?: string;
    providerName?: string;
  }>();

  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemName =
    [params.brand, params.model].filter(Boolean).join(" ") ||
    params.item ||
    "Repair item";

  // Keep providerName available to the entire screen.
  const providerName =
    typeof params.providerName === "string" && params.providerName
      ? params.providerName
      : "Selected provider";

  const submitRequest = async () => {
    if (isSubmitting) return;

    const newErrors: string[] = [];

    if (!contact.trim()) {
      newErrors.push("Please enter your contact number or email.");
    }

    if (contact.trim() && contact.trim().length < 5) {
      newErrors.push("Please enter a valid contact detail.");
    }

    if (
      preferredDate.trim() &&
      !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate.trim())
    ) {
      newErrors.push("Enter the date in YYYY-MM-DD format.");
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      const message = newErrors.map((error) => `• ${error}`).join("\n");

      if (Platform.OS === "web") {
        window.alert(`Please check your details:\n\n${message}`);
      } else {
        Alert.alert("Please check your details", message);
      }

      return;
    }

    setIsSubmitting(true);

    try {
      // Send the request to the backend and save it in PostgreSQL.
      const result = await createRepairRequest({
        item: itemName,
        category: params.item || "Other",
        problem: params.problem || "Not specified",
        providerName,
        contact: contact.trim(),
        preferredDate: preferredDate.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      const savedRequest = result.data;

      setErrors([]);

      // Navigate only after the backend confirms the save.
      router.replace({
        pathname: "/request-confirmation",
        params: {
          requestId: savedRequest.id,
          providerName: savedRequest.providerName,
          item: savedRequest.item,
          status: savedRequest.status,
          preferredDate: preferredDate.trim() || "Flexible",
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      if (Platform.OS === "web") {
        window.alert(`Could not submit repair request:\n\n${message}`);
      } else {
        Alert.alert("Request failed", message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.eyebrow}>REPAIR REQUEST</Text>
        <Text style={styles.title}>Let's get it repaired</Text>
        <Text style={styles.subtitle}>
          Share your preferences so the repair process can get started.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>SELECTED ITEM</Text>
          <Text style={styles.summaryTitle}>{itemName}</Text>
          <Text style={styles.summaryText}>
            {params.problem || "General repair"}
          </Text>

          <View style={styles.summaryDivider} />

          <Text style={styles.summaryLabel}>PROVIDER</Text>
          <Text style={styles.summaryTitle}>{providerName}</Text>
        </View>

        <Text style={styles.label}>Contact number or email *</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="How can the provider contact you?"
          placeholderTextColor="#98A39C"
          keyboardType="default"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Preferred repair date (optional)</Text>
        <TextInput
          style={styles.input}
          value={preferredDate}
          onChangeText={setPreferredDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#98A39C"
          autoCapitalize="none"
        />

        <Text style={styles.helperText}>
          Leave this blank if your date is flexible.
        </Text>

        <Text style={styles.label}>Additional notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe any other details the provider should know..."
          placeholderTextColor="#98A39C"
          multiline
          textAlignVertical="top"
        />

        {errors.length > 0 && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>
              Please check the following:
            </Text>

            {errors.map((error) => (
              <Text key={error} style={styles.errorText}>
                • {error}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Before you submit</Text>
          <Text style={styles.noticeText}>
            Your repair request will be saved in the RePair database.
            This development version does not yet send the request
            directly to a real repair provider.
          </Text>
        </View>

        <Pressable
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={submitRequest}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {" "}Saving request...
              </Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>
              Submit Repair Request →
            </Text>
          )}
        </Pressable>

        <Text style={styles.footer}>
          By submitting, you confirm that the details you entered are correct.
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
    paddingBottom: 40,
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
  },
  subtitle: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: LIGHT,
    padding: 16,
    borderRadius: 16,
    marginBottom: 25,
  },
  summaryLabel: {
    color: GREEN,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 6,
  },
  summaryTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: "700",
  },
  summaryText: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#D2E2D6",
    marginVertical: 14,
  },
  label: {
    color: DARK,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: DARK,
    fontSize: 14,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 14,
  },
  helperText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 7,
  },
  errorBox: {
    backgroundColor: "#FCEDEA",
    borderWidth: 1,
    borderColor: "#E9B7AD",
    padding: 13,
    borderRadius: 12,
    marginTop: 18,
  },
  errorTitle: {
    color: "#9B3024",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 5,
  },
  errorText: {
    color: "#9B3024",
    fontSize: 13,
    lineHeight: 20,
  },
  notice: {
    backgroundColor: "#FFF6E5",
    borderRadius: 12,
    padding: 14,
    marginTop: 22,
    marginBottom: 20,
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
    lineHeight: 19,
  },
  submitButton: {
    backgroundColor: GREEN,
    paddingVertical: 16,
    borderRadius: 13,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  footer: {
    color: MUTED,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 15,
  },
});
