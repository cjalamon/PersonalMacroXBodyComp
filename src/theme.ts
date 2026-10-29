// src/theme.ts
// Design values taken directly from the Figma file (MacroXBodyComp.fig).
// Every screen imports from here, so changing a value here changes it everywhere.

export const colors = {
  // Backgrounds
  background: "#F5F3ED", // cream page background
  card: "#FFFEFA",       // light cards, tab bar
  cardDark: "#262D24",   // dark green "Daily energy" / "Body weight" card
  panelDark: "#424A3C",  // panels and badges inside the dark card, ring track
  softGreen: "#EAF1DE",  // tags, info boxes, selected tab pill

  // Accent
  accent: "#C1EB78",     // lime: primary buttons, ring, progress bars
  accentText: "#49752E", // green links, eyebrow labels, icons

  // Text
  ink: "#232820",        // main text (also the avatar background)
  muted: "#777A70",      // secondary text and icons
  onDark: "#F8F8EE",     // text on the dark card
  onDarkMuted: "#B7BFB0",// secondary text on the dark card

  // Lines
  divider: "#E3E3D9",
};

// Inter, loaded in src/app/_layout.tsx.
// In React Native, custom fonts pick their weight by family name, not fontWeight.
export const fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
};

export const spacing = {
  page: 22,       // left/right padding on every screen
  pageTop: 12,
  section: 20,    // gap between sections on a screen
  cardPadding: 22,
};

export const radius = {
  panel: 14,  // panels inside cards (Activity row)
  card: 22,   // big cards
  pill: 999,  // buttons, badges, avatar, progress bars
};

// Text styles used across the screens (size and letter spacing from Figma).
export const text = {
  eyebrow: { fontFamily: fonts.regular, fontSize: 11, letterSpacing: 2.5 },
  pageTitle: { fontFamily: fonts.regular, fontSize: 32, letterSpacing: -1.3 },
  sectionTitle: { fontFamily: fonts.regular, fontSize: 19, letterSpacing: -0.5 },
  cardLabel: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.4 },
  body: { fontFamily: fonts.regular, fontSize: 13 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 13 },
  caption: { fontFamily: fonts.regular, fontSize: 10 },
  link: { fontFamily: fonts.semibold, fontSize: 12 },
  button: { fontFamily: fonts.bold, fontSize: 14 },
} as const;
