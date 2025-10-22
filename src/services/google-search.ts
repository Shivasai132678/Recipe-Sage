'use server';

import fetch from 'node-fetch';

/**
 * Fetches a recipe image URL from Google Custom Search.
 * @param query The search query, typically the recipe name.
 * @returns A promise that resolves to the image URL or null if not found.
 */
export async function searchGoogleImages(query: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_CX;

  if (!apiKey || !cx) {
    console.warn('Google Custom Search API key or CX is not configured. Skipping search.');
    return null;
  }

  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    query + ' food recipe'
  )}&searchType=image&num=1&key=${apiKey}&cx=${cx}&imgSize=large`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Google Search API error: ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error Body:', errorBody);
      return null;
    }
    const data: any = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    }
    return null;
  } catch (error) {
    console.error('Error fetching from Google Custom Search:', error);
    return null;
  }
}
