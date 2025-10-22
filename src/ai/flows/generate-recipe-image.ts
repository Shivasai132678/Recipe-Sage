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
import { PlaceHolderImages } from '@/lib/placeholder-images';

const GenerateRecipeImageInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to generate an image for.'),
});
export type GenerateRecipeImageInput = z.infer<typeof GenerateRecipeImageInputSchema>;

const GenerateRecipeImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
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
    const query = `${input.recipeName} food photography`;

    // 1. Try Google Custom Search first for the most relevant images.
    try {
      imageUrl = await searchGoogleImages(query);
    } catch (error) {
      console.error('Error fetching image from Google Search:', error);
    }

    // 2. Fallback to Unsplash if Google Search fails or returns no image.
    if (!imageUrl) {
      try {
        imageUrl = await searchUnsplash(query);
      } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
      }
    }
    
    // 3. Fallback to a generic food placeholder if both APIs fail.
    if (!imageUrl) {
      // Use the placeholder image with hint "cooked meal"
      const placeholder = PlaceHolderImages.find(p => p.imageHint === 'cooked meal');
      imageUrl = placeholder ? placeholder.imageUrl : 'https://picsum.photos/seed/recipesage6/600/400'; // Final fallback
      console.error('All image services failed. Using placeholder image.');
    }

    return {
      imageUrl,
    };
  }
);
