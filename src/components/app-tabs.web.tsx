// Web version of the bottom tab bar (used by `npm run web` in a browser).
// The iPhone uses app-tabs.tsx instead. This one copies the Figma nav exactly,
// which makes the web preview a handy way to check layouts on Windows.

import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps } from "expo-router/ui";
import { ChartNoAxesCombined, LayoutDashboard, UserRound, Utensils } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radius } from "@/theme";

const TABS: { name: string; href: "/" | "/food" | "/progress" | "/you"; label: string; Icon: LucideIcon }[] = [
  { name: "index", href: "/", label: "Today", Icon: LayoutDashboard },
  { name: "food", href: "/food", label: "Food", Icon: Utensils },
  { name: "progress", href: "/progress", label: "Progress", Icon: ChartNoAxesCombined },
  { name: "you", href: "/you", label: "You", Icon: UserRound },
];

export default function AppTabs() {
  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />
      <TabList style={styles.bar}>
        {TABS.map(({ name, href, label, Icon }) => (
          <TabTrigger key={name} name={name} href={href} asChild>
            <TabButton label={label} Icon={Icon} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

function TabButton({ label, Icon, isFocused, ...props }: TabTriggerSlotProps & { label: string; Icon: LucideIcon }) {
  return (
    <Pressable {...props} style={styles.item}>
      <View style={[styles.pill, isFocused && styles.pillSelected]}>
        <Icon size={20} strokeWidth={1.7} color={isFocused ? colors.accentText : colors.muted} />
      </View>
      <Text style={[styles.label, isFocused && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  slot: { flex: 1 },
  bar: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 22,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  item: { flex: 1, alignItems: "center", gap: 5 },
  pill: { width: 54, height: 28, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  pillSelected: { backgroundColor: colors.softGreen },
  label: { fontFamily: fonts.medium, fontSize: 10, color: colors.muted },
  labelSelected: { fontFamily: fonts.bold, color: colors.ink },
});
