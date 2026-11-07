import { useRouter } from "expo-router";

import React from "react";

import {

  SafeAreaView,

  ScrollView,

  StatusBar,

  StyleSheet,

  Text,

  TextInput,

  Pressable,

  View,

} from "react-native";

const GREEN = "#176B4D";

const BG = "#F6F8F4";

const DARK = "#18352B";

const MUTED = "#718078";

const LIGHT = "#E6F0E9";

const categories = [

  { emoji: "📱", name: "Phones", detail: "Screens, batteries" },

  { emoji: "💻", name: "Laptops", detail: "Hardware, software" },

  { emoji: "🎧", name: "Audio", detail: "Headphones, speakers" },

  { emoji: "🏠", name: "Home", detail: "Everyday appliances" },

];

export default function HomeScreen() {

  const router = useRouter();

  // Navigation functions*

  const goHome = () => router.replace("/");

  const goToReport = () => router.push("/report");

  const goToParts = () => router.push("/parts");

  const goToProfile = () => router.push("/profile");

  return (

    <SafeAreaView style={styles.safeArea}>

      <StatusBar barStyle="dark-content" />

      {/* Scrollable Home content */}

      <ScrollView

        style={styles.content}

        contentContainerStyle={styles.scrollContent}

        showsVerticalScrollIndicator={false}

        keyboardShouldPersistTaps="handled"

      >

        {/* Header */}

        <View style={styles.header}>

          <View style={styles.brand}>

            <View style={styles.logo}>

              <Text style={styles.logoEmoji}>♻️</Text>

            </View>

            <View>

              <Text style={styles.brandName}>RePair</Text>

              <Text style={styles.tagline}>

                Repair more. Waste less.

              </Text>

            </View>

          </View>

          <Pressable

            onPress={goToProfile}

            style={styles.profileButton}

          >

            <Text style={styles.profileEmoji}>👤</Text>

          </Pressable>

        </View>

        {/* Welcome section */}

        <View style={styles.intro}>

          <Text style={styles.eyebrow}>

            YOUR REPAIR COMMUNITY

          </Text>

          <Text style={styles.heading}>

            Give your things{"\n"}a second life.

          </Text>

          <Text style={styles.description}>

            Find trusted repairers, discover parts, and keep useful

            things out of landfills.

          </Text>

        </View>

        {/* Search */}

        <View style={styles.searchBox}>

          <Text style={styles.searchEmoji}>🔍</Text>

          <TextInput

            placeholder="What needs fixing?"

            placeholderTextColor="#8A968E"

            style={styles.searchInput}

            returnKeyType="search"

            onSubmitEditing={goToReport}

          />

        </View>

        {/* Main repair action */}

        <View style={styles.heroCard}>

          <View style={styles.heroTop}>

            <View style={styles.heroTextContainer}>

              <Text style={styles.heroEyebrow}>START HERE</Text>

              <Text style={styles.heroTitle}>

                Something broken?

              </Text>

              <Text style={styles.heroDescription}>

                Tell us what happened. We&apos;ll help you find your next

                step.

              </Text>

            </View>

            <Text style={styles.heroEmoji}>🛠️</Text>

          </View>

          <Pressable

            onPress={goToReport}

            style={styles.primaryButton}

          >

            <Text style={styles.primaryButtonText}>

              Report a broken item →

            </Text>

          </Pressable>

        </View>

        {/* Quick actions */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>

            What would you like to do?

          </Text>

          <View style={styles.actionRow}>

            <Pressable

              onPress={goToReport}

              style={[styles.actionCard, styles.actionCardLeft]}

            >

              <Text style={styles.actionEmoji}>🔧</Text>

              <Text style={styles.actionTitle}>

                Find a repairer

              </Text>

              <Text style={styles.actionDescription}>

                Get help fixing your item

              </Text>

            </Pressable>

            <Pressable

              onPress={goToParts}

              style={styles.actionCard}

            >

              <Text style={styles.actionEmoji}>🧩</Text>

              <Text style={styles.actionTitle}>

                Find spare parts

              </Text>

              <Text style={styles.actionDescription}>

                Give old things new life

              </Text>

            </Pressable>

          </View>

        </View>

        {/* Browse categories */}

        <View style={styles.section}>

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>

              Browse categories

            </Text>

            <Pressable onPress={goToReport}>

              <Text style={styles.exploreText}>Explore</Text>

            </Pressable>

          </View>

          {categories.map((category) => (

            <Pressable

              key={category.name}

              onPress={goToReport}

              style={styles.categoryCard}

            >

              <View style={styles.categoryIcon}>

                <Text style={styles.categoryEmoji}>

                  {category.emoji}

                </Text>

              </View>

              <View style={styles.categoryInfo}>

                <Text style={styles.categoryName}>

                  {category.name}

                </Text>

                <Text style={styles.categoryDetail}>

                  {category.detail}

                </Text>

              </View>

              <Text style={styles.chevron}>›</Text>

            </Pressable>

          ))}

        </View>

        {/* Community banner */}

        <View style={styles.communityCard}>

          <Text style={styles.eyebrow}>

            SMALL FIXES, BIG IMPACT

          </Text>

          <Text style={styles.communityTitle}>

            Be part of the repair movement.

          </Text>

          <Text style={styles.description}>

            Repairing and reusing helps save money, conserve resources,

            and reduce waste.

          </Text>

        </View>

        <Text style={styles.footer}>

          RePair · Repair more, waste less

        </Text>

      </ScrollView>

      {/* Fixed bottom navigation */}

      <View style={styles.bottomNav}>

        <Pressable

          onPress={goHome}

          style={styles.navItem}

          accessibilityRole="button"

          accessibilityLabel="Home"

        >

          <Text style={styles.navEmoji}>🏡</Text>

          <Text style={styles.activeNavText}>Home</Text>

        </Pressable>

        <Pressable

          onPress={goToReport}

          style={styles.navItem}

          accessibilityRole="button"

          accessibilityLabel="Repair"

        >

          <Text style={styles.navEmoji}>🛠️</Text>

          <Text style={styles.navText}>Repair</Text>

        </Pressable>

        <Pressable

          onPress={goToParts}

          style={styles.navItem}

          accessibilityRole="button"

          accessibilityLabel="Parts"

        >

          <Text style={styles.navEmoji}>🧩</Text>

          <Text style={styles.navText}>Parts</Text>

        </Pressable>

        <Pressable

          onPress={goToProfile}

          style={styles.navItem}

          accessibilityRole="button"

          accessibilityLabel="Profile"

        >

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

  content: {

    flex: 1,

  },

  scrollContent: {

    paddingBottom: 24,

  },

  header: {

    paddingHorizontal: 20,

    paddingTop: 12,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

  },

  brand: {

    flexDirection: "row",

    alignItems: "center",

  },

  logo: {

    width: 44,

    height: 44,

    borderRadius: 16,

    backgroundColor: GREEN,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 10,

  },

  logoEmoji: {

    fontSize: 24,

  },

  brandName: {

    color: DARK,

    fontSize: 24,

    fontWeight: "800",

  },

  tagline: {

    color: MUTED,

    fontSize: 12,

    marginTop: 2,

  },

  profileButton: {

    width: 44,

    height: 44,

    borderRadius: 22,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    alignItems: "center",

    justifyContent: "center",

  },

  profileEmoji: {

    fontSize: 20,

  },

  intro: {

    paddingHorizontal: 20,

    paddingTop: 30,

  },

  eyebrow: {

    color: GREEN,

    fontSize: 12,

    fontWeight: "800",

    letterSpacing: 1.2,

  },

  heading: {

    marginTop: 10,

    color: DARK,

    fontSize: 32,

    lineHeight: 39,

    fontWeight: "800",

  },

  description: {

    marginTop: 12,

    color: MUTED,

    fontSize: 15,

    lineHeight: 23,

  },

  searchBox: {

    marginHorizontal: 20,

    marginTop: 22,

    height: 56,

    borderRadius: 16,

    borderWidth: 1,

    borderColor: "#E5E7EB",

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 15,

    flexDirection: "row",

    alignItems: "center",

  },

  searchEmoji: {

    fontSize: 20,

    marginRight: 12,

  },

  searchInput: {

    flex: 1,

    color: DARK,

    fontSize: 15,

  },

  heroCard: {

    marginHorizontal: 20,

    marginTop: 22,

    padding: 20,

    borderRadius: 26,

    backgroundColor: GREEN,

  },

  heroTop: {

    flexDirection: "row",

    alignItems: "flex-start",

  },

  heroTextContainer: {

    flex: 1,

    paddingRight: 10,

  },

  heroEyebrow: {

    color: "#D9F0E1",

    fontSize: 11,

    fontWeight: "800",

    letterSpacing: 1.3,

  },

  heroTitle: {

    marginTop: 10,

    color: "#FFFFFF",

    fontSize: 23,

    fontWeight: "800",

  },

  heroDescription: {

    marginTop: 8,

    color: "#F0FAF3",

    fontSize: 14,

    lineHeight: 21,

  },

  heroEmoji: {

    fontSize: 38,

  },

  primaryButton: {

    marginTop: 20,

    minHeight: 50,

    borderRadius: 13,

    backgroundColor: "#FFFFFF",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 12,

  },

  primaryButtonText: {

    color: GREEN,

    fontWeight: "800",

    fontSize: 14,

  },

  section: {

    marginTop: 30,

    paddingHorizontal: 20,

  },

  sectionTitle: {

    color: DARK,

    fontSize: 19,

    fontWeight: "800",

  },

  actionRow: {

    flexDirection: "row",

    marginTop: 15,

  },

  actionCard: {

    flex: 1,

    padding: 15,

    borderRadius: 18,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#EEF0EC",

  },

  actionCardLeft: {

    marginRight: 12,

  },

  actionEmoji: {

    fontSize: 27,

  },

  actionTitle: {

    marginTop: 12,

    color: DARK,

    fontSize: 14,

    fontWeight: "800",

  },

  actionDescription: {

    marginTop: 6,

    color: MUTED,

    fontSize: 12,

    lineHeight: 18,

  },

  sectionHeader: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

  },

  exploreText: {

    color: GREEN,

    fontSize: 13,

    fontWeight: "700",

  },

  categoryCard: {

    marginTop: 12,

    padding: 14,

    borderRadius: 17,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#EEF0EC",

    flexDirection: "row",

    alignItems: "center",

  },

  categoryIcon: {

    width: 48,

    height: 48,

    borderRadius: 14,

    backgroundColor: LIGHT,

    alignItems: "center",

    justifyContent: "center",

  },

  categoryEmoji: {

    fontSize: 25,

  },

  categoryInfo: {

    flex: 1,

    marginLeft: 14,

  },

  categoryName: {

    color: DARK,

    fontWeight: "800",

    fontSize: 15,

  },

  categoryDetail: {

    color: MUTED,

    fontSize: 12,

    marginTop: 4,

  },

  chevron: {

    color: MUTED,

    fontSize: 24,

  },

  communityCard: {

    marginHorizontal: 20,

    marginTop: 28,

    padding: 20,

    borderRadius: 24,

    backgroundColor: LIGHT,

    borderWidth: 1,

    borderColor: "#D9EBDD",

  },

  communityTitle: {

    marginTop: 10,

    color: DARK,

    fontSize: 21,

    fontWeight: "800",

    lineHeight: 28,

  },

  footer: {

    marginTop: 24,

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

  activeNavText: {

    color: GREEN,

    fontWeight: "800",

    fontSize: 11,

    marginTop: 5,

  },

  navText: {

    color: MUTED,

    fontSize: 11,

    marginTop: 5,

  },

});
