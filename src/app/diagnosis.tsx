
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { diagnoseProblem } from "../utils/diagnosis";

const GREEN = "#176B4D";
const BG = "#F6F8F4";
const DARK = "#18352B";
const MUTED = "#718078";
const LIGHT = "#E6F0E9";

export default function DiagnosisScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    item?: string;
    brand?: string;
    model?: string;
    problem?: string;
  }>();

  const item = params.item || "Item not specified";
  const brand = params.brand || "";
  const model = params.model || "";
  const problem = params.problem || "";

  const result = diagnoseProblem(problem, item);

  const severityLabel = {
    low: "Low",
    medium: "Moderate",
    high: "High",
  }[result.severity];

  const severityColor = {
    low: "#E6F0E9",
    medium: "#FFF0D6",
    high: "#FCE4E4",
  }[result.severity];

  const severityTextColor = {
    low: "#176B4D",
    medium: "#8A5A00",
    high: "#A52D2D",
  }[result.severity];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/report");
          }
        }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹  Back to report</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🔍</Text>
          </View>
          <Text style={styles.eyebrow}>REPAIR ASSISTANT</Text>
          <Text style={styles.title}>Diagnosis results</Text>
          <Text style={styles.subtitle}>
            Here are some possible causes and suggested next steps.
          </Text>
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.sectionLabel}>YOUR REPORTED ITEM</Text>
          <Text style={styles.itemTitle}>{item}</Text>

          {(brand || model) ? (
            <Text style={styles.itemDetails}>
              {[brand, model].filter(Boolean).join(" · ")}
            </Text>
          ) : null}

          <View style={styles.problemBox}>
            <Text style={styles.problemLabel}>Reported problem</Text>
            <Text style={styles.problemText}>
              {problem || "No problem description provided."}
            </Text>
          </View>
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultHeading}>
            <View style={styles.resultIcon}>
              <Text style={styles.resultIconText}>✓</Text>
            </View>
            <View style={styles.resultHeadingText}>
              <Text style={styles.sectionLabel}>INITIAL ASSESSMENT</Text>
              <Text style={styles.resultTitle}>{result.title}</Text>
            </View>
          </View>

          <View
            style={[
              styles.severityBadge,
              { backgroundColor: severityColor },
            ]}
          >
            <Text
              style={[
                styles.severityText,
                { color: severityTextColor },
              ]}
            >
              Caution level: {severityLabel}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Possible causes</Text>
          {result.possibleCauses.map((cause, index) => (
            <View key={cause} style={styles.listRow}>
              <Text style={styles.bullet}>{index + 1}</Text>
              <Text style={styles.listText}>{cause}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>What you can do</Text>
          {result.recommendations.map((recommendation, index) => (
            <View key={recommendation} style={styles.listRow}>
              <Text style={styles.check}>✓</Text>
              <Text style={styles.listText}>{recommendation}</Text>
            </View>
          ))}

          {result.needsProfessional && (
            <View style={styles.professionalBox}>
              <Text style={styles.professionalTitle}>
                Professional assessment recommended
              </Text>
              <Text style={styles.professionalText}>
                A technician can inspect the item and confirm the actual
                cause before repair.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Please note</Text>
          <Text style={styles.noteText}>
            This is a rule-based suggestion, not a confirmed diagnosis.
            If the item is smoking, swollen, leaking, or dangerously hot,
            stop using it and seek appropriate professional assistance.
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>
            Edit my report
          </Text>
        </Pressable>

        <Pressable
          style={styles.providersButton}
          onPress={() =>
            router.push({
              pathname: "/providers",
              params: {
                item: item,
                brand: brand,
                model: model,
                problem: problem,
              },
            })
          }
        >
          <Text style={styles.providersButtonText}>
            Find Repair Providers →
          </Text>
        </Pressable>

        <Text style={styles.footer}>RePair · Repair more, waste less</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    providersButton: {
    backgroundColor: "#176B4D",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  providersButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
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
    paddingRight: 12,
  },
  backText: {
    color: GREEN,
    fontSize: 15,
    fontWeight: "700",
  },
  header: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  icon: {
    fontSize: 30,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: GREEN,
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "800",
    color: DARK,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
    textAlign: "center",
    maxWidth: 310,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E7ECE7",
  },
  sectionLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  itemTitle: {
    marginTop: 8,
    color: DARK,
    fontSize: 20,
    fontWeight: "800",
  },
  itemDetails: {
    marginTop: 5,
    color: MUTED,
    fontSize: 13,
  },
  problemBox: {
    backgroundColor: BG,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  problemLabel: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "700",
  },
  problemText: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 21,
    color: DARK,
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7ECE7",
  },
  resultHeading: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  resultIconText: {
    fontSize: 20,
    color: GREEN,
    fontWeight: "800",
  },
  resultHeadingText: {
    flex: 1,
  },
  resultTitle: {
    marginTop: 5,
    color: DARK,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  severityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 16,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "800",
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: LIGHT,
    color: GREEN,
    fontSize: 12,
    fontWeight: "800",
    marginRight: 10,
  },
  check: {
    width: 24,
    color: GREEN,
    fontSize: 17,
    fontWeight: "800",
    marginRight: 10,
  },
  listText: {
    flex: 1,
    color: "#46574D",
    fontSize: 14,
    lineHeight: 21,
  },
  professionalBox: {
    backgroundColor: "#FFF7E8",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },
  professionalTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#79520B",
  },
  professionalText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: "#79520B",
  },
  noteBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: LIGHT,
    borderRadius: 14,
  },
  noteTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: "800",
  },
  noteText: {
    marginTop: 6,
    color: "#46574D",
    fontSize: 12,
    lineHeight: 19,
  },
  primaryButton: {
    backgroundColor: GREEN,
    borderRadius: 14,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#C9D8CE",
    borderRadius: 14,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    marginTop: 24,
    color: MUTED,
    fontSize: 12,
  },
});
