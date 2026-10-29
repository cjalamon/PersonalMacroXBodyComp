// The circular "kcal eaten" ring on the Today screen.
// Drawn with SVG: a full gray circle, then a lime arc on top whose length
// is set with strokeDasharray / strokeDashoffset.

import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { colors, fonts } from "@/theme";

type Props = {
  eaten: number;
  goal: number;
  size?: number;   // "?" = optional prop with a default below
  stroke?: number;
};

export function EnergyRing({ eaten, goal, size = 100, stroke = 7 }: Props) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(eaten / goal, 1);

  return (
    <View style={{ width: size, height: size }}>
      {/* rotate -90° so the arc starts at 12 o'clock instead of 3 o'clock */}
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.panelDark}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          fill="none"
        />
      </Svg>

      {/* Number in the middle, laid over the SVG */}
      <View style={styles.center}>
        <Text style={styles.value}>{Math.round(eaten).toLocaleString()}</Text>
        <Text style={styles.label}>kcal eaten</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", gap: 2 },
  value: { fontFamily: fonts.semibold, fontSize: 20, letterSpacing: -0.6, color: colors.onDark },
  label: { fontFamily: fonts.regular, fontSize: 9, color: colors.onDarkMuted },
});
