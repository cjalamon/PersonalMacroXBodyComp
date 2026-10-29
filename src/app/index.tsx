// src/app/index.tsx
// The "Today" screen, built from the Figma frame "Today · Daily nutrition".
// Still uses fake data; later it reads from the scales, HealthKit and saved logs.

import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Activity as ActivityIcon, Apple, ChevronLeft, ChevronRight, Plus, Sun, Sunrise } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

import { EnergyRing } from "@/components/energy-ring";
import { BottomTabInset } from "@/constants/theme";
import { colors, fonts, radius, spacing, text } from "@/theme";
import type { Activity, FoodEntry, Macros, Meal } from "@/types";

// ---- Fake data (delete once real data is wired in) ----
const GOALS: Macros = { calories: 2400, protein: 180, carbs: 270, fat: 67 };
const USER_INITIALS = "AJ";

const food = (id: string, name: string, meal: Meal, grams: number, calories: number, protein: number, carbs: number, fat: number): FoodEntry => ({
  id, name, meal, grams, loggedAt: new Date(), macros: { calories, protein, carbs, fat },
});

const MOCK_FOODS: FoodEntry[] = [
  food("1", "Overnight oats", "breakfast", 80, 300, 10, 54, 5),
  food("2", "berries", "breakfast", 120, 70, 1, 17, 0),
  food("3", "almond butter", "breakfast", 25, 150, 5, 5, 13),
  food("4", "Salmon", "lunch", 140, 330, 36, 0, 14),
  food("5", "rice", "lunch", 200, 260, 5, 57, 1),
  food("6", "avocado bowl", "lunch", 70, 170, 2, 9, 10),
  food("7", "Greek yogurt", "snack", 170, 150, 25, 9, 0),
  food("8", "banana", "snack", 120, 105, 1, 27, 0),
  food("9", "walnuts", "snack", 20, 145, 3, 3, 14),
];

const MOCK_ACTIVITY: Activity = { steps: 6240, caloriesBurned: 410 };

// ---- Helpers ----
function totalMacros(foods: FoodEntry[]): Macros {
  return foods.reduce(
    (sum, f) => ({
      calories: sum.calories + f.macros.calories,
      protein: sum.protein + f.macros.protein,
      carbs: sum.carbs + f.macros.carbs,
      fat: sum.fat + f.macros.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

// "Today, Thursday 29 Oct" or "Wednesday 28 Oct"
function formatDay(date: Date): string {
  const label = date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
  return isSameDay(date, new Date()) ? `Today, ${label}` : label;
}

// "Oats, berries & almond butter"
function listFoods(foods: FoodEntry[]): string {
  const names = foods.map((f) => f.name);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

// The four meals shown in "Your meals", with their Figma icons.
const MEALS: { meal: Meal; label: string; Icon: LucideIcon }[] = [
  { meal: "breakfast", label: "Breakfast", Icon: Sunrise },
  { meal: "lunch", label: "Lunch", Icon: Sun },
  { meal: "snack", label: "Snack", Icon: Apple },
];

// ---- Small components ----

// One column under the divider: "Protein  126 / 180 g  ▬▬▬  54 g left"
function MacroTarget({ label, value, goal }: { label: string; value: number; goal: number }) {
  const pct = Math.min(value / goal, 1) * 100;
  const left = Math.round(goal - value);
  return (
    <View style={styles.macro}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>
        {Math.round(value)}
        <Text style={styles.macroGoal}> / {goal} g</Text>
      </Text>
      <View style={styles.track}>
        <View style={[styles.trackFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.macroLeft}>{left >= 0 ? `${left} g left` : `${-left} g over`}</Text>
    </View>
  );
}

// One row in "Your meals"
function MealRow({ label, Icon, foods }: { label: string; Icon: LucideIcon; foods: FoodEntry[] }) {
  const calories = totalMacros(foods).calories;
  return (
    <View style={styles.mealRow}>
      <Icon size={20} color={colors.muted} strokeWidth={1.5} />
      <View style={styles.mealDetails}>
        <Text style={styles.mealName}>{label}</Text>
        <Text style={styles.mealFoods} numberOfLines={1}>
          {listFoods(foods)}
        </Text>
      </View>
      <View style={styles.mealEnergy}>
        <Text style={styles.mealCalories}>{Math.round(calories)}</Text>
        <Text style={styles.mealUnit}>kcal</Text>
      </View>
    </View>
  );
}

// ---- The screen ----
export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const [day, setDay] = useState<Date>(new Date());
  const [foods] = useState<FoodEntry[]>(MOCK_FOODS);
  const [activity] = useState<Activity>(MOCK_ACTIVITY);

  const totals = totalMacros(foods);
  const remaining = Math.max(GOALS.calories - totals.calories, 0);
  const isToday = isSameDay(day, new Date());
  const dinnerFoods = foods.filter((f) => f.meal === "dinner");

  const shiftDay = (days: number) => {
    const next = new Date(day);
    next.setDate(next.getDate() + days);
    setDay(next);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.pageTop, paddingBottom: insets.bottom + BottomTabInset + spacing.page },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.eyebrow}>FORM / DAILY PRACTICE</Text>
          <Text style={styles.pageTitle}>Make today count.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{USER_INITIALS}</Text>
        </View>
      </View>

      {/* Date selector */}
      <View style={styles.dateRow}>
        <Pressable onPress={() => shiftDay(-1)} hitSlop={12}>
          <ChevronLeft size={18} color={colors.ink} strokeWidth={1.7} />
        </Pressable>
        <View style={styles.dateLabel}>
          <Text style={styles.dateText}>{formatDay(day)}</Text>
          {isToday && <View style={styles.todayDot} />}
        </View>
        <Pressable onPress={() => shiftDay(1)} hitSlop={12} disabled={isToday}>
          <ChevronRight size={18} color={isToday ? colors.divider : colors.muted} strokeWidth={1.7} />
        </Pressable>
      </View>

      {/* Daily energy card */}
      <View style={styles.energyCard}>
        <View style={styles.energyHeader}>
          <Text style={styles.cardLabel}>DAILY ENERGY</Text>
          <View style={styles.darkBadge}>
            <Text style={styles.darkBadgeText}>{GOALS.calories.toLocaleString()} kcal goal</Text>
          </View>
        </View>

        <View style={styles.energySummary}>
          <View style={styles.remaining}>
            <Text style={styles.remainingValue}>{Math.round(remaining).toLocaleString()}</Text>
            <Text style={styles.remainingLabel}>kcal remaining</Text>
          </View>
          <EnergyRing eaten={totals.calories} goal={GOALS.calories} />
        </View>

        <View style={styles.activity}>
          <View style={styles.activityLabelRow}>
            <ActivityIcon size={16} color={colors.onDarkMuted} strokeWidth={2} />
            <Text style={styles.activityLabel}>Activity</Text>
          </View>
          <View style={styles.activityValues}>
            <Text style={styles.activityValue}>{activity.steps.toLocaleString()} steps</Text>
            <Text style={styles.activityValue}>{activity.caloriesBurned} kcal burned</Text>
          </View>
          <View style={styles.infoBadge}>
            <Text style={styles.darkBadgeText}>Not added to food budget</Text>
          </View>
        </View>

        <View style={styles.darkDivider} />

        <View style={styles.macroRow}>
          <MacroTarget label="Protein" value={totals.protein} goal={GOALS.protein} />
          <MacroTarget label="Carbs" value={totals.carbs} goal={GOALS.carbs} />
          <MacroTarget label="Fat" value={totals.fat} goal={GOALS.fat} />
        </View>
      </View>

      {/* Your meals */}
      <View style={styles.meals}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Your meals</Text>
          <Text style={styles.link}>View diary</Text>
        </View>

        <View style={styles.mealCard}>
          {MEALS.map(({ meal, label, Icon }) => {
            const mealFoods = foods.filter((f) => f.meal === meal);
            if (mealFoods.length === 0) return null;
            return <MealRow key={meal} label={label} Icon={Icon} foods={mealFoods} />;
          })}

          {dinnerFoods.length > 0 ? (
            <MealRow label="Dinner" Icon={Sun} foods={dinnerFoods} />
          ) : (
            <View style={styles.dinnerRow}>
              <Text style={styles.dinnerLabel}>Dinner</Text>
              <Pressable style={styles.addFood}>
                <Plus size={14} color={colors.accentText} strokeWidth={2} />
                <Text style={styles.link}>Add food</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* Primary action */}
      <Pressable style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.85 }]}>
        <Plus size={18} color={colors.ink} strokeWidth={2} />
        <Text style={styles.primaryButtonText}>Log food</Text>
      </Pressable>
    </ScrollView>
  );
}

// All values below come from the Figma file.
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.page, gap: spacing.section },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  greeting: { gap: 5, flexShrink: 1 },
  eyebrow: { ...text.eyebrow, color: colors.accentText },
  pageTitle: { ...text.pageTitle, color: colors.ink },
  avatar: {
    width: 38, height: 38, borderRadius: radius.pill, backgroundColor: colors.ink,
    alignItems: "center", justifyContent: "center", marginBottom: 9,
  },
  avatarText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.onDark },

  // Date selector
  dateRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 38 },
  dateLabel: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateText: { ...text.bodyStrong, color: colors.ink },
  todayDot: { width: 5, height: 5, borderRadius: radius.pill, backgroundColor: colors.accentText },

  // Daily energy card
  energyCard: { backgroundColor: colors.cardDark, borderRadius: radius.card, padding: spacing.cardPadding, gap: 21 },
  energyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { ...text.cardLabel, color: colors.onDarkMuted },
  darkBadge: { backgroundColor: colors.panelDark, borderRadius: radius.pill, paddingVertical: 4, paddingHorizontal: 8 },
  darkBadgeText: { ...text.caption, color: colors.onDark },

  energySummary: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  remaining: { gap: 3 },
  remainingValue: { fontFamily: fonts.semibold, fontSize: 62, letterSpacing: -3, color: colors.onDark },
  remainingLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.onDarkMuted },

  activity: { backgroundColor: colors.panelDark, borderRadius: radius.panel, paddingVertical: 10, paddingHorizontal: 12, gap: 8 },
  activityLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  activityLabel: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.2, color: colors.onDarkMuted },
  activityValues: { flexDirection: "row", gap: 10 },
  activityValue: { ...text.bodyStrong, color: colors.onDark },
  infoBadge: {
    alignSelf: "flex-start", backgroundColor: colors.cardDark, borderRadius: radius.pill,
    paddingVertical: 4, paddingHorizontal: 8,
  },

  darkDivider: { height: 1, backgroundColor: colors.panelDark },

  macroRow: { flexDirection: "row", gap: 15 },
  macro: { flex: 1, gap: 8 },
  macroLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.onDarkMuted },
  macroValue: { fontFamily: fonts.regular, fontSize: 21, letterSpacing: -0.7, color: colors.onDark },
  macroGoal: { fontFamily: fonts.regular, fontSize: 10, letterSpacing: 0, color: colors.onDarkMuted },
  track: { height: 4, borderRadius: radius.pill, backgroundColor: colors.panelDark, overflow: "hidden" },
  trackFill: { height: 4, borderRadius: radius.pill, backgroundColor: colors.accent },
  macroLeft: { ...text.caption, color: colors.onDarkMuted },

  // Your meals
  meals: { gap: 12 },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { ...text.sectionTitle, color: colors.ink },
  link: { ...text.link, color: colors.accentText },

  mealCard: { backgroundColor: colors.card, borderRadius: radius.card, paddingHorizontal: 16 },
  mealRow: {
    flexDirection: "row", alignItems: "center", gap: 12, height: 65,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  mealDetails: { flex: 1, gap: 4 },
  mealName: { ...text.body, color: colors.ink },
  mealFoods: { ...text.caption, color: colors.muted },
  mealEnergy: { alignItems: "flex-end", gap: 2 },
  mealCalories: { fontFamily: fonts.semibold, fontSize: 17, color: colors.ink },
  mealUnit: { fontFamily: fonts.regular, fontSize: 9, color: colors.muted },

  dinnerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 47 },
  dinnerLabel: { ...text.bodyStrong, color: colors.ink },
  addFood: { flexDirection: "row", alignItems: "center", gap: 5 },

  // Primary action
  primaryButton: {
    height: 52, borderRadius: radius.pill, backgroundColor: colors.accent,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9,
  },
  primaryButtonText: { ...text.button, color: colors.ink },
});
