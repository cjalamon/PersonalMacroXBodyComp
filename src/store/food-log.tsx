import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { FoodEntry } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FoodLogContextValue = {
  foods: FoodEntry[];
  addFood: (entry: Omit<FoodEntry, "id" | "loggedAt">) => void;
  removeFood: (id: string) => void;
};

const FoodLogContext = createContext<FoodLogContextValue | null>(null);

export function FoodLogProvider({children} : {children : ReactNode}) {
    const [foods, setFoods] = useState<FoodEntry[]>([]);
    const[loaded, setLoaded] = useState(false);
    const STORAGE_KEY = "food-log";

    useEffect(() => {

        async function load(){
            const text = await AsyncStorage.getItem(STORAGE_KEY);

            if(text !== null){
                const saved = JSON.parse(text);
                const fixed: FoodEntry[] = saved.map((f: FoodEntry) => ({
                ...f,
                loggedAt: new Date(f.loggedAt),
                }));

                setFoods(fixed);
            }
            setLoaded(true);
        }

        load();

    }, []);

    
    useEffect(() => {
        if(!loaded){
            return;
        }
        const text = JSON.stringify(foods);
        AsyncStorage.setItem(STORAGE_KEY, text);

    }, [foods,loaded]);

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