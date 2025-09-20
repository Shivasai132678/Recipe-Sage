// src/ai/flows/generate-recipes-from-ingredients.ts
'use server';
/**
 * @fileOverview Generates personalized recipes from a list of ingredients.
 *
 * - generateRecipesFromIngredients - A function that generates recipes based on the provided ingredients.
 * - GenerateRecipesFromIngredientsInput - The input type for the generateRecipesFromIngredients function.
 * - GenerateRecipesFromIngredientsOutput - The return type for the generateRecipesFromIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generateRecipeImage} from './generate-recipe-image';

const GenerateRecipesFromIngredientsInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients to use in the recipe.'),
  location: z.string().optional().describe('The user’s location.'),
  weather: z.string().optional().describe('The current weather conditions.'),
});
export type GenerateRecipesFromIngredientsInput = z.infer<
  typeof GenerateRecipesFromIngredientsInputSchema
>;

const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('A list of ingredients required for the recipe.'),
  instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
  contextNotes: z.string().optional().describe('Additional notes or tips about the recipe.'),
  imageUrl: z.string().optional().describe('URL of an image for the recipe.'),
});

const GenerateRecipesFromIngredientsOutputSchema = z.object({
  recipes: z.array(RecipeSchema).describe('An array of generated recipes.'),
});
export type GenerateRecipesFromIngredientsOutput = z.infer<
  typeof GenerateRecipesFromIngredientsOutputSchema
>;

export async function generateRecipesFromIngredients(
  input: GenerateRecipesFromIngredientsInput
): Promise<GenerateRecipesFromIngredientsOutput> {
  return generateRecipesFromIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipesFromIngredientsPrompt',
  input: {schema: GenerateRecipesFromIngredientsInputSchema},
  output: {schema: GenerateRecipesFromIngredientsOutputSchema},
  prompt: `You are a professional chef who specializes in creating personalized recipes based on available ingredients, user location, and current weather conditions.

  Generate 5-6 diverse and highly relevant recipes using the ingredients provided. 
  
  If the user provides a specific dish name (like "Chicken Biryani"), the first recipe in the list MUST be for that exact dish. The subsequent recipes should be related variations or other dishes that can be made with some of the same core ingredients.

  Prioritize recipes that utilize a maximum number of the provided ingredients to reduce food waste.

  Location: {{{location}}}
  Weather: {{{weather}}}
  Ingredients: {{{ingredients}}}

  Recipes:`,
});

const generateRecipesFromIngredientsFlow = ai.defineFlow(
  {
    name: 'generateRecipesFromIngredientsFlow',
    inputSchema: GenerateRecipesFromIngredientsInputSchema,
    outputSchema: GenerateRecipesFromIngredientsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return {recipes: []};
    }
    const imagePromises = output.recipes.map(recipe =>
      generateRecipeImage({recipeName: recipe.name})
    );
    const images = await Promise.all(imagePromises);
    const recipesWithImages = output.recipes.map((recipe, index) => ({
      ...recipe,
      imageUrl: images[index].imageUrl,
    }));

    return {recipes: recipesWithImages};
  }
);
