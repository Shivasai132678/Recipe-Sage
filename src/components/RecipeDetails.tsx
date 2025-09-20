'use client';

import { useState } from 'react';
import type { Recipe, NutritionFacts, AllergenInfo } from '@/lib/types';
import { handleGetNutrition, handleDetectAllergens } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface RecipeDetailsProps {
  recipe: Recipe;
}

export default function RecipeDetails({ recipe }: RecipeDetailsProps) {
  const [nutrition, setNutrition] = useState<NutritionFacts | null>(null);
  const [isNutritionLoading, setIsNutritionLoading] = useState(false);
  const [allergenInfo, setAllergenInfo] = useState<AllergenInfo | null>(null);
  const [isAllergenLoading, setIsAllergenLoading] = useState(false);
  const [userAllergies, setUserAllergies] = useState('');
  const { toast } = useToast();

  const fetchNutrition = async () => {
    setIsNutritionLoading(true);
    const result = await handleGetNutrition({
      recipeName: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });
    if (result.success && result.data) {
      setNutrition(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsNutritionLoading(false);
  };

  const checkAllergens = async () => {
    if (!userAllergies.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter your allergies.',
      });
      return;
    }
    setIsAllergenLoading(true);
    const result = await handleDetectAllergens({
      recipeName: recipe.name,
      ingredients: recipe.ingredients,
      allergies: userAllergies,
    });
    if (result.success && result.data) {
      setAllergenInfo(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsAllergenLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline text-2xl font-semibold">Ingredients</h3>
        <p className="mt-2 text-muted-foreground whitespace-pre-line">{recipe.ingredients}</p>
      </div>

      <Separator />

      <div>
        <h3 className="font-headline text-2xl font-semibold">Instructions</h3>
        <p className="mt-2 text-muted-foreground whitespace-pre-line">{recipe.instructions}</p>
      </div>

      {recipe.contextNotes && (
        <>
          <Separator />
          <div>
            <h3 className="font-headline text-2xl font-semibold">Chef's Notes</h3>
            <p className="mt-2 text-muted-foreground">{recipe.contextNotes}</p>
          </div>
        </>
      )}

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Nutrition Facts</CardTitle>
        </CardHeader>
        <CardContent>
          {!nutrition && (
            <Button onClick={fetchNutrition} disabled={isNutritionLoading} className="w-full">
              {isNutritionLoading ? <Loader2 className="animate-spin" /> : 'Show Nutrition Facts'}
            </Button>
          )}
          {nutrition && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-lg font-bold">{nutrition.calories}</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-lg font-bold">{nutrition.protein}</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="text-lg font-bold">{nutrition.carbs}</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Fat</p>
                <p className="text-lg font-bold">{nutrition.fat}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Allergen Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex w-full items-center space-x-2">
            <Input 
              type="text" 
              placeholder="e.g., peanuts, shellfish, dairy" 
              value={userAllergies}
              onChange={(e) => setUserAllergies(e.target.value)}
            />
            <Button onClick={checkAllergens} disabled={isAllergenLoading}>
              {isAllergenLoading ? <Loader2 className="animate-spin" /> : 'Check'}
            </Button>
          </div>
          {allergenInfo && (
            <div>
              {allergenInfo.allergenWarning && (
                <div className="flex items-start gap-2 text-destructive-foreground bg-destructive p-3 rounded-md mb-4">
                    <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                    <p className="font-semibold">{allergenInfo.allergenWarning}</p>
                </div>
              )}
              {allergenInfo.allergenHighlights && (
                 <div>
                    <h4 className="font-semibold mb-2">Potential Allergens Found:</h4>
                    <div className="flex flex-wrap gap-2">
                        {allergenInfo.allergenHighlights.split(',').map(item => item.trim()).filter(Boolean).map((item, index) => (
                            <Badge key={index} variant="secondary">{item}</Badge>
                        ))}
                    </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
