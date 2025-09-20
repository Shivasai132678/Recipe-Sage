import { config } from 'dotenv';
config();

import '@/ai/flows/ingredient-recognition-from-image.ts';
import '@/ai/flows/nutrition-facts-for-recipe.ts';
import '@/ai/flows/generate-recipes-from-ingredients.ts';
import '@/ai/flows/allergen-detection-in-recipes.ts';
import '@/ai/flows/generate-recipe-image.ts';
import '@/services/unsplash.ts';
import '@/services/google-search.ts';
