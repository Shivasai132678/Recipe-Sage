'use server';

import {createApi} from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

export async function searchUnsplash(query: string): Promise<string | null> {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${query} food`,
      page: 1,
      perPage: 1,
      orientation: 'landscape',
    });

    if (result.type === 'success') {
      const photo = result.response.results[0];
      return photo?.urls.regular || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    return null;
  }
}
