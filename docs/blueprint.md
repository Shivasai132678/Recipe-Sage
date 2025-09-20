# **App Name**: RecipeSage

## Core Features:

- Ingredient Input: Allow users to input ingredients via text, image upload, or fridge photo upload.
- Ingredient Recognition: Use Gemini Vision to identify ingredients from uploaded images and allow users to edit the detected ingredients. isAiContentDetection=true
- Recipe Generation: Generate personalized recipes using Gemini Pro, factoring in user location, current weather, and ingredient availability, using tools that can evaluate if the recipe incorporates the factors properly.
- Recipe Display: Display recipes in an appealing format with images, ingredients, steps, and context notes.
- Bookmark Recipes: Allow users to save favorite recipes to their profile.
- User Authentication: Implement Firebase authentication for user accounts and data management.
- Fridge Scan Optimization: Prioritize recipes that utilize a maximum number of detected fridge ingredients to reduce food waste.
- Recipe by Food Name: Allow users to enter a specific dish/food name and fetch the full recipe.
- Nutrition Facts: Display nutrition facts (calories, protein, carbs, fats, vitamins/minerals) for each recipe using an external API or Gemini Text.
- Allergen Detection & Alerts: Allow users to specify allergies and highlight common allergens present in each recipe. Warn if user-specified allergens are present.

## Style Guidelines:

- Primary color: Saturated orange (#F2994A) to evoke warmth and appetite.
- Background color: Light beige (#F5F5DC) to provide a clean, neutral backdrop.
- Accent color: Olive green (#6B8E23) to suggest freshness and health.
- Body font: 'PT Sans', a humanist sans-serif providing modern, readable text.
- Headline font: 'Playfair', a modern serif offering elegant headings (pair with 'PT Sans' for body).
- Use simple, outlined icons to represent ingredients, cooking steps, and recipe types.
- Card-based layout for recipe display, ensuring a clean and organized presentation.