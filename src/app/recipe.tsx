import { useState } from "react";
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
  const [servingSize, setServingSize] = useState(100);

  const totalWeight = recipe.reduce(
    (sum, item) => sum + (item.weightInGrams || 0),
    0
  );
  const scaleFactor = servingSize / totalWeight;

  const nutritionTotals = {
    protein:
      recipe.reduce(
        (sum, item) =>
          sum + item.protein * ((item.weightInGrams || 0) / totalWeight),
        0
      ) * scaleFactor,
    fat:
      recipe.reduce(
        (sum, item) =>
          sum + item.fat * ((item.weightInGrams || 0) / totalWeight),
        0
      ) * scaleFactor,
    ash:
      recipe.reduce(
        (sum, item) =>
          sum + item.ash * ((item.weightInGrams || 0) / totalWeight),
        0
      ) * scaleFactor,
    fiber:
      recipe.reduce(
        (sum, item) =>
          sum + item.fiber * ((item.weightInGrams || 0) / totalWeight),
        0
      ) * scaleFactor,
    calcium:
      recipe.reduce(
        (sum, item) =>
          sum + item.calcium * ((item.weightInGrams || 0) / totalWeight),
        0
      ) * scaleFactor,
    phosphorus:
      recipe.reduce(
        (sum, item) =>
          sum + item.phosphorus * ((item.weightInGrams || 0) / totalWeight),
        0
      ) * scaleFactor,
    moisture:
      recipe.reduce(
        (sum, item) =>
          sum + item.moisture * ((item.weightInGrams || 0) / totalWeight),
        0
      ) * scaleFactor,
    kcals:
      recipe.reduce(
        (sum, item) =>
          sum + item.kcals * ((item.weightInGrams || 0) / totalWeight),
        0
      ) * scaleFactor,
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white space-y-4 mt-6">
      <h2 className="text-2xl text-gray-700 font-semibold">Current Recipe</h2>

      {/* Recipe ingredients list */}
      {recipe.length === 0 ? (
        <p className="text-gray-700">No ingredients added yet.</p>
      ) : (
        <>
          <h3 className="text-xl text-gray-700 font-semibold mb-2">
            Total Weight ({totalWeight} g)
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Serving Size (in grams):
          </label>
          <input
            type="number"
            value={servingSize}
            onChange={(e) => setServingSize(Number(e.target.value))}
            className="mt-1 p-2 border rounded w-32 text-gray-700"
            min={1}
          />{" "}
        </div>
        <ul className="space-y-1">
          {Object.entries(nutritionTotals).map(([key, value]) => (
            <li key={key} className="text-gray-700">
              <span className="capitalize">{key}</span>: {value.toFixed(2)}{" "}
              {nutrientsMeasuredInMillis.includes(key) ? "mg" : "g"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
