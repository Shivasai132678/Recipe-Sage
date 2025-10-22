# 🍳 RecipeSage: Your Intelligent Culinary Assistant

RecipeSage is a Next.js application that acts as your personal AI chef. It helps you discover new recipes, reduce food waste, and get nutritional information for your meals. Simply tell it what ingredients you have, and it will whip up some delicious ideas for you!

## ✨ Features

- **Ingredient-Based Recipe Generation:** Enter a list of ingredients, and the AI will generate multiple creative recipes for you.
- **Image Recognition:** Snap a photo of your fridge, and the app will automatically detect the ingredients inside.
- **Location-Aware Suggestions:** Optionally uses your location to suggest recipes that might be suitable for your local climate or context.
- **Detailed Recipe View:** View full recipe details including ingredients, step-by-step instructions, and chef's notes.
- **Nutritional Analysis:** Get a breakdown of key nutritional facts (calories, protein, carbs, fat) for any recipe.
- **Allergen Detection:** Check recipes against a list of your personal allergies to stay safe.
- **Visually Appealing:** Each recipe is accompanied by a beautiful, relevant food image.

## 🚀 Getting Started

To get the application running on your local machine, follow these steps.

### 1. Install Dependencies

First, install the project dependencies using npm (or your preferred package manager):

```bash
npm install
```

### 2. Set Up Environment Variables

This project relies on several external services for its AI and image features. Copy the `.env.example` file to a new `.env` file and fill in the required API keys.

```bash
cp .env .env.local
```

You will need to add the following keys to your `.env.local` file:

- `GOOGLE_API_KEY`: Your API key for Google AI (Gemini).
- `GOOGLE_CUSTOM_SEARCH_CX`: Your Google Custom Search Engine ID for image search.
- `UNSPLASH_ACCESS_KEY`: Your access key for the Unsplash API for fallback image search.

### 3. Run the Development Server

Once the dependencies are installed and the environment variables are set, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** [Google Genkit](https://firebase.google.com/docs/genkit) with [Gemini](https://deepmind.google/technologies/gemini/)
- **Image Search:** [Google Custom Search API](https://developers.google.com/custom-search) & [Unsplash API](https://unsplash.com/developers)
