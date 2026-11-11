import type { Macros } from "@/types";



export type FoodSearchResult = {
    fdcId: number;
    name: string;
    per100g: Macros;
};

type UsdaNutrient = {nutrientId: number; value: number;};
type UsdaFood = {fdcId: number; description: string; foodNutrients: UsdaNutrient[]};

const API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY;
const SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

//Find ID
function nutrient(food: UsdaFood, ...ids: number[]): number {

    for (const id of ids){
        const found = food.foodNutrients.find((n) => n.nutrientId === id);
        if(found){
            return found.value;
        }
    }
    return 0;
}

export async function searchFoods(query: string): Promise<FoodSearchResult[]>{

    const url = 
    `${SEARCH_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}` +
    `&pageSize=15&dataType=Foundation,SR%20Legacy, Branded`;

    const response = await fetch(url);
    if (response.ok === false){
        throw new Error(`USDA search failed: ${response.status}`);
    }
    const data = await  response.json();

    return data.foods.map((f: UsdaFood) => ({
        fdcId: f.fdcId,
        name: f.description,
        per100g: {
            calories: nutrient(f, 1008, 2047, 2048),
            protein: nutrient(f, 1003),
            carbs: nutrient(f, 1005),
            fat: nutrient(f, 1004),
        },
    }));

}

export function macrosFor(per100g: Macros, grams: number): Macros {

    return {
        calories: per100g.calories * grams / 100,
        protein: per100g.protein * grams / 100,
        carbs: per100g.carbs * grams / 100,
        fat: per100g.fat * grams / 100,
    };
}



