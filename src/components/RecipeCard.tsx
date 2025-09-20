'use client';

import Image from 'next/image';
import type { Recipe } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const imageUrl = recipe.imageUrl || `https://picsum.photos/seed/recipesage${Math.random()}/600/400`;
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={recipe.name}
            fill
            className="object-cover"
            data-ai-hint="cooked meal"
          />
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="font-headline text-xl leading-tight">
            {recipe.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Button onClick={() => onSelect(recipe)} className="w-full">
          <Eye className="mr-2" /> View Recipe
        </Button>
      </CardContent>
    </Card>
  );
}
