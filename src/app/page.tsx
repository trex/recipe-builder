'use client'

import { useState } from 'react';
import dummyIngredients from '@/app/data/dummyIngredients.json';

type Ingredient = {
  name: string;
  grams: number;
  protein: number;
  fat: number;
  calcium: number;
  calories: number;
  phosphorus: number;
  moisture: number;
};

const ingredients = dummyIngredients;

export default function Home() {
  const [selectedIngredient, setSelectedIngredient] = useState(ingredients[0].id);
  const [amount, setAmount] = useState('');
  const [recipe, setRecipe] = useState<Ingredient[]>([]);

  const handleAddIngredient = () => {
    if (!amount) return;
  
    const ingredientData = ingredients.find(i => i.id === selectedIngredient);
    if (!ingredientData) return;
  
    const grams = Number(amount);
    const scale = grams / 100;
  
    setRecipe(prev => [
      ...prev,
      {
        name: ingredientData.label,
        grams,
        protein: ingredientData.protein * scale,
        fat: ingredientData.fat * scale,
        calcium: ingredientData.calcium * scale,
        calories: ingredientData.calories * scale,
        phosphorus: ingredientData.phosphorus * scale,
        moisture: ingredientData.moisture * scale,
      },
    ]);
  
    setAmount('');
  };

  const getTotals = () => {
    return recipe.reduce(
      (totals, item) => ({
        protein: totals.protein + item.protein,
        fat: totals.fat + item.fat,
        calcium: totals.calcium + item.calcium,
        calories: totals.calories + item.calories,
        phosphorus: totals.phosphorus + item.phosphorus,
        moisture: totals.moisture + item.moisture,
      }),
      { protein: 0, fat: 0, calcium: 0, calories: 0, phosphorus: 0, moisture: 0 }
    );
  };

  const totals = getTotals();

  return (
    <main className="min-h-screen bg-yellow-500 flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-2xl bg-cyan-50 rounded-2xl shadow-lg p-8 mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Pet Food Recipe Builder
        </h1>

        <div className="flex flex-col gap-4 mb-8">
          <label className="flex flex-col">
            <span className="text-gray-700 mb-1 font-medium">Select Ingredient:</span>
            <select
              value={selectedIngredient}
              onChange={e => setSelectedIngredient(e.target.value)}
              className="border border-gray-300 text-gray-700 rounded-lg p-2 focus:ring-blue-400 focus:border-blue-400"
            >
              {ingredients.map(ingredient => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-gray-700 mb-1 font-medium">Amount (grams):</span>
            <input
              type="number"
              placeholder="Enter amount in grams"
              value={amount}
              onChange={e => setAmount(e.target.value)}
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

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Current Recipe</h2>
          {recipe.length === 0 ? (
            <p className="text-gray-700">No ingredients added yet.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {recipe.map((item, index) => (
                <li key={index} className="text-gray-700">
                  <span className="font-medium">{item.name}</span>: {item.grams}g
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nutrition Totals</h2>
        <ul className="space-y-1 text-gray-700">
          <li><strong>Protein:</strong> {totals.protein.toFixed(1)} g</li>
          <li><strong>Fat:</strong> {totals.fat.toFixed(1)} g</li>
          <li><strong>Calcium:</strong> {totals.calcium.toFixed(1)} mg</li>
          <li><strong>Calories:</strong> {totals.calories.toFixed(0)} kcal</li>
          <li><strong>Phosphorus:</strong> {totals.phosphorus.toFixed(1)} mg</li>
          <li><strong>Moisture:</strong> {totals.moisture.toFixed(1)} g</li>
        </ul>
      </div>
    </main>
  );
}
