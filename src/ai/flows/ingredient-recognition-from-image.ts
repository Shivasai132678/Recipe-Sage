'use server';
/**
 * @fileOverview This file defines a Genkit flow for recognizing ingredients from an image.
 *
 * - recognizeIngredientsFromImage - A function that takes an image data URI as input and returns a list of identified ingredients.
 * - RecognizeIngredientsFromImageInput - The input type for the recognizeIngredientsFromImage function.
 * - RecognizeIngredientsFromImageOutput - The return type for the recognizeIngredientsFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeIngredientsFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of fridge contents, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type RecognizeIngredientsFromImageInput = z.infer<typeof RecognizeIngredientsFromImageInputSchema>;

const RecognizeIngredientsFromImageOutputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of ingredients identified in the image.'),
});
export type RecognizeIngredientsFromImageOutput = z.infer<typeof RecognizeIngredientsFromImageOutputSchema>;

export async function recognizeIngredientsFromImage(
  input: RecognizeIngredientsFromImageInput
): Promise<RecognizeIngredientsFromImageOutput> {
  return recognizeIngredientsFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recognizeIngredientsFromImagePrompt',
  input: {schema: RecognizeIngredientsFromImageInputSchema},
  output: {schema: RecognizeIngredientsFromImageOutputSchema},
  prompt: `You are an AI assistant that identifies ingredients from a photo of a fridge.

  Analyze the image and extract a list of distinct ingredients present in the fridge.  Respond with just a simple list of ingredients.

  Photo: {{media url=photoDataUri}}`,
});

const recognizeIngredientsFromImageFlow = ai.defineFlow(
  {
    name: 'recognizeIngredientsFromImageFlow',
    inputSchema: RecognizeIngredientsFromImageInputSchema,
    outputSchema: RecognizeIngredientsFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
