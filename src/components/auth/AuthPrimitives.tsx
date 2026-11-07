import type { ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

const GREEN = "#176B4D";
const BG = "#F6F8F4";
const DARK = "#18352B";
const MUTED = "#718078";
const BORDER = "#E1E8E1";
const ERROR = "#A52D2D";

export function AuthLayout({
  children,
  description,
  eyebrow,
  title,
}: {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>R</Text>
            </View>
            <View>
              <Text style={styles.brandName}>RePair</Text>
              <Text style={styles.brandTagline}>Repair more. Waste less.</Text>
            </View>
          </View>

          <View style={styles.intro}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.card}>{children}</View>

          <View style={styles.trustNote}>
            <Text style={styles.trustIcon}>✓</Text>
            <Text style={styles.trustText}>
              Your account keeps repair requests and updates together.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthField({
  error,
  label,
  ...inputProps
}: TextInputProps & { error?: string; label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#98A39C"
        selectionColor={GREEN}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

export function AuthButton({
  disabled,
  loading,
  onPress,
  title,
}: {
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  title: string;
}) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        inactive ? styles.buttonDisabled : null,
        pressed && !inactive ? styles.buttonPressed : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.primaryButtonText}>{title}</Text>
      )}
    </Pressable>
  );
}

export function AuthInlineError({ message }: { message: string }) {
  return (
    <View accessibilityRole="alert" style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function AuthTextButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.textButton, pressed ? styles.pressed : null]}
    >
      <Text style={styles.textButtonText}>{label}</Text>
    </Pressable>
  );
}

export function AuthFooterText({ children }: { children: ReactNode }) {
  return <Text style={styles.footerText}>{children}</Text>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 34,
  },
  brandMark: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  brandMarkText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  brandName: {
    color: DARK,
    fontSize: 18,
    fontWeight: "800",
  },
  brandTagline: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  intro: {
    marginBottom: 22,
  },
  eyebrow: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 9,
  },
  title: {
    color: DARK,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  description: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 9,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    shadowColor: "#18352B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  trustNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 8,
  },
  trustIcon: {
    width: 19,
    height: 19,
    borderRadius: 10,
    overflow: "hidden",
    textAlign: "center",
    textAlignVertical: "center",
    color: GREEN,
    backgroundColor: "#E6F0E9",
    fontSize: 12,
    fontWeight: "800",
    marginRight: 8,
  },
  trustText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    color: DARK,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: "#FBFCFA",
    color: DARK,
    fontSize: 15,
  },
  inputError: {
    borderColor: ERROR,
  },
  fieldError: {
    marginTop: 5,
    color: ERROR,
    fontSize: 12,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 13,
    backgroundColor: GREEN,
    marginTop: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  errorBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FCEDEA",
    borderWidth: 1,
    borderColor: "#E9B7AD",
    marginBottom: 14,
  },
  errorText: {
    color: "#9B3024",
    fontSize: 13,
    lineHeight: 19,
  },
  textButton: {
    alignSelf: "center",
    padding: 8,
    marginTop: 10,
  },
  textButtonText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  footerText: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 16,
  },
});




// import type { ReactNode } from "react";
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   type TextInputProps,
//   View,
// } from "react-native";

// const GREEN = "#176B4D";
// const BG = "#F6F8F4";
// const DARK = "#18352B";
// const MUTED = "#718078";
// const BORDER = "#E1E8E1";
// const ERROR = "#A52D2D";

// export function AuthLayout({
//   children,
//   description,
//   eyebrow,
//   title,
// }: {
//   children: ReactNode;
//   description: string;
//   eyebrow: string;
//   title: string;
// }) {
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" />
//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.brandRow}>
//             <View style={styles.brandMark}>
//               <Text style={styles.brandMarkText}>R</Text>
//             </View>
//             <View>
//               <Text style={styles.brandName}>RePair</Text>
//               <Text style={styles.brandTagline}>
//                 Repair more. Waste less.
//               </Text>
//             </View>
//           </View>

//           <View style={styles.intro}>
//             <Text style={styles.eyebrow}>{eyebrow}</Text>
//             <Text style={styles.title}>{title}</Text>
//             <Text style={styles.description}>{description}</Text>
//           </View>

//           <View style={styles.card}>{children}</View>

//           <View style={styles.trustNote}>
//             <Text style={styles.trustIcon}>✓</Text>
//             <Text style={styles.trustText}>
//               Your account keeps repair requests and updates together.
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// export function AuthField({
//   error,
//   label,
//   ...inputProps
// }: TextInputProps & { error?: string; label: string }) {
//   return (
//     <View style={styles.field}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         {...inputProps}
//         style={[styles.input, error ? styles.inputError : null]}
//         placeholderTextColor="#98A39C"
//         selectionColor={GREEN}
//       />
//       {error ? <Text style={styles.fieldError}>{error}</Text> : null}
//     </View>
//   );
// }

// export function AuthButton({
//   disabled,
//   loading,
//   onPress,
//   title,
// }: {
//   disabled?: boolean;
//   loading?: boolean;
//   onPress: () => void;
//   title: string;
// }) {
//   const inactive = disabled || loading;

//   return (
//     <Pressable
//       accessibilityRole="button"
//       disabled={inactive}
//       onPress={onPress}
//       style={({ pressed }) => [
//         styles.primaryButton,
//         inactive ? styles.buttonDisabled : null,
//         pressed && !inactive ? styles.buttonPressed : null,
//       ]}
//     >
//       {loading ? (
//         <ActivityIndicator color="#FFFFFF" />
//       ) : (
//         <Text style={styles.primaryButtonText}>{title}</Text>
//       )}
//     </Pressable>
//   );
// }

// // New reusable Google Sign-In button
// export function GoogleSignInButton({
//   onPress,
//   loading,
//   disabled,
// }: {
//   onPress: () => void;
//   loading?: boolean;
//   disabled?: boolean;
// }) {
//   const inactive = disabled || loading;

//   return (
//     <Pressable
//       accessibilityRole="button"
//       accessibilityLabel="Continue with Google"
//       disabled={inactive}
//       onPress={onPress}
//       style={({ pressed }) => [
//         styles.googleButton,
//         inactive ? styles.buttonDisabled : null,
//         pressed && !inactive ? styles.buttonPressed : null,
//       ]}
//     >
//       {loading ? (
//         <ActivityIndicator color={DARK} />
//       ) : (
//         <>
//           <Text style={styles.googleIcon}>G</Text>
//           <Text style={styles.googleButtonText}>
//             Continue with Google
//           </Text>
//         </>
//       )}
//     </Pressable>
//   );
// }

// export function AuthInlineError({ message }: { message: string }) {
//   return (
//     <View accessibilityRole="alert" style={styles.errorBox}>
//       <Text style={styles.errorText}>{message}</Text>
//     </View>
//   );
// }

// export function AuthTextButton({
//   label,
//   onPress,
// }: {
//   label: string;
//   onPress: () => void;
// }) {
//   return (
//     <Pressable
//       accessibilityRole="button"
//       onPress={onPress}
//       style={({ pressed }) => [
//         styles.textButton,
//         pressed ? styles.pressed : null,
//       ]}
//     >
//       <Text style={styles.textButtonText}>{label}</Text>
//     </Pressable>
//   );
// }

// export function AuthFooterText({ children }: { children: ReactNode }) {
//   return <Text style={styles.footerText}>{children}</Text>;
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: BG,
//   },
//   flex: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     width: "100%",
//     maxWidth: 520,
//     alignSelf: "center",
//     paddingHorizontal: 24,
//     paddingTop: 24,
//     paddingBottom: 32,
//   },
//   brandRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 34,
//   },
//   brandMark: {
//     width: 46,
//     height: 46,
//     borderRadius: 15,
//     backgroundColor: GREEN,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   brandMarkText: {
//     color: "#FFFFFF",
//     fontSize: 24,
//     fontWeight: "800",
//   },
//   brandName: {
//     color: DARK,
//     fontSize: 18,
//     fontWeight: "800",
//   },
//   brandTagline: {
//     color: MUTED,
//     fontSize: 12,
//     marginTop: 2,
//   },
//   intro: {
//     marginBottom: 22,
//   },
//   eyebrow: {
//     color: GREEN,
//     fontSize: 11,
//     fontWeight: "800",
//     letterSpacing: 1.2,
//     marginBottom: 9,
//   },
//   title: {
//     color: DARK,
//     fontSize: 30,
//     lineHeight: 36,
//     fontWeight: "800",
//     letterSpacing: -0.5,
//   },
//   description: {
//     color: MUTED,
//     fontSize: 15,
//     lineHeight: 22,
//     marginTop: 9,
//   },
//   card: {
//     padding: 20,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: BORDER,
//     backgroundColor: "#FFFFFF",
//     shadowColor: "#18352B",
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.05,
//     shadowRadius: 14,
//     elevation: 2,
//   },
//   trustNote: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 20,
//     paddingHorizontal: 8,
//   },
//   trustIcon: {
//     width: 19,
//     height: 19,
//     borderRadius: 10,
//     overflow: "hidden",
//     textAlign: "center",
//     textAlignVertical: "center",
//     color: GREEN,
//     backgroundColor: "#E6F0E9",
//     fontSize: 12,
//     fontWeight: "800",
//     marginRight: 8,
//   },
//   trustText: {
//     color: MUTED,
//     fontSize: 12,
//     lineHeight: 18,
//   },
//   field: {
//     marginBottom: 15,
//   },
//   label: {
//     color: DARK,
//     fontSize: 13,
//     fontWeight: "700",
//     marginBottom: 7,
//   },
//   input: {
//     minHeight: 50,
//     paddingHorizontal: 14,
//     borderWidth: 1,
//     borderColor: BORDER,
//     borderRadius: 12,
//     backgroundColor: "#FBFCFA",
//     color: DARK,
//     fontSize: 15,
//   },
//   inputError: {
//     borderColor: ERROR,
//   },
//   fieldError: {
//     marginTop: 5,
//     color: ERROR,
//     fontSize: 12,
//   },
//   primaryButton: {
//     minHeight: 52,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 16,
//     borderRadius: 13,
//     backgroundColor: GREEN,
//     marginTop: 3,
//   },
//   primaryButtonText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "800",
//   },
//   buttonDisabled: {
//     opacity: 0.65,
//   },
//   buttonPressed: {
//     opacity: 0.86,
//     transform: [{ scale: 0.99 }],
//   },
//   googleButton: {
//     minHeight: 52,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#DADCE0",
//     borderRadius: 13,
//     backgroundColor: "#FFFFFF",
//     marginTop: 12,
//     paddingHorizontal: 16,
//   },
//   googleIcon: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: "#4285F4",
//     marginRight: 12,
//   },
//   googleButtonText: {
//     color: DARK,
//     fontSize: 15,
//     fontWeight: "700",
//   },
//   errorBox: {
//     padding: 12,
//     borderRadius: 12,
//     backgroundColor: "#FCEDEA",
//     borderWidth: 1,
//     borderColor: "#E9B7AD",
//     marginBottom: 14,
//   },
//   errorText: {
//     color: "#9B3024",
//     fontSize: 13,
//     lineHeight: 19,
//   },
//   textButton: {
//     alignSelf: "center",
//     padding: 8,
//     marginTop: 10,
//   },
//   textButtonText: {
//     color: GREEN,
//     fontSize: 14,
//     fontWeight: "700",
//     textAlign: "center",
//   },
//   pressed: {
//     opacity: 0.7,
//   },
//   footerText: {
//     color: MUTED,
//     fontSize: 13,
//     lineHeight: 20,
//     textAlign: "center",
//     marginTop: 16,
//   },
// });
