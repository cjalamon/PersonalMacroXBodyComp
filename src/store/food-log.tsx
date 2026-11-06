import { createContext, useContext, useState, type ReactNode } from "react";
import type { FoodEntry } from "@/types";

type FoodLogContextValue = {
  foods: FoodEntry[];
  addFood: (entry: Omit<FoodEntry, "id" | "loggedAt">) => void;
  removeFood: (id: string) => void;
};

const FoodLogContext = createContext<FoodLogContextValue | null>(null);

export function FoodLogProvider({children} : {children : ReactNode}) {
    const [foods, setFoods] = useState<FoodEntry[]>([]);

    function addFood(entry : Omit<FoodEntry, "id" | "loggedAt">){

        const newFood: FoodEntry = {...entry, id:Date.now().toString(), loggedAt: new Date() };

        setFoods([...foods, newFood]);
    }

    function removeFood(id:string){
        setFoods(foods.filter((f) => f.id !== id));
    }

    return (
        <FoodLogContext.Provider value = {{foods, addFood, removeFood}}>
            {children}
        </FoodLogContext.Provider>
    );

}

export function useFoodLog(): FoodLogContextValue{
    const value = useContext(FoodLogContext);
    
    if(value === null){
        throw new Error("useFoodLog must be used in FoodLogProvider");
    } 
    return value;
}