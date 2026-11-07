
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const GREEN = "#176B4D";
const BG = "#F6F8F4";
const DARK = "#18352B";
const MUTED = "#718078";
const LIGHT = "#E6F0E9";
const BORDER = "#DCE5DD";

const categories = [
  "Phone",
  "Laptop",
  "Headphones",
  "Home appliance",
  "Other",
];

const symptomOptions = [
  "Not charging",
  "Not turning on",
  "Overheating",
  "Cracked screen",
  "Slow or freezing",
  "Battery draining",
  "Water damage",
];

export default function ReportScreen() {
  const router = useRouter();

  const [category, setCategory] = useState("Phone");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [problem, setProblem] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
  };

  const choosePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Photo permission needed",
          "Allow photo library access to attach an image of your item."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Photo picker error:", error);
      Alert.alert(
        "Unable to select photo",
        "Please try opening your photo library again."
      );
    }
  };

  const submitReport = () => {
    console.log("Get Diagnosis button pressed");

    const errors: string[] = [];

    if (!category.trim()) {
      errors.push("Please select an item category.");
    }

    if (!brand.trim()) {
      errors.push("Please enter the item's brand.");
    }

    if (!problem.trim() && selectedSymptoms.length === 0) {
      errors.push(
        "Please select at least one symptom or describe the problem."
      );
    }

    // Show every validation error together.
    setValidationMessages(errors);

    if (errors.length > 0) {
      const message = errors.map((error) => `• ${error}`).join("\n");

      if (Platform.OS === "web") {
        // Browser alert works on Expo Web.
        window.alert(`Required fields missing:\n\n${message}`);
      } else {
        Alert.alert("Required fields missing", message);
      }

      return;
    }

    const combinedProblem = [
      ...selectedSymptoms,
      problem.trim(),
    ]
      .filter(Boolean)
      .join(". ");

    const report = {
      category,
      brand: brand.trim(),
      model: model.trim(),
      problem: combinedProblem,
      symptoms: selectedSymptoms,
      photo,
    };

    console.log("Repair report:", report);

    setValidationMessages([]);

    router.push({
      pathname: "/diagnosis",
      params: {
        item: category,
        brand: brand.trim(),
        model: model.trim(),
        problem: combinedProblem,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹  Back</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>🔧</Text>
          </View>

          <Text style={styles.eyebrow}>REPAIR ASSISTANT</Text>
          <Text style={styles.title}>Report a repair</Text>

          <Text style={styles.subtitle}>
            Tell us what's wrong with your item. We'll help you
            explore possible causes and next steps.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Item category *</Text>

          <View style={styles.categoryContainer}>
            {categories.map((item) => {
              const selected = category === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.categoryChip,
                    selected && styles.categoryChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.categoryTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Brand *</Text>

          <TextInput
            value={brand}
            onChangeText={setBrand}
            placeholder="e.g. Samsung, HP, Sony"
            placeholderTextColor="#9AA69E"
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>Model (optional)</Text>

          <TextInput
            value={model}
            onChangeText={setModel}
            placeholder="e.g. Galaxy S24, Pavilion"
            placeholderTextColor="#9AA69E"
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>
            What problem are you experiencing? *
          </Text>

          <Text style={styles.helperText}>
            Select all symptoms that apply, or describe the problem below.
          </Text>

          <View style={styles.symptomContainer}>
            {symptomOptions.map((symptom) => {
              const selected = selectedSymptoms.includes(symptom);

              return (
                <Pressable
                  key={symptom}
                  onPress={() => toggleSymptom(symptom)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  style={[
                    styles.symptomChip,
                    selected && styles.symptomChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.symptomText,
                      selected && styles.symptomTextSelected,
                    ]}
                  >
                    {selected ? "✓ " : "+ "}
                    {symptom}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Describe the problem</Text>

          <TextInput
            value={problem}
            onChangeText={setProblem}
            placeholder="When did it start? What happens when you use the item?"
            placeholderTextColor="#9AA69E"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />

          <Text style={styles.characterCount}>
            {problem.length}/1000 characters
          </Text>

          <Text style={styles.label}>Add a photo (optional)</Text>

          <Text style={styles.helperText}>
            A photo can help show visible damage.
          </Text>

          <Pressable
            onPress={choosePhoto}
            style={styles.photoButton}
          >
            <Text style={styles.photoIcon}>📷</Text>

            <View style={styles.photoTextContainer}>
              <Text style={styles.photoTitle}>
                {photo ? "Change selected photo" : "Choose a photo"}
              </Text>

              <Text style={styles.photoSubtitle}>
                Select an image from your gallery
              </Text>
            </View>

            <Text style={styles.photoArrow}>›</Text>
          </Pressable>

          {photo && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: photo }}
                style={styles.photoPreview}
                resizeMode="cover"
              />

              <Pressable
                onPress={() => setPhoto(null)}
                style={styles.removePhotoButton}
              >
                <Text style={styles.removePhotoText}>Remove photo</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Before you continue</Text>

          <Text style={styles.infoText}>
            RePair provides an initial rule-based assessment, not a
            confirmed diagnosis. If your item is smoking, swollen,
            leaking, or dangerously hot, stop using it and seek
            appropriate professional assistance.
          </Text>
        </View>

        {validationMessages.length > 0 && (
          <View style={styles.validationBox}>
            <Text style={styles.validationIcon}>!</Text>

            <View style={styles.validationMessagesContainer}>
              <Text style={styles.validationHeading}>
                Please check the following:
              </Text>

              {validationMessages.map((message) => (
                <Text key={message} style={styles.validationText}>
                  • {message}
                </Text>
              ))}
            </View>
          </View>
        )}

        <Pressable
          onPress={submitReport}
          style={styles.submitButton}
          accessibilityRole="button"
        >
          <Text style={styles.submitButtonText}>
            Get Diagnosis →
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          RePair · Repair more, waste less
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 16,
  },
  backText: {
    color: GREEN,
    fontSize: 15,
    fontWeight: "700",
  },
  header: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 24,
  },
  headerIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  headerEmoji: {
    fontSize: 29,
  },
  eyebrow: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "800",
    color: DARK,
  },
  subtitle: {
    marginTop: 8,
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 320,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E7ECE7",
    padding: 18,
  },
  label: {
    color: DARK,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 18,
  },
  helperText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -4,
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  categoryChipSelected: {
    backgroundColor: LIGHT,
    borderColor: GREEN,
  },
  categoryText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "600",
  },
  categoryTextSelected: {
    color: GREEN,
    fontWeight: "800",
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: DARK,
    fontSize: 14,
  },
  textArea: {
    minHeight: 115,
    paddingTop: 13,
  },
  characterCount: {
    color: MUTED,
    fontSize: 11,
    textAlign: "right",
    marginTop: 6,
  },
  symptomContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symptomChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  symptomChipSelected: {
    backgroundColor: LIGHT,
    borderColor: GREEN,
  },
  symptomText: {
    color: "#526158",
    fontSize: 12,
    fontWeight: "600",
  },
  symptomTextSelected: {
    color: GREEN,
    fontWeight: "800",
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#B8CBBE",
    backgroundColor: "#FBFCFA",
  },
  photoIcon: {
    fontSize: 25,
    marginRight: 12,
  },
  photoTextContainer: {
    flex: 1,
  },
  photoTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: "700",
  },
  photoSubtitle: {
    color: MUTED,
    fontSize: 11,
    marginTop: 4,
  },
  photoArrow: {
    color: GREEN,
    fontSize: 25,
  },
  previewContainer: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  photoPreview: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: LIGHT,
  },
  removePhotoButton: {
    paddingVertical: 10,
  },
  removePhotoText: {
    color: "#A52D2D",
    fontSize: 13,
    fontWeight: "700",
  },
  infoBox: {
    backgroundColor: LIGHT,
    borderRadius: 14,
    padding: 15,
    marginTop: 16,
  },
  infoTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: "800",
  },
  infoText: {
    color: "#46574D",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },
  validationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FCE8E6",
    borderColor: "#E7A6A1",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  validationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#B3261E",
    color: "#FFFFFF",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
    marginRight: 10,
    overflow: "hidden",
  },
  validationMessagesContainer: {
    flex: 1,
  },
  validationHeading: {
    color: "#8C211B",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
  },
  validationText: {
    color: "#8C211B",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: GREEN,
    borderRadius: 14,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  footer: {
    textAlign: "center",
    color: MUTED,
    fontSize: 12,
    marginTop: 22,
  },
});
