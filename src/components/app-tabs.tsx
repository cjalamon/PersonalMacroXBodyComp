// The bottom tab bar: Today, Food, Progress, You.
// Uses the native iOS tab bar, styled with the Figma colors.
// Icons are Apple's SF Symbols, the closest native match to the Figma icons.

import { NativeTabs } from "expo-router/unstable-native-tabs";

import { colors, fonts } from "@/theme";

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={colors.card}
      indicatorColor={colors.softGreen}
      tintColor={colors.accentText}
      iconColor={colors.muted}
      labelStyle={{
        default: { color: colors.muted, fontFamily: fonts.medium, fontSize: 10 },
        selected: { color: colors.ink, fontFamily: fonts.bold, fontSize: 10 },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="food">
        <NativeTabs.Trigger.Label>Food</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="fork.knife" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.line.uptrend.xyaxis" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="you">
        <NativeTabs.Trigger.Label>You</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
