'use server';
/**
 * @fileOverview A flow for generating an image for a recipe.
 *
 * - generateRecipeImage - A function that generates an image for a given recipe name.
 * - GenerateRecipeImageInput - The input type for the generateRecipeImage function.
 * - GenerateRecipeImageOutput - The return type for the generateRecipeImage function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

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
    try {
      const {media} = await ai.generate({
        model: googleAI.model('imagen-4.0-fast-generate-001'),
        prompt: `A high-quality, professional photograph of ${input.recipeName}, ready for a food blog.`,
      });
      return {imageUrl: media.url};
    } catch (e) {
      console.error('Image generation failed, using placeholder', e);
      const seed = Math.floor(Math.random() * 1000) + 1;
      return {
        imageUrl: `https://picsum.photos/seed/recipesage${seed}/600/400`,
      };
    }
  }
);
