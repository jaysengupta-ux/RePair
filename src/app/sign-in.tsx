import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth, useSignIn } from "@clerk/expo";
import {
  AuthButton,
  AuthField,
  AuthFooterText,
  AuthInlineError,
  AuthLayout,
  AuthTextButton,
} from "../components/auth/AuthPrimitives";
import { View } from "react-native";
import {
  getAuthErrorMessage,
  isValidEmail,
  normalizeEmail,
  validatePassword,
} from "../utils/auth";

type SignInStep =
  | "credentials"
  | "reset-code"
  | "new-password"
  | "second-factor";
type SecondFactorStrategy = "email_code" | "totp" | "backup_code";

export default function SignInScreen() {
  const router = useRouter();
  const { isLoaded } = useAuth();
  const { signIn } = useSignIn();
  const [step, setStep] = useState<SignInStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mfaStrategies, setMfaStrategies] = useState<
    SecondFactorStrategy[]
  >([]);
  const [mfaStrategy, setMfaStrategy] =
    useState<SecondFactorStrategy | null>(null);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  const finishSession = async () => {
    const { error: finalizeError } = await signIn.finalize();
    if (finalizeError) {
      throw finalizeError;
    }
  };

  const signInWithPassword = async () => {
    if (!isLoaded || working) return;
    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email address to continue.");
      return;
    }
    if (!password) {
      setError("Enter your password to sign in.");
      return;
    }

    setError("");
    setWorking(true);

    try {
      const { error: passwordError } = await signIn.password({
        emailAddress: normalizedEmail,
        password,
      });
      if (passwordError) {
        throw passwordError;
      }

      if (signIn.status === "complete") {
        await finishSession();
        return;
      }

      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_client_trust"
      ) {
        const strategies = signIn.supportedSecondFactors
          .map((factor) => factor.strategy)
          .filter(
            (strategy): strategy is SecondFactorStrategy =>
              strategy === "email_code" ||
              strategy === "totp" ||
              strategy === "backup_code"
          );
        const available = [...new Set(strategies)];

        if (available.length === 0) {
          setError(
            "This account needs another verification method. Try again or contact support."
          );
          return;
        }

        setMfaStrategies(available);
        const preferred = available.includes("email_code")
          ? "email_code"
          : available[0];
        setMfaStrategy(preferred);
        setCode("");
        setStep("second-factor");

        if (preferred === "email_code") {
          const { error: sendError } = await signIn.mfa.sendEmailCode();
          if (sendError) throw sendError;
        }
        return;
      }

      setError("We need one more step to finish signing you in. Please try again.");
    } catch (requestError) {
      setError(
        getAuthErrorMessage(
          requestError,
          "We couldn’t sign you in. Check your details and try again."
        )
      );
    } finally {
      setWorking(false);
    }
  };

  const beginPasswordReset = async () => {
    if (!isLoaded || working) return;
    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      setError("Enter your account email first, then request a reset code.");
      return;
    }

    setError("");
    setWorking(true);

    try {
      const { error: createError } = await signIn.create({
        identifier: normalizedEmail,
      });
      if (createError) throw createError;
      const { error: sendError } =
        await signIn.resetPasswordEmailCode.sendCode();
      if (sendError) throw sendError;
      setCode("");
      setStep("reset-code");
    } catch {
      setError("We couldn’t send a reset code to this address. Check the email and try again.");
    } finally {
      setWorking(false);
    }
  };

  const resendResetCode = async () => {
    if (!isLoaded || working) return;
    setError("");
    setWorking(true);
    try {
      const { error: sendError } =
        await signIn.resetPasswordEmailCode.sendCode();
      if (sendError) throw sendError;
    } catch {
      setError("We couldn’t send a new code. Please wait and try again.");
    } finally {
      setWorking(false);
    }
  };

  const verifyResetCode = async () => {
    if (!isLoaded || working) return;
    if (!/^\d{6,8}$/.test(code.trim())) {
      setError("Enter the 6–8 digit code from your email.");
      return;
    }
    setError("");
    setWorking(true);

    try {
      const { error: verifyError } =
        await signIn.resetPasswordEmailCode.verifyCode({
          code: code.trim(),
        });
      if (verifyError) {
        throw verifyError;
      }
      if (signIn.status !== "needs_new_password") {
        setError("That code could not be verified. Check it and try again.");
        return;
      }
      setStep("new-password");
      setCode("");
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

  const saveNewPassword = async () => {
    if (!isLoaded || working) return;
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Those passwords don’t match yet.");
      return;
    }

    setError("");
    setWorking(true);

    try {
      const { error: passwordError } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password: newPassword,
        });
      if (passwordError) {
        throw passwordError;
      }
      if (signIn.status !== "complete") {
        setError("Your password wasn’t updated. Please request a new code.");
        return;
      }
      await finishSession();
    } catch (requestError) {
      setError(
        getAuthErrorMessage(
          requestError,
          "We couldn’t update your password. Please try again."
        )
      );
    } finally {
      setWorking(false);
    }
  };

  const chooseSecondFactor = async (strategy: SecondFactorStrategy) => {
    if (!isLoaded || working) return;
    setError("");
    setWorking(true);

    try {
      if (strategy === "email_code") {
        const { error: sendError } = await signIn.mfa.sendEmailCode();
        if (sendError) throw sendError;
      }
      setMfaStrategy(strategy);
      setCode("");
    } catch (requestError) {
      setError(
        getAuthErrorMessage(
          requestError,
          "We couldn’t send a verification code. Please try again."
        )
      );
    } finally {
      setWorking(false);
    }
  };

  const verifySecondFactor = async () => {
    if (!isLoaded || !mfaStrategy || working) return;
    if (!code.trim()) {
      setError("Enter your verification code to continue.");
      return;
    }
    setError("");
    setWorking(true);

    try {
      const verification =
        mfaStrategy === "email_code"
          ? await signIn.mfa.verifyEmailCode({ code: code.trim() })
          : mfaStrategy === "totp"
            ? await signIn.mfa.verifyTOTP({ code: code.trim() })
            : await signIn.mfa.verifyBackupCode({ code: code.trim() });
      if (verification.error) {
        throw verification.error;
      }
      if (signIn.status === "complete") {
        await finishSession();
      } else {
        setError("That code couldn’t be verified. Check it and try again.");
      }
    } catch (requestError) {
      setError(
        getAuthErrorMessage(
          requestError,
          "That code couldn’t be verified. Check it and try again."
        )
      );
    } finally {
      setWorking(false);
    }
  };

  const resendMfaCode = async () => {
    if (!isLoaded || working) return;
    setError("");
    setWorking(true);

    try {
      const { error: sendError } = await signIn.mfa.sendEmailCode();
      if (sendError) throw sendError;
    } catch (requestError) {
      setError(
        getAuthErrorMessage(
          requestError,
          "We couldn’t send a new verification code. Please try again."
        )
      );
    } finally {
      setWorking(false);
    }
  };

  const isRecovery = step === "reset-code" || step === "new-password";
  const title =
    step === "credentials"
      ? "Welcome back."
      : step === "reset-code"
        ? "Check your inbox."
        : step === "new-password"
          ? "Choose a new password."
          : "One more step.";
  const description =
    step === "credentials"
      ? "Sign in to pick up where you left off and keep your repairs moving."
      : step === "reset-code"
        ? `We sent a reset code to ${normalizeEmail(email)}.`
        : step === "new-password"
          ? "Create a new password to secure your account."
          : "Your account needs an additional verification code.";

  return (
    <AuthLayout
      eyebrow={isRecovery ? "ACCOUNT RECOVERY" : "YOUR REPAIR JOURNEY"}
      title={title}
      description={description}
    >
      {error ? <AuthInlineError message={error} /> : null}

      {step === "credentials" ? (
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
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            accessibilityLabel="Password"
            returnKeyType="done"
            onSubmitEditing={signInWithPassword}
          />
          <AuthButton
            title="Sign in"
            loading={working}
            disabled={!isLoaded}
            onPress={signInWithPassword}
          />
          <AuthTextButton
            label="Forgot password?"
            onPress={beginPasswordReset}
          />
          <AuthTextButton
            label="New to RePair? Create an account"
            onPress={() => router.push("/sign-up")}
          />
        </>
      ) : step === "reset-code" ? (
        <>
          <AuthField
            label="Password reset code"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 8))}
            placeholder="Enter your code"
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            accessibilityLabel="Password reset code"
            returnKeyType="done"
            onSubmitEditing={verifyResetCode}
            maxLength={8}
          />
          <AuthButton
            title="Verify code"
            loading={working}
            disabled={!isLoaded}
            onPress={verifyResetCode}
          />
          <AuthTextButton label="Send a new code" onPress={resendResetCode} />
          <AuthTextButton
            label="Back to sign in"
            onPress={() => {
              setStep("credentials");
              setCode("");
              setError("");
            }}
          />
        </>
      ) : step === "new-password" ? (
        <>
          <AuthField
            label="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="At least 8 characters"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            accessibilityLabel="New password"
            returnKeyType="next"
          />
          <AuthField
            label="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Enter it again"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            accessibilityLabel="Confirm new password"
            returnKeyType="done"
            onSubmitEditing={saveNewPassword}
          />
          <AuthButton
            title="Save new password"
            loading={working}
            disabled={!isLoaded}
            onPress={saveNewPassword}
          />
        </>
      ) : (
        <>
          {mfaStrategies.length > 1 ? (
            <View style={{ marginBottom: 14 }}>
              <AuthFooterText>Choose a verification method</AuthFooterText>
              {mfaStrategies.map((strategy) => (
                <AuthTextButton
                  key={strategy}
                  label={
                    strategy === "email_code"
                      ? "Email code"
                      : strategy === "totp"
                        ? "Authenticator app"
                        : "Backup code"
                  }
                  onPress={() => chooseSecondFactor(strategy)}
                />
              ))}
            </View>
          ) : null}
          <AuthField
            label={
              mfaStrategy === "backup_code"
                ? "Backup code"
                : mfaStrategy === "totp"
                  ? "Authenticator code"
                  : "Email verification code"
            }
            value={code}
            onChangeText={setCode}
            placeholder="Enter your code"
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            accessibilityLabel="Verification code"
            returnKeyType="done"
            onSubmitEditing={verifySecondFactor}
          />
          <AuthButton
            title="Verify and sign in"
            loading={working}
            disabled={!isLoaded || !mfaStrategy}
            onPress={verifySecondFactor}
          />
          {mfaStrategy === "email_code" ? (
            <AuthTextButton
              label="Resend email code"
              onPress={resendMfaCode}
            />
          ) : null}
        </>
      )}

      {step === "credentials" ? (
        <AuthFooterText>
          Your account keeps your repair requests and updates together.
        </AuthFooterText>
      ) : null}
    </AuthLayout>
  );
}




// import { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import { useAuth, useSignIn, useSSO } from "@clerk/expo";
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

// type SignInStep =
//   | "credentials"
//   | "reset-code"
//   | "new-password"
//   | "second-factor";

// type SecondFactorStrategy = "email_code" | "totp" | "backup_code";

// export default function SignInScreen() {
//   const router = useRouter();

//   const { isLoaded } = useAuth();
//   const { signIn } = useSignIn();
//   const { startSSOFlow } = useSSO();
//   const { startHostedAuth } = useHostedAuth();

//   const [step, setStep] = useState<SignInStep>("credentials");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [code, setCode] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [mfaStrategies, setMfaStrategies] = useState<
//     SecondFactorStrategy[]
//   >([]);

//   const [mfaStrategy, setMfaStrategy] =
//     useState<SecondFactorStrategy | null>(null);

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

//   // Google Sign-In.
//   // Android uses Hosted Authentication.
//   // Web keeps the existing custom OAuth flow.
//   const signInWithGoogle = async () => {
//     if (!isLoaded || working || googleWorking) return;

//     setError("");
//     setGoogleWorking(true);

//     try {
//       if (Platform.OS !== "web") {
//         const hostedResult = await startHostedAuth({
//           mode: "sign-in",
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
//           "Google sign-in was not completed. Please try again."
//         );
//         return;
//       }

//       const result = await startSSOFlow({
//         strategy: "oauth_google",
//         redirectUrl: `${window.location.origin}/sign-in`,
//       });

//       const {
//         createdSessionId,
//         setActive,
//         signIn: ssoSignIn,
//         signUp: ssoSignUp,
//       } = result;

//       console.log("Google OAuth diagnostic:", {
//         authSessionResult: result.authSessionResult,
//         createdSessionId,
//         signInStatus: ssoSignIn?.status,
//         signUpStatus: ssoSignUp?.status,
//         signUpMissingFields: ssoSignUp?.missingFields,
//       });

//       if (createdSessionId && setActive) {
//         await setActive({ session: createdSessionId });
//         router.replace("/");
//         return;
//       }

//       setError(
//         "Google authentication needs an additional verification step or account details. Please try again."
//       );
//     } catch (requestError) {
//       console.error("Google authentication error:", requestError);

//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "We couldn't sign you in with Google. Please try again."
//         )
//       );
//     } finally {
//       setGoogleWorking(false);
//     }
//   };

//   // Finish email/password sign-in.
//   const finishSession = async () => {
//     const { error: finalizeError } = await signIn.finalize();

//     if (finalizeError) {
//       throw finalizeError;
//     }
//   };

//   // Email and password sign-in.
//   const signInWithPassword = async () => {
//     if (!isLoaded || working || googleWorking) return;

//     const normalizedEmail = normalizeEmail(email);

//     if (!isValidEmail(normalizedEmail)) {
//       setError("Enter a valid email address to continue.");
//       return;
//     }

//     if (!password) {
//       setError("Enter your password to sign in.");
//       return;
//     }

//     setError("");
//     setWorking(true);

//     try {
//       const { error: passwordError } = await signIn.password({
//         emailAddress: normalizedEmail,
//         password,
//       });

//       if (passwordError) {
//         throw passwordError;
//       }

//       if (signIn.status === "complete") {
//         await finishSession();
//         return;
//       }

//       if (
//         signIn.status === "needs_second_factor" ||
//         signIn.status === "needs_client_trust"
//       ) {
//         const strategies = signIn.supportedSecondFactors
//           .map((factor) => factor.strategy)
//           .filter(
//             (strategy): strategy is SecondFactorStrategy =>
//               strategy === "email_code" ||
//               strategy === "totp" ||
//               strategy === "backup_code"
//           );

//         const available = [...new Set(strategies)];

//         if (available.length === 0) {
//           setError(
//             "This account needs another verification method. Try again or contact support."
//           );
//           return;
//         }

//         setMfaStrategies(available);

//         const preferred = available.includes("email_code")
//           ? "email_code"
//           : available[0];

//         setMfaStrategy(preferred);
//         setCode("");
//         setStep("second-factor");

//         if (preferred === "email_code") {
//           const { error: sendError } =
//             await signIn.mfa.sendEmailCode();

//           if (sendError) throw sendError;
//         }

//         return;
//       }

//       setError(
//         "We need one more step to finish signing you in. Please try again."
//       );
//     } catch (requestError) {
//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "We couldn't sign you in. Check your details and try again."
//         )
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   // Start password recovery.
//   const beginPasswordReset = async () => {
//     if (!isLoaded || working) return;

//     const normalizedEmail = normalizeEmail(email);

//     if (!isValidEmail(normalizedEmail)) {
//       setError(
//         "Enter your account email first, then request a reset code."
//       );
//       return;
//     }

//     setError("");
//     setWorking(true);

//     try {
//       const { error: createError } = await signIn.create({
//         identifier: normalizedEmail,
//       });

//       if (createError) throw createError;

//       const { error: sendError } =
//         await signIn.resetPasswordEmailCode.sendCode();

//       if (sendError) throw sendError;

//       setCode("");
//       setStep("reset-code");
//     } catch {
//       setError(
//         "We couldn't send a reset code to this address. Check the email and try again."
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   // Resend password reset code.
//   const resendResetCode = async () => {
//     if (!isLoaded || working) return;

//     setError("");
//     setWorking(true);

//     try {
//       const { error: sendError } =
//         await signIn.resetPasswordEmailCode.sendCode();

//       if (sendError) throw sendError;
//     } catch {
//       setError(
//         "We couldn't send a new code. Please wait and try again."
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   // Verify password reset code.
//   const verifyResetCode = async () => {
//     if (!isLoaded || working) return;

//     if (!/^\d{6,8}$/.test(code.trim())) {
//       setError("Enter the 6–8 digit code from your email.");
//       return;
//     }

//     setError("");
//     setWorking(true);

//     try {
//       const { error: verifyError } =
//         await signIn.resetPasswordEmailCode.verifyCode({
//           code: code.trim(),
//         });

//       if (verifyError) {
//         throw verifyError;
//       }

//       if (signIn.status !== "needs_new_password") {
//         setError(
//           "That code could not be verified. Check it and try again."
//         );
//         return;
//       }

//       setStep("new-password");
//       setCode("");
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

//   // Save the new password.
//   const saveNewPassword = async () => {
//     if (!isLoaded || working) return;

//     const passwordError = validatePassword(newPassword);

//     if (passwordError) {
//       setError(passwordError);
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Those passwords don't match yet.");
//       return;
//     }

//     setError("");
//     setWorking(true);

//     try {
//       const { error: passwordError } =
//         await signIn.resetPasswordEmailCode.submitPassword({
//           password: newPassword,
//         });

//       if (passwordError) {
//         throw passwordError;
//       }

//       if (signIn.status !== "complete") {
//         setError(
//           "Your password wasn't updated. Please request a new code."
//         );
//         return;
//       }

//       await finishSession();
//     } catch (requestError) {
//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "We couldn't update your password. Please try again."
//         )
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   // Choose an MFA verification method.
//   const chooseSecondFactor = async (
//     strategy: SecondFactorStrategy
//   ) => {
//     if (!isLoaded || working) return;

//     setError("");
//     setWorking(true);

//     try {
//       if (strategy === "email_code") {
//         const { error: sendError } =
//           await signIn.mfa.sendEmailCode();

//         if (sendError) throw sendError;
//       }

//       setMfaStrategy(strategy);
//       setCode("");
//     } catch (requestError) {
//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "We couldn't send a verification code. Please try again."
//         )
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   // Verify MFA code.
//   const verifySecondFactor = async () => {
//     if (!isLoaded || !mfaStrategy || working) return;

//     if (!code.trim()) {
//       setError("Enter your verification code to continue.");
//       return;
//     }

//     setError("");
//     setWorking(true);

//     try {
//       const verification =
//         mfaStrategy === "email_code"
//           ? await signIn.mfa.verifyEmailCode({
//               code: code.trim(),
//             })
//           : mfaStrategy === "totp"
//             ? await signIn.mfa.verifyTOTP({
//                 code: code.trim(),
//               })
//             : await signIn.mfa.verifyBackupCode({
//                 code: code.trim(),
//               });

//       if (verification.error) {
//         throw verification.error;
//       }

//       if (signIn.status === "complete") {
//         await finishSession();
//       } else {
//         setError(
//           "That code couldn't be verified. Check it and try again."
//         );
//       }
//     } catch (requestError) {
//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "That code couldn't be verified. Check it and try again."
//         )
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   // Resend MFA email code.
//   const resendMfaCode = async () => {
//     if (!isLoaded || working) return;

//     setError("");
//     setWorking(true);

//     try {
//       const { error: sendError } =
//         await signIn.mfa.sendEmailCode();

//       if (sendError) throw sendError;
//     } catch (requestError) {
//       setError(
//         getAuthErrorMessage(
//           requestError,
//           "We couldn't send a new verification code. Please try again."
//         )
//       );
//     } finally {
//       setWorking(false);
//     }
//   };

//   const isRecovery =
//     step === "reset-code" || step === "new-password";

//   const title =
//     step === "credentials"
//       ? "Welcome back."
//       : step === "reset-code"
//         ? "Check your inbox."
//         : step === "new-password"
//           ? "Choose a new password."
//           : "One more step.";

//   const description =
//     step === "credentials"
//       ? "Sign in to pick up where you left off and keep your repairs moving."
//       : step === "reset-code"
//         ? `We sent a reset code to ${normalizeEmail(email)}.`
//         : step === "new-password"
//           ? "Create a new password to secure your account."
//           : "Your account needs an additional verification code.";

//   return (
//     <AuthLayout
//       eyebrow={isRecovery ? "ACCOUNT RECOVERY" : "YOUR REPAIR JOURNEY"}
//       title={title}
//       description={description}
//     >
//       {error ? <AuthInlineError message={error} /> : null}

//       {step === "credentials" ? (
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
//             placeholder="Enter your password"
//             secureTextEntry
//             autoCapitalize="none"
//             autoComplete="current-password"
//             textContentType="password"
//             accessibilityLabel="Password"
//             returnKeyType="done"
//             onSubmitEditing={signInWithPassword}
//           />

//           <AuthButton
//             title="Sign in"
//             loading={working}
//             disabled={!isLoaded || googleWorking}
//             onPress={signInWithPassword}
//           />

//           <GoogleSignInButton
//             onPress={signInWithGoogle}
//             loading={googleWorking}
//             disabled={!isLoaded || working}
//           />

//           <AuthTextButton
//             label="Forgot password?"
//             onPress={beginPasswordReset}
//           />

//           <AuthTextButton
//             label="New to RePair? Create an account"
//             onPress={() => router.push("/sign-up")}
//           />
//         </>
//       ) : step === "reset-code" ? (
//         <>
//           <AuthField
//             label="Password reset code"
//             value={code}
//             onChangeText={(value) =>
//               setCode(value.replace(/\D/g, "").slice(0, 8))
//             }
//             placeholder="Enter your code"
//             keyboardType="number-pad"
//             autoComplete="one-time-code"
//             textContentType="oneTimeCode"
//             accessibilityLabel="Password reset code"
//             returnKeyType="done"
//             onSubmitEditing={verifyResetCode}
//             maxLength={8}
//           />

//           <AuthButton
//             title="Verify code"
//             loading={working}
//             disabled={!isLoaded}
//             onPress={verifyResetCode}
//           />

//           <AuthTextButton
//             label="Send a new code"
//             onPress={resendResetCode}
//           />

//           <AuthTextButton
//             label="Back to sign in"
//             onPress={() => {
//               setStep("credentials");
//               setCode("");
//               setError("");
//             }}
//           />
//         </>
//       ) : step === "new-password" ? (
//         <>
//           <AuthField
//             label="New password"
//             value={newPassword}
//             onChangeText={setNewPassword}
//             placeholder="At least 8 characters"
//             secureTextEntry
//             autoCapitalize="none"
//             autoComplete="new-password"
//             textContentType="newPassword"
//             accessibilityLabel="New password"
//             returnKeyType="next"
//           />

//           <AuthField
//             label="Confirm new password"
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             placeholder="Enter it again"
//             secureTextEntry
//             autoCapitalize="none"
//             autoComplete="new-password"
//             textContentType="newPassword"
//             accessibilityLabel="Confirm new password"
//             returnKeyType="done"
//             onSubmitEditing={saveNewPassword}
//           />

//           <AuthButton
//             title="Save new password"
//             loading={working}
//             disabled={!isLoaded}
//             onPress={saveNewPassword}
//           />
//         </>
//       ) : (
//         <>
//           {mfaStrategies.length > 1 ? (
//             <View style={{ marginBottom: 14 }}>
//               <AuthFooterText>
//                 Choose a verification method
//               </AuthFooterText>

//               {mfaStrategies.map((strategy) => (
//                 <AuthTextButton
//                   key={strategy}
//                   label={
//                     strategy === "email_code"
//                       ? "Email code"
//                       : strategy === "totp"
//                         ? "Authenticator app"
//                         : "Backup code"
//                   }
//                   onPress={() => chooseSecondFactor(strategy)}
//                 />
//               ))}
//             </View>
//           ) : null}

//           <AuthField
//             label={
//               mfaStrategy === "backup_code"
//                 ? "Backup code"
//                 : mfaStrategy === "totp"
//                   ? "Authenticator code"
//                   : "Email verification code"
//             }
//             value={code}
//             onChangeText={setCode}
//             placeholder="Enter your code"
//             keyboardType="number-pad"
//             autoComplete="one-time-code"
//             textContentType="oneTimeCode"
//             accessibilityLabel="Verification code"
//             returnKeyType="done"
//             onSubmitEditing={verifySecondFactor}
//           />

//           <AuthButton
//             title="Verify and sign in"
//             loading={working}
//             disabled={!isLoaded || !mfaStrategy}
//             onPress={verifySecondFactor}
//           />

//           {mfaStrategy === "email_code" ? (
//             <AuthTextButton
//               label="Resend email code"
//               onPress={resendMfaCode}
//             />
//           ) : null}
//         </>
//       )}

//       {step === "credentials" ? (
//         <AuthFooterText>
//           Your account keeps your repair requests and updates together.
//         </AuthFooterText>
//       ) : null}

//       <View nativeID="clerk-captcha" />
//     </AuthLayout>
//   );
// }