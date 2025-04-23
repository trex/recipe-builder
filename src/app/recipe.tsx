import { useMemo } from "react";
import { Ingredient } from "./ingredient";

interface RecipeProps {
  recipe: Ingredient[];
}

const nonNutritionalKeys = [
  "id",
  "label",
  "category",
  "group",
  "weightInGrams",
  "highProteinFatScore",
];

const nutrientsMeasuredInMillis = ["calcium", "phosphorus"];

export default function Recipe({ recipe }: RecipeProps) {
  // Calculate totals using useMemo for performance
  const nutritionTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};

    recipe.forEach((item) => {
      const factor = (item.weightInGrams || 0) / 100; // since nutrient values are per 100g

      for (const [key, value] of Object.entries(item)) {
        if (nonNutritionalKeys.includes(key)) continue;
        totals[key] = (totals[key] || 0) + value * factor;
      }
      totals["weight"] = (totals["weight"] || 0) + (item.weightInGrams || 0);
    });

    return totals;
  }, [recipe]);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white space-y-4 mt-6">
      <h2 className="text-2xl text-gray-700 font-semibold">Current Recipe</h2>

      {/* Recipe ingredients list */}
      {recipe.length === 0 ? (
        <p className="text-gray-700">No ingredients added yet.</p>
      ) : (
        <>
          <h3 className="text-xl text-gray-700 font-semibold mb-2">
            Total Weight ({nutritionTotals["weight"]} g)
          </h3>
          <ul className="list-disc list-inside">
            {recipe.map((item) => (
              <li key={item.id} className="text-gray-700">
                {item.label} - {item.weightInGrams}g
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Nutrition totals */}
      <div className="mt-6">
        <h3 className="text-xl text-gray-700 font-semibold mb-2">
          Nutrition Totals
        </h3>
        <ul className="space-y-1">
          {Object.entries(nutritionTotals).map(([key, value]) => (
            <li key={key} className="text-gray-700">
              <span className="capitalize">{key}</span>: {value.toFixed(2)}{" "}
              {nutrientsMeasuredInMillis.includes(key) ? "mg" : key}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
