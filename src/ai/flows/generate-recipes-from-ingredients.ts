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

const GenerateRecipesFromIngredientsInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients to use in the recipe.'),
  location: z.string().optional().describe('The user\u2019s location.'),
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

  Generate a few diverse recipes using the ingredients provided. Consider the user's location and the current weather to suggest appropriate dishes.

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
    return output!;
  }
);
