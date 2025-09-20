'use client';

import { useState, useRef } from 'react';
import { handleRecognizeIngredients, handleGenerateRecipes } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Camera, Sparkles, ChefHat } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import RecipeCard from './RecipeCard';
import RecipeDetails from './RecipeDetails';
import type { Recipe } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

export default function RecipeSageApp() {
  const [ingredientsText, setIngredientsText] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRecognizing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const result = await handleRecognizeIngredients({ photoDataUri: base64String });

      if (result.success && result.data) {
        setIngredientsText(result.data.ingredients.join('\n'));
        toast({ title: 'Success', description: 'Ingredients detected from image!' });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
      setIsRecognizing(false);
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset file input
  };

  const generateRecipes = async () => {
    if (!ingredientsText.trim()) {
      toast({
        variant: 'destructive',
        title: 'No Ingredients',
        description: 'Please add some ingredients first.',
      });
      return;
    }

    setIsGenerating(true);
    setRecipes([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = `${position.coords.latitude}, ${position.coords.longitude}`;
        const result = await handleGenerateRecipes({ ingredients: ingredientsText, location });
        handleRecipeGenerationResult(result);
      },
      async () => {
        // Geolocation failed or denied, generate without location
        toast({ title: 'Notice', description: 'Could not get location. Generating recipes without it.' });
        const result = await handleGenerateRecipes({ ingredients: ingredientsText });
        handleRecipeGenerationResult(result);
      }
    );
  };
  
  const handleRecipeGenerationResult = (result: { success: boolean; data?: any; error?: string }) => {
    if (result.success && result.data?.recipes) {
      setRecipes(result.data.recipes);
      if (result.data.recipes.length === 0) {
        toast({ title: 'No recipes found', description: 'Try adding more or different ingredients.' });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsGenerating(false);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
          What's in your fridge?
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Tell us the ingredients you have, and our AI chef will whip up some delicious recipes for you. Reduce food waste and discover new meals!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="space-y-4">
          <Label htmlFor="ingredients" className="text-lg font-semibold">Your Ingredients</Label>
          <Textarea
            id="ingredients"
            placeholder="e.g.,&#10;Chicken breast&#10;Broccoli&#10;Garlic&#10;Soy sauce"
            rows={8}
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            className="text-base"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isRecognizing}
              className="w-full"
              variant="secondary"
            >
              {isRecognizing ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Camera className="mr-2" />
              )}
              Scan with Camera
            </Button>
            <Button onClick={generateRecipes} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Sparkles className="mr-2" />
              )}
              Generate Recipes
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-secondary/50 rounded-lg border border-dashed text-center">
            <ChefHat className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-headline text-2xl font-semibold">Ready for a culinary adventure?</h3>
            <p className="text-muted-foreground mt-2">
                Enter your ingredients manually or upload a photo of your fridge. Our AI will create magic!
            </p>
        </div>
      </div>
      
      {(isGenerating || recipes.length > 0) && <Separator className="my-12" />}

      <div>
        {isGenerating && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4 rounded-lg border p-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        )}

        {recipes.length > 0 && (
          <>
            <h2 className="text-center font-headline text-4xl font-bold mb-8">
              Your Personalized Recipes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} onSelect={handleSelectRecipe} />
              ))}
            </div>
          </>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <ScrollArea className="h-full w-full pr-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="font-headline text-4xl break-words">
                {selectedRecipe?.name}
              </SheetTitle>
            </SheetHeader>
            {selectedRecipe && <RecipeDetails recipe={selectedRecipe} />}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
