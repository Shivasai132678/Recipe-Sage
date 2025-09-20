export type Recipe = {
  name: string;
  ingredients: string;
  instructions: string;
  contextNotes?: string;
  imageUrl?: string;
};

export type NutritionFacts = {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  additionalInfo?: string;
};

export type AllergenInfo = {
  allergenHighlights: string;
  allergenWarning: string;
};
