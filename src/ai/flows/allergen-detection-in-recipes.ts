'use server';
/**
 * @fileOverview Flow to detect potential allergens in a recipe based on user-specified allergies.
 *
 * - detectAllergensInRecipe - A function that analyzes a recipe and highlights potential allergens based on user-defined allergies.
 * - DetectAllergensInRecipeInput - The input type for the detectAllergensInRecipe function.
 * - DetectAllergensInRecipeOutput - The return type for the detectAllergensInRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAllergensInRecipeInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to analyze.'),
  ingredients: z.string().describe('A comma-separated list of ingredients in the recipe.'),
  allergies: z
    .string()
    .describe(
      'A comma-separated list of allergens the user is allergic to.  Example:  peanuts, shellfish, dairy'
    ),
});
export type DetectAllergensInRecipeInput = z.infer<
  typeof DetectAllergensInRecipeInputSchema
>;

const DetectAllergensInRecipeOutputSchema = z.object({
  allergenHighlights: z
    .string()
    .describe(
      'A list of ingredients in the recipe that are potential allergens for the user, based on their specified allergies.'
    ),
  allergenWarning: z
    .string()
    .describe(
      'A warning message if any of the recipe ingredients match the users specified allergies.'
    ),
});
export type DetectAllergensInRecipeOutput = z.infer<
  typeof DetectAllergensInRecipeOutputSchema
>;

export async function detectAllergensInRecipe(
  input: DetectAllergensInRecipeInput
): Promise<DetectAllergensInRecipeOutput> {
  return detectAllergensInRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAllergensInRecipePrompt',
  input: {schema: DetectAllergensInRecipeInputSchema},
  output: {schema: DetectAllergensInRecipeOutputSchema},
  prompt: `You are an expert nutritionist specializing in allergen detection in recipes.

You will analyze the ingredients in a recipe and determine if any of them are potential allergens for a user, based on their specified allergies.

Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}
User Allergies: {{{allergies}}}

Identify the ingredients that are potential allergens, and provide a warning message if any of the ingredients match the user's allergies.  For ingredients that may be allergenic, but not directly matching the allergy list, include them in the allergenHighlights as well with a qualifier such as "May contain".

Format your output as follows:
allergenHighlights: <comma separated list of allergens in the recipe>
allergenWarning: <A warning message if the recipe contains any of the specified allergens>
`,
});

const detectAllergensInRecipeFlow = ai.defineFlow(
  {
    name: 'detectAllergensInRecipeFlow',
    inputSchema: DetectAllergensInRecipeInputSchema,
    outputSchema: DetectAllergensInRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
