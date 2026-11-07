import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useClerk, useUser } from "@clerk/expo";

const GREEN = "#176B4D";
const BG = "#F6F8F4";
const DARK = "#18352B";
const MUTED = "#718078";
const LIGHT = "#E6F0E9";
const BORDER = "#E1E8E1";

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const signOutOfAccount = async () => {
    if (isSigningOut) return;
    setSignOutError("");
    setIsSigningOut(true);

    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      setSignOutError(
        error instanceof Error
          ? error.message
          : "We couldn’t sign you out. Please try again."
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>My Profile</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>

          <Text style={styles.welcome}>
            {user?.fullName || user?.username || "Welcome to RePair!"}
          </Text>

          <Text style={styles.profileSubtitle}>
            {user?.primaryEmailAddress?.emailAddress ||
              "Your repair journey starts here."}
          </Text>
        </View>

        <View style={styles.accountCard}>
          <View style={styles.accountCopy}>
            <Text style={styles.accountTitle}>Your account</Text>
            <Text style={styles.accountSubtitle}>
              Your details are securely managed with your account.
            </Text>
          </View>
          {signOutError ? (
            <Text accessibilityRole="alert" style={styles.signOutError}>
              {signOutError}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            disabled={isSigningOut}
            onPress={signOutOfAccount}
            style={[
              styles.signOutButton,
              isSigningOut ? styles.signOutButtonDisabled : null,
            ]}
          >
            <Text style={styles.signOutText}>
              {isSigningOut ? "Signing out..." : "Sign out"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Your activity</Text>

        <Pressable
          style={styles.menuCard}
          onPress={() => router.push("/my-repairs")}
        >
          <View style={styles.menuIcon}>
            <Text style={styles.iconText}>▤</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>My Repairs</Text>
            <Text style={styles.menuSubtitle}>
              Track your repair requests
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Quick links</Text>

        <Pressable
          style={styles.menuCard}
          onPress={() => router.push("/report")}
        >
          <View style={styles.menuIcon}>
            <Text style={styles.iconText}>＋</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Report a Problem</Text>
            <Text style={styles.menuSubtitle}>
              Get help with a broken item
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable
          style={styles.menuCard}
          onPress={() => router.push("/parts")}
        >
          <View style={styles.menuIcon}>
            <Text style={styles.iconText}>⚙</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Find Spare Parts</Text>
            <Text style={styles.menuSubtitle}>
              Discover parts for your repairs
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>RePair</Text>
          <Text style={styles.aboutText}>
            RePair helps you diagnose problems, find spare parts,
            and connect with repair professionals.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable
          style={styles.navItem}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navLabel}>Home</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/my-repairs")}
        >
          <Text style={styles.navIcon}>▤</Text>
          <Text style={styles.navLabel}>My Repairs</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <Text style={[styles.navIcon, styles.activeNav]}>●</Text>
          <Text style={[styles.navLabel, styles.activeNav]}>
            Profile
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 32,
    color: DARK,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: DARK,
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 28,
  },
  profileCard: {
    marginHorizontal: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: LIGHT,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
  },
  welcome: {
    fontSize: 21,
    fontWeight: "800",
    color: DARK,
  },
  profileSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
  },
  accountCard: {
    marginHorizontal: 20,
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  accountCopy: {
    marginBottom: 14,
  },
  accountTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: DARK,
  },
  accountSubtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: MUTED,
  },
  signOutButton: {
    minHeight: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FBFCFA",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "700",
  },
  signOutError: {
    color: "#9B3024",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "800",
    color: DARK,
  },
  menuCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 23,
    color: GREEN,
    fontWeight: "700",
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DARK,
  },
  menuSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: MUTED,
  },
  chevron: {
    fontSize: 26,
    color: MUTED,
    marginLeft: 8,
  },
  aboutCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: GREEN,
  },
  aboutText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
  },
  bottomNav: {
    minHeight: 68,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    fontSize: 21,
    color: MUTED,
  },
  navLabel: {
    marginTop: 3,
    fontSize: 11,
    color: MUTED,
    fontWeight: "600",
  },
  activeNav: {
    color: GREEN,
  },
});