// src/types.ts
// Shared data shapes. Think of these like Java classes with only fields.

export type Macros = {
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
};

export type Meal = "breakfast" | "lunch" | "dinner" | "snack";

export type FoodEntry = {
  id: string;
  name: string;
  grams: number;
  macros: Macros;
  meal: Meal;
  loggedAt: Date;
};

export type BodyComposition = {
  weightLbs: number;
  bodyFatPct?: number; // "?" means optional, like a field that may be null
  takenAt: Date;
};

export type Activity = {
  steps: number;
  caloriesBurned: number;
};
