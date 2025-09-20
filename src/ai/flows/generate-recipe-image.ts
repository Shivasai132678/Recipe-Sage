'use server';
/**
 * @fileOverview A flow for generating an image for a recipe.
 *
 * - generateRecipeImage - A function that generates an image for a given recipe name.
 * - GenerateRecipeImageInput - The input type for the generateRecipeImage function.
 * - GenerateRecipeImageOutput - The return type for the generateRecipeImage function.
 */
import {ai} from '@/ai/genkit';
import {searchUnsplash} from '@/services/unsplash';
import {searchGoogleImages} from '@/services/google-search';
import {z} from 'genkit';

const GenerateRecipeImageInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to generate an image for.'),
});
export type GenerateRecipeImageInput = z.infer<typeof GenerateRecipeImageInputSchema>;

const GenerateRecipeImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateRecipeImageOutput = z.infer<typeof GenerateRecipeImageOutputSchema>;

export async function generateRecipeImage(
  input: GenerateRecipeImageInput
): Promise<GenerateRecipeImageOutput> {
  return generateRecipeImageFlow(input);
}

const generateRecipeImageFlow = ai.defineFlow(
  {
    name: 'generateRecipeImageFlow',
    inputSchema: GenerateRecipeImageInputSchema,
    outputSchema: GenerateRecipeImageOutputSchema,
  },
  async input => {
    let imageUrl;

    // 1. Try Google Custom Search first
    try {
      imageUrl = await searchGoogleImages(input.recipeName);
    } catch (error) {
      console.error('Error fetching image from Google Search.', error);
    }

    // 2. Fallback to Unsplash if Google Search fails or returns no image
    if (!imageUrl) {
      try {
        imageUrl = await searchUnsplash(input.recipeName);
      } catch (error) {
        console.error('Error fetching image from Unsplash.', error);
      }
    }
    
    // 3. Fallback to a generic placeholder if both fail
    if (!imageUrl) {
      imageUrl = `https://picsum.photos/seed/${input.recipeName.replace(
        /\s+/g,
        ''
      )}/600/400`;
    }

    return {
      imageUrl,
    };
  }
);
