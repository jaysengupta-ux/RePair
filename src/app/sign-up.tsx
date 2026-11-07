import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth, useSignUp } from "@clerk/expo";
import { View } from "react-native";
import {
  AuthButton,
  AuthField,
  AuthFooterText,
  AuthInlineError,
  AuthLayout,
  AuthTextButton,
} from "../components/auth/AuthPrimitives";
import {
  getAuthErrorMessage,
  isValidEmail,
  normalizeEmail,
  validatePassword,
} from "../utils/auth";

type SignUpStep = "details" | "verification";

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded } = useAuth();
  const { signUp } = useSignUp();
  const [step, setStep] = useState<SignUpStep>("details");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  const beginSignUp = async () => {
    if (!isLoaded || working) return;

    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email address to continue.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Those passwords don’t match yet.");
      return;
    }

    setError("");
    setWorking(true);

    try {
      const { error: signUpError } = await signUp.password({
        emailAddress: normalizedEmail,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      setStep("verification");
      const { error: sendError } =
        await signUp.verifications.sendEmailCode();
      if (sendError) {
        throw sendError;
      }
    } catch (requestError) {
      setError(
        getAuthErrorMessage(
          requestError,
          "We couldn’t create your account right now. Please try again."
        )
      );
    } finally {
      setWorking(false);
    }
  };

  const verifyEmail = async () => {
    if (!isLoaded || working) return;
    if (!/^\d{6,8}$/.test(code.trim())) {
      setError("Enter the 6–8 digit code from your email.");
      return;
    }

    setError("");
    setWorking(true);

    try {
      const { error: verifyError } =
        await signUp.verifications.verifyEmailCode({
          code: code.trim(),
        });
      if (verifyError) {
        throw verifyError;
      }

      if (signUp.status !== "complete") {
        setError(
          "Your email is verified, but a few more account details are needed. Please contact support."
        );
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        throw finalizeError;
      }
    } catch (requestError) {
      setError(
        getAuthErrorMessage(
          requestError,
          "That code could not be verified. Check it and try again."
        )
      );
    } finally {
      setWorking(false);
    }
  };

  const resendCode = async () => {
    if (!isLoaded || working) return;
    setError("");
    setWorking(true);

    try {
      const { error: sendError } =
        await signUp.verifications.sendEmailCode();
      if (sendError) {
        throw sendError;
      }
    } catch (requestError) {
      setError(
        getAuthErrorMessage(
          requestError,
          "We couldn’t send a new code. Please wait a moment and try again."
        )
      );
    } finally {
      setWorking(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={
        step === "verification"
          ? "ONE QUICK CHECK"
          : "JOIN THE REPAIR MOVEMENT"
      }
      title={
        step === "verification"
          ? "Verify your email"
          : "Make repairs easier."
      }
      description={
        step === "verification"
          ? `We sent a code to ${normalizeEmail(email)}. Enter it below to finish setting up your account.`
          : "Create an account to keep your repair requests and progress in one place."
      }
    >
      {error ? <AuthInlineError message={error} /> : null}

      {step === "details" ? (
        <>
          <AuthField
            label="Email address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            accessibilityLabel="Email address"
            returnKeyType="next"
          />
          <AuthField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            accessibilityLabel="Password"
            returnKeyType="next"
          />
          <AuthField
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Enter your password again"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            accessibilityLabel="Confirm password"
            returnKeyType="done"
            onSubmitEditing={beginSignUp}
          />
          <AuthButton
            title="Create account"
            loading={working}
            disabled={!isLoaded}
            onPress={beginSignUp}
          />
          <AuthFooterText>
            We’ll send a one-time email code to confirm it’s really you.
          </AuthFooterText>
          <AuthTextButton
            label="Already have an account? Sign in"
            onPress={() => router.replace("/sign-in")}
          />
        </>
      ) : (
        <>
          <AuthField
            label="Email verification code"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 8))}
            placeholder="Enter your code"
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            accessibilityLabel="Email verification code"
            returnKeyType="done"
            onSubmitEditing={verifyEmail}
            maxLength={8}
          />
          <AuthButton
            title="Verify email"
            loading={working}
            disabled={!isLoaded}
            onPress={verifyEmail}
          />
          <AuthTextButton
            label="Send a new code"
            onPress={resendCode}
          />
          <AuthTextButton
            label="Use a different email"
            onPress={() => {
              setStep("details");
              setCode("");
              setError("");
            }}
          />
        </>
      )}
      <View nativeID="clerk-captcha" />
    </AuthLayout>
  );
}



// import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import { useAuth, useSignUp, useSSO } from "@clerk/expo";
// import { useHostedAuth } from "@clerk/expo/hosted-auth";
// import * as WebBrowser from "expo-web-browser";
// import { Platform, View } from "react-native";

// import {
//   AuthButton,
//   AuthField,
//   AuthFooterText,
//   AuthInlineError,
//   AuthLayout,
//   AuthTextButton,
//   GoogleSignInButton,
// } from "../components/auth/AuthPrimitives";

// import {
//   getAuthErrorMessage,
//   isValidEmail,
//   normalizeEmail,
//   validatePassword,
// } from "../utils/auth";

// WebBrowser.maybeCompleteAuthSession();

// type SignUpStep = "details" | "verification";

// export default function SignUpScreen() {
//   const router = useRouter();

//   const { isLoaded } = useAuth();
//   const { signUp } = useSignUp();
//   const { startSSOFlow } = useSSO();
//   const { startHostedAuth } = useHostedAuth();

//   const [step, setStep] = useState<SignUpStep>("details");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [code, setCode] = useState("");

//   const [error, setError] = useState("");
//   const [working, setWorking] = useState(false);
//   const [googleWorking, setGoogleWorking] = useState(false);

//   // Prepare the browser on Android for OAuth.
//   useEffect(() => {
//     if (Platform.OS !== "android") return;

//     void WebBrowser.warmUpAsync();

//     return () => {
//       void WebBrowser.coolDownAsync();
//     };
//   }, []);

//   // Google Sign-Up / Sign-In.
//   // Android uses Hosted Authentication.
//   // Web keeps the existing custom OAuth flow.
//   const signUpWithGoogle = async () => {
//     if (!isLoaded || working || googleWorking) return;

//     setError("");
//     setGoogleWorking(true);

//     try {
//       if (Platform.OS !== "web") {
//         const hostedResult = await startHostedAuth({
//           mode: "sign-up",
//         });

//         console.log("Google hosted authentication result:", {
//           authSessionResult: hostedResult.authSessionResult,
//           createdSessionId: hostedResult.createdSessionId,
//         });

//         if (hostedResult.createdSessionId) {
//           // Hosted Authentication activates the session automatically.
//           router.replace("/");
//           return;
//         }

//         if (
//           hostedResult.authSessionResult?.type === "dismiss" ||
//           hostedResult.authSessionResult?.type === "cancel"
//         ) {
//           return;
//         }

//         setError(
//           "Google sign-up was not completed. Please try again."
//         );
//         return;
//       }

//       const result = await startSSOFlow({
//         strategy: "oauth_google",
//         redirectUrl: `${window.location.origin}/sign-up`,
//       });

//       const {
//         createdSessionId,
//         setActive,
//         signUp: ssoSignUp,
//       } = result;

//       console.log("Google OAuth diagnostic:", {
//         authSessionResult: result.authSessionResult,
//         createdSessionId,
//         signUpStatus: ssoSignUp?.status,
//         signUpMissingFields: ssoSignUp?.missingFields,
//       });

//       if (createdSessionId && setActive) {
//         await setActive({ session: createdSessionId });
//         router.replace("/");
//         return;
//       }

//       setError(
//         "Google authentication needs additional account details or verification. Please try again."
//       );
//     } catch (requestError) {
//       console.error("Google authentication error:", requestError);

//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "We couldn't create your account with Google. Please try again."
//         )
//       );
//     } finally {
//       setGoogleWorking(false);
//     }
//   };

//   // Create an account using email and password.
//   const beginSignUp = async () => {
//     if (!isLoaded || working || googleWorking) return;

//     const normalizedEmail = normalizeEmail(email);

//     if (!isValidEmail(normalizedEmail)) {
//       setError("Enter a valid email address to continue.");
//       return;
//     }

//     const passwordError = validatePassword(password);

//     if (passwordError) {
//       setError(passwordError);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Those passwords don't match yet.");
//       return;
//     }

//     setError("");
//     setWorking(true);

//     try {
//       const { error: signUpError } = await signUp.password({
//         emailAddress: normalizedEmail,
//         password,
//       });

//       if (signUpError) {
//         throw signUpError;
//       }

//       setStep("verification");

//       const { error: sendError } =
//         await signUp.verifications.sendEmailCode();

//       if (sendError) {
//         throw sendError;
//       }
//     } catch (requestError) {
//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "We couldn't create your account right now. Please try again."
//         )
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   // Verify the email address.
//   const verifyEmail = async () => {
//     if (!isLoaded || working) return;

//     if (!/^\d{6,8}$/.test(code.trim())) {
//       setError("Enter the 6–8 digit code from your email.");
//       return;
//     }

//     setError("");
//     setWorking(true);

//     try {
//       const { error: verifyError } =
//         await signUp.verifications.verifyEmailCode({
//           code: code.trim(),
//         });

//       if (verifyError) {
//         throw verifyError;
//       }

//       if (signUp.status !== "complete") {
//         setError(
//           "Your email is verified, but a few more account details are needed. Please contact support."
//         );
//         return;
//       }

//       const { error: finalizeError } = await signUp.finalize();

//       if (finalizeError) {
//         throw finalizeError;
//       }
//     } catch (requestError) {
//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "That code could not be verified. Check it and try again."
//         )
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   // Resend the email verification code.
//   const resendCode = async () => {
//     if (!isLoaded || working) return;

//     setError("");
//     setWorking(true);

//     try {
//       const { error: sendError } =
//         await signUp.verifications.sendEmailCode();

//       if (sendError) {
//         throw sendError;
//       }
//     } catch (requestError) {
//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "We couldn't send a new code. Please wait a moment and try again."
//         )
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   return (
//     <AuthLayout
//       eyebrow={
//         step === "verification"
//           ? "ONE QUICK CHECK"
//           : "JOIN THE REPAIR MOVEMENT"
//       }
//       title={
//         step === "verification"
//           ? "Verify your email"
//           : "Make repairs easier."
//       }
//       description={
//         step === "verification"
//           ? `We sent a code to ${normalizeEmail(email)}. Enter it below to finish setting up your account.`
//           : "Create an account to keep your repair requests and progress in one place."
//       }
//     >
//       {error ? <AuthInlineError message={error} /> : null}

//       {step === "details" ? (
//         <>
//           <AuthField
//             label="Email address"
//             value={email}
//             onChangeText={setEmail}
//             placeholder="you@example.com"
//             keyboardType="email-address"
//             autoCapitalize="none"
//             autoComplete="email"
//             textContentType="emailAddress"
//             accessibilityLabel="Email address"
//             returnKeyType="next"
//           />

//           <AuthField
//             label="Password"
//             value={password}
//             onChangeText={setPassword}
//             placeholder="At least 8 characters"
//             secureTextEntry
//             autoCapitalize="none"
//             autoComplete="new-password"
//             textContentType="newPassword"
//             accessibilityLabel="Password"
//             returnKeyType="next"
//           />

//           <AuthField
//             label="Confirm password"
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             placeholder="Enter your password again"
//             secureTextEntry
//             autoCapitalize="none"
//             autoComplete="new-password"
//             textContentType="newPassword"
//             accessibilityLabel="Confirm password"
//             returnKeyType="done"
//             onSubmitEditing={beginSignUp}
//           />

//           <AuthButton
//             title="Create account"
//             loading={working}
//             disabled={!isLoaded || googleWorking}
//             onPress={beginSignUp}
//           />

//           <GoogleSignInButton
//             onPress={signUpWithGoogle}
//             loading={googleWorking}
//             disabled={!isLoaded || working}
//           />

//           <AuthFooterText>
//             We&apos;ll send a one-time email code to confirm it&apos;s really you.
//           </AuthFooterText>

//           <AuthTextButton
//             label="Already have an account? Sign in"
//             onPress={() => router.replace("/sign-in")}
//           />
//         </>
//       ) : (
//         <>
//           <AuthField
//             label="Email verification code"
//             value={code}
//             onChangeText={(value) =>
//               setCode(value.replace(/\D/g, "").slice(0, 8))
//             }
//             placeholder="Enter your code"
//             keyboardType="number-pad"
//             autoComplete="one-time-code"
//             textContentType="oneTimeCode"
//             accessibilityLabel="Email verification code"
//             returnKeyType="done"
//             onSubmitEditing={verifyEmail}
//             maxLength={8}
//           />

//           <AuthButton
//             title="Verify email"
//             loading={working}
//             disabled={!isLoaded}
//             onPress={verifyEmail}
//           />

//           <AuthTextButton
//             label="Send a new code"
//             onPress={resendCode}
//           />

//           <AuthTextButton
//             label="Use a different email"
//             onPress={() => {
//               setStep("details");
//               setCode("");
//               setError("");
//             }}
//           />
//         </>
//       )}

//       <View nativeID="clerk-captcha" />
//     </AuthLayout>
//   );
// }