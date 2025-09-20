'use server';
/**
 * @fileOverview Fetches nutritional information for a given recipe.
 *
 * - getNutritionFacts - A function that fetches the nutrition facts for a recipe.
 * - NutritionFactsInput - The input type for the getNutritionFacts function.
 * - NutritionFactsOutput - The return type for the getNutritionFacts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionFactsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to get nutrition facts for.'),
  ingredients: z.string().describe('The ingredients of the recipe.'),
  instructions: z.string().describe('The instructions of the recipe.'),
});
export type NutritionFactsInput = z.infer<typeof NutritionFactsInputSchema>;

const NutritionFactsOutputSchema = z.object({
  calories: z.string().describe('The number of calories in the recipe.'),
  protein: z.string().describe('The amount of protein in the recipe (in grams).'),
  carbs: z.string().describe('The amount of carbohydrates in the recipe (in grams).'),
  fat: z.string().describe('The amount of fat in the recipe (in grams).'),
  additionalInfo: z.string().optional().describe('Any additional nutritional information.'),
});
export type NutritionFactsOutput = z.infer<typeof NutritionFactsOutputSchema>;

export async function getNutritionFacts(input: NutritionFactsInput): Promise<NutritionFactsOutput> {
  return nutritionFactsFlow(input);
}

const nutritionFactsPrompt = ai.definePrompt({
  name: 'nutritionFactsPrompt',
  input: {schema: NutritionFactsInputSchema},
  output: {schema: NutritionFactsOutputSchema},
  prompt: `You are a nutrition expert. Given the recipe name, ingredients, and instructions, extract the nutrition facts, including calories, protein, carbs, and fats. Provide the information in a structured format.\n\nRecipe Name: {{{recipeName}}}\nIngredients: {{{ingredients}}}\nInstructions: {{{instructions}}}\n\nNutritional Information:`,
});

const nutritionFactsFlow = ai.defineFlow(
  {
    name: 'nutritionFactsFlow',
    inputSchema: NutritionFactsInputSchema,
    outputSchema: NutritionFactsOutputSchema,
  },
  async input => {
    const {output} = await nutritionFactsPrompt(input);
    return output!;
  }
);
