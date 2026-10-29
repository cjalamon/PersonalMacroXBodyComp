// Temporary placeholder for tabs that haven't been built yet.

import { StyleSheet, Text, View } from "react-native";

import { colors, text } from "@/theme";

export function ComingSoon({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.note}>Coming next.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, justifyContent: "center", paddingHorizontal: 22, gap: 6 },
  eyebrow: { ...text.eyebrow, color: colors.accentText },
  title: { ...text.pageTitle, color: colors.ink },
  note: { ...text.body, color: colors.muted },
});
