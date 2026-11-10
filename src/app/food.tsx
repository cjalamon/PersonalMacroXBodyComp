import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";

import { BottomTabInset } from "@/constants/theme";
import { searchFoods, type FoodSearchResult } from "@/nutrition/usda";
import { colors, fonts, radius, spacing, text } from "@/theme";
import { FoodEntry } from "@/types";



export default function FoodScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState<string>("");
  const [result, setResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  async function runSearch(){

    if (query.trim() === ""){
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const found = await searchFoods(query);
      setResults(found);
    } catch {
      setError("Search failed. Check your connection and try again.")
    } finally {
      setLoading(false);
    }
    
  }
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.pageTop, paddingBottom: insets.bottom + BottomTabInset + spacing.page },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.greeting}>
        <Text style={styles.eyebrow}>FOOD JOURNAL</Text>
        <Text style={styles.pageTitle}>Log food</Text>
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color={colors.muted} strokeWidth={1.7} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods, e.g. banana"
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          autoCorrect={false}
          value = {query}
          onChangeText = {setQuery}
          onSubmitEditing = {runSearch}
        />
      </View>

      {loading && <ActivityIndicator color={colors.accentText} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {result.length > 0 && (
        <View style={styles.resultCard}>
          {
            result.map((r) => (
              <Pressable key = {r.fdcId} style = {styles.resultRow}>
                <View style = {styles.resultText}>
                  <Text style={styles.resultName} numberOfLines={2}>{ r.name }</Text>
                    <Text style={styles.resultMeta}>{Math.round(r.per100g.calories)} kcal per 100 g</Text>
                </View>
              </Pressable>
          ))}
      </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.page, gap: spacing.section },
  greeting: { gap: 5 },
  eyebrow: { ...text.eyebrow, color: colors.accentText },
  pageTitle: { ...text.pageTitle, color: colors.ink },

  searchBox: {
    flexDirection: "row", alignItems: "center", gap: 10, height: 48,
    paddingHorizontal: 16, backgroundColor: colors.card, borderRadius: radius.panel,
    borderWidth: 1, borderColor: colors.divider,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink },

  error: { ...text.body, color: "#B3261E" },

  resultCard: { backgroundColor: colors.card, borderRadius: radius.card, paddingHorizontal: 16 },
  resultRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.divider },
  resultText: { gap: 4 },
  resultName: { ...text.bodyStrong, color: colors.ink },
  resultMeta: { ...text.caption, color: colors.muted },
});
