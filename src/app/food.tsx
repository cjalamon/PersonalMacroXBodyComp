import { useEffect } from "react";

import { ComingSoon } from "@/components/coming-soon";
import { searchFoods } from "@/nutrition/usda";

export default function FoodScreen() {

  useEffect(() => {
    searchFoods("banana")
      .then((results) => console.log(JSON.stringify(results.slice(0, 3), null, 2)))
      .catch((error) => console.log("Search error:", error));


  }, []);
  return <ComingSoon eyebrow="FOOD JOURNAL" title="Log dinner" />;
}
