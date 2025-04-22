import petSuitableIngredients from '@/app/data/petSuitableIngredients.json';

export interface Ingredient {
    id: string;
    label: string;
    grams?: number;
    category: string;
    group: string;
    protein: number;
    fat: number;
    calcium: number;
    calories: number;
    phosphorus: number;
    moisture: number;
    highProteinFatScore: number;
};

export function getIngredients(): Ingredient[] {
    return petSuitableIngredients;
}