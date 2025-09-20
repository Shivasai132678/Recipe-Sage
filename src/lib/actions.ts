'use server';

import {
  recognizeIngredientsFromImage,
  RecognizeIngredientsFromImageInput,
} from '@/ai/flows/ingredient-recognition-from-image';
import {
  generateRecipesFromIngredients,
  GenerateRecipesFromIngredientsInput,
} from '@/ai/flows/generate-recipes-from-ingredients';
import { getNutritionFacts, NutritionFactsInput } from '@/ai/flows/nutrition-facts-for-recipe';
import {
  detectAllergensInRecipe,
  DetectAllergensInRecipeInput,
} from '@/ai/flows/allergen-detection-in-recipes';
import { generateRecipeImage, GenerateRecipeImageInput } from '@/ai/flows/generate-recipe-image';

export async function handleRecognizeIngredients(input: RecognizeIngredientsFromImageInput) {
  try {
    const result = await recognizeIngredientsFromImage(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to recognize ingredients.' };
  }
}

export async function handleGenerateRecipes(input: GenerateRecipesFromIngredientsInput) {
  try {
    const result = await generateRecipesFromIngredients(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate recipes.' };
  }
}

export async function handleGetNutrition(input: NutritionFactsInput) {
  try {
    const result = await getNutritionFacts(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get nutrition facts.' };
  }
}

export async function handleDetectAllergens(input: DetectAllergensInRecipeInput) {
  try {
    const result = await detectAllergensInRecipe(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to detect allergens.' };
  }
}

export async function handleGenerateRecipeImage(input: GenerateRecipeImageInput) {
  try {
    const result = await generateRecipeImage(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate image.' };
  }
}
