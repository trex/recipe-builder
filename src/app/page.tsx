"use client";

import { useEffect, useState } from "react";
import { Ingredient, getIngredients } from "./ingredient";
import Recipe from "./recipe";

const ingredients = getIngredients();

export default function Home() {
  const [selectedIngredient, setSelectedIngredient] = useState(
    ingredients[0].id
  );
  const [amount, setAmount] = useState("");
  const [recipe, setRecipe] = useState<Ingredient[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<
    { name: string; recipe: any[] }[]
  >([]);

  // When the recipe updates, save to localStorage
  useEffect(() => {
    if (recipe.length > 0) {
      localStorage.setItem("savedRecipe", JSON.stringify(recipe));
    }
  }, [recipe]);

  // On first load, try to restore saved recipe
  useEffect(() => {
    const saved = localStorage.getItem("savedRecipes");
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  const loadRecipe = (recipeToLoad: any[]) => {
    setRecipe(recipeToLoad);
  };

  const saveNewRecipe = () => {
    const name = prompt("Enter a name for your recipe:");
    if (!name) return;

    const savedRecipes = JSON.parse(
      localStorage.getItem("savedRecipes") || "[]"
    );

    // Add new one
    savedRecipes.push({ name, recipe });

    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
  };

  const handleAddIngredient = () => {
    if (!amount) return;

    const ingredientData = ingredients.find((i) => i.id === selectedIngredient);
    if (!ingredientData) return;

    const grams = Number(amount);

    setRecipe((prev) => [
      ...prev,
      {
        id: ingredientData.id,
        label: ingredientData.label,
        weightInGrams: grams,
        category: ingredientData.category,
        group: ingredientData.group,
        protein: ingredientData.protein,
        fat: ingredientData.fat,
        ash: ingredientData.ash,
        fiber: ingredientData.fiber,
        calcium: ingredientData.calcium,
        kcals: ingredientData.kcals,
        phosphorus: ingredientData.phosphorus,
        moisture: ingredientData.moisture,
        highProteinFatScore: ingredientData.highProteinFatScore,
      },
    ]);

    setAmount("");
  };

  return (
    <main className="min-h-screen bg-yellow-500 flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-2xl bg-cyan-50 rounded-2xl shadow-lg p-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Pet Food Recipe Builder
        </h1>

        <div className="flex gap-4 mb-4">
          <button
            onClick={saveNewRecipe}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save Current Recipe
          </button>

          <select
            className="px-4 py-2 bg-green-500 text-white rounded"
            onChange={(e) => {
              const selected = savedRecipes.find(
                (r) => r.name === e.target.value
              );
              if (selected) {
                loadRecipe(selected.recipe);
              }
            }}
          >
            <option value="">Load Saved Recipe</option>
            {savedRecipes.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <label className="flex flex-col">
            <span className="text-gray-700 mb-1 font-medium">
              Select Ingredient:
            </span>
            <select
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
              className="border border-gray-300 text-gray-700 rounded-lg p-2 focus:ring-blue-400 focus:border-blue-400"
            >
              {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 mb-1 font-medium">
              Amount (grams):
            </span>
            <input
              type="number"
              placeholder="Enter amount in grams"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 text-gray-700 rounded-lg p-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </label>

          <button
            onClick={handleAddIngredient}
            className="mt-2 bg-cyan-300 hover:bg-cyan-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
          >
            Add Ingredient
          </button>
        </div>
      </div>

      <Recipe recipe={recipe} />
    </main>
  );
}
